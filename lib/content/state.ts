import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type {
  AcceptedRevision,
  LiveContentIndex,
  ManagedPage,
  PageCurrentState,
} from "@/content/types";
import { managedPageSchema } from "@/lib/content/contracts";
import {
  acceptedAtFromRevisionId,
  buildRedirectsFile,
} from "@/lib/content/metadata";
import { parseDraftSource } from "@/lib/content/markdown";
import {
  archiveCurrentPath,
  archiveRevisionPath,
  pageCurrentPath,
  pageRevisionsDir,
  resolveContentPaths,
  type ContentPaths,
} from "@/lib/content/paths";

export type RecoveryEntry = {
  files: string[];
  id: string;
  note: {
    message: string;
    originalPaths: string[];
    reason: string;
    recoveredAt: string;
  };
};

export type AuditSummary = {
  livePages: number;
  quarantined: string[];
  regenerated: string[];
};

export type SubmitSummary = {
  action: "accepted";
  archiveCurrentPath: string;
  archiveRevisionPath: string;
  livePages: number;
  page: ManagedPage;
  quarantined: string[];
};

export type CheckSummary =
  | {
      ok: false;
      page?: undefined;
      issues: Array<{ line?: number; message: string }>;
    }
  | {
      ok: true;
      page: ManagedPage;
      issues: [];
    };

type IntegrityState = {
  files: Record<string, string>;
};

type ArchiveProjection = {
  latest: AcceptedRevision;
  revisions: AcceptedRevision[];
};

function stableJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function hashText(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function shortHash(value: string) {
  return hashText(value).slice(0, 12);
}

function timestampForId(date = new Date()) {
  return date.toISOString().replace(/[-:.]/g, "").replace("T", "-").replace("Z", "");
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeAtomic(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tempPath, content, "utf8");
  fs.renameSync(tempPath, filePath);
}

function writeJsonAtomic(filePath: string, value: unknown) {
  writeAtomic(filePath, `${stableJson(value)}\n`);
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function fileExists(filePath: string) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function listDirs(dir: string) {
  if (!fileExists(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function listFiles(dir: string) {
  if (!fileExists(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function toPosix(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function relativeFromRoot(paths: ContentPaths, filePath: string) {
  return toPosix(path.relative(paths.rootDir, filePath));
}

function makeRecoveryId(label: string) {
  return `${timestampForId()}-${label || "recovered"}`;
}

function sanitizeLabel(label: string) {
  return label.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function quarantinePaths(
  paths: ContentPaths,
  entries: Array<{ filePath: string; preferredLabel?: string }>,
  reason: string,
  message: string
) {
  if (!entries.length) return null;

  ensureDir(paths.recoveryDir);
  const label = sanitizeLabel(entries[0]?.preferredLabel || path.basename(entries[0].filePath));
  const recoveryId = makeRecoveryId(label);
  const recoveryPath = path.join(paths.recoveryDir, recoveryId);
  ensureDir(recoveryPath);

  const moved: string[] = [];
  const originalPaths: string[] = [];

  for (const entry of entries) {
    if (!fileExists(entry.filePath)) continue;
    const basename = path.basename(entry.filePath);
    const targetPath = path.join(recoveryPath, basename);
    fs.renameSync(entry.filePath, targetPath);
    moved.push(relativeFromRoot(paths, targetPath));
    originalPaths.push(relativeFromRoot(paths, entry.filePath));
  }

  const note = {
    message,
    originalPaths,
    reason,
    recoveredAt: new Date().toISOString(),
  };

  writeJsonAtomic(path.join(recoveryPath, "note.json"), note);
  return { files: moved, id: recoveryId, note };
}

function gatherMarkdownFiles(dir: string): string[] {
  if (!fileExists(dir)) return [];
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...gatherMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }

  return results.sort();
}

function gatherFiles(dir: string): string[] {
  if (!fileExists(dir)) return [];
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...gatherFiles(fullPath));
      continue;
    }
    if (entry.isFile()) {
      results.push(fullPath);
    }
  }

  return results.sort();
}

function hasHiddenState(paths: ContentPaths) {
  return gatherFiles(paths.pagesDir).length > 0;
}

function archiveRevisionSources(paths: ContentPaths) {
  return gatherMarkdownFiles(paths.archiveDir).filter((filePath) =>
    toPosix(filePath).includes("/revisions/")
  );
}

function normalizeIntegrity(candidate: unknown): IntegrityState {
  if (!candidate || typeof candidate !== "object") {
    return { files: {} };
  }

  const filesEntries =
    "files" in candidate && candidate.files && typeof candidate.files === "object"
      ? Object.entries(candidate.files as Record<string, unknown>).filter(
          ([, value]) => typeof value === "string"
        )
      : [];
  const files = Object.fromEntries(filesEntries) as Record<string, string>;

  return { files };
}

function loadIntegrity(paths: ContentPaths): IntegrityState {
  return normalizeIntegrity(readJson<IntegrityState>(paths.integrityPath));
}

function writeIntegrity(paths: ContentPaths, integrity: IntegrityState) {
  writeJsonAtomic(paths.integrityPath, integrity);
}

function generatedKey(paths: ContentPaths, filePath: string) {
  return relativeFromRoot(paths, filePath);
}

function quarantineTamperedGeneratedFile(
  paths: ContentPaths,
  integrity: IntegrityState,
  filePath: string,
  preferredLabel: string,
  reason: string,
  message: string,
  audit: AuditSummary
) {
  if (!fileExists(filePath)) return;

  const key = generatedKey(paths, filePath);
  const expectedHash = integrity.files[key];
  if (!expectedHash) return;

  const actualHash = hashText(fs.readFileSync(filePath, "utf8"));
  if (actualHash === expectedHash) return;

  const moved = quarantinePaths(
    paths,
    [{ filePath, preferredLabel }],
    reason,
    message
  );
  if (moved) audit.quarantined.push(...moved.files);
}

function buildRevisionId(source: string) {
  return `${timestampForId()}-${shortHash(source)}`;
}

function revisionPaths(paths: ContentPaths, pageId: string, revisionId: string) {
  const base = path.join(pageRevisionsDir(paths, pageId), revisionId);
  return {
    jsonPath: `${base}.json`,
    mdPath: `${base}.md`,
  };
}

function writeRevision(
  paths: ContentPaths,
  accepted: AcceptedRevision
) {
  const targetDir = pageRevisionsDir(paths, accepted.pageId);
  ensureDir(targetDir);

  const files = revisionPaths(paths, accepted.pageId, accepted.revisionId);
  writeAtomic(files.mdPath, accepted.source);
  writeJsonAtomic(files.jsonPath, accepted);

  return files;
}

function pruneEmptyDirs(dir: string, stopDir: string) {
  if (!fileExists(dir) || dir === stopDir) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      pruneEmptyDirs(path.join(dir, entry.name), stopDir);
    }
  }

  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}

function compareContent(currentPath: string, nextContent: string) {
  if (!fileExists(currentPath)) return false;
  return fs.readFileSync(currentPath, "utf8") === nextContent;
}

function writeCurrentState(
  paths: ContentPaths,
  revision: AcceptedRevision,
  audit: AuditSummary,
  integrity: IntegrityState
) {
  const current: PageCurrentState = {
    currentRevisionId: revision.revisionId,
    page: revision.page,
    pageId: revision.pageId,
    sourceHash: revision.sourceHash,
    updatedAt: revision.acceptedAt,
  };

  const currentPath = pageCurrentPath(paths, revision.pageId);
  const nextContent = `${stableJson(current)}\n`;

  quarantineTamperedGeneratedFile(
    paths,
    integrity,
    currentPath,
    `${revision.pageId}-current`,
    "tampered-current-state",
    "generated current state was replaced with the latest accepted revision.",
    audit
  );
  if (compareContent(currentPath, nextContent)) {
    integrity.files[generatedKey(paths, currentPath)] = hashText(nextContent);
    return;
  }
  writeAtomic(currentPath, nextContent);
  integrity.files[generatedKey(paths, currentPath)] = hashText(nextContent);
  audit.regenerated.push(relativeFromRoot(paths, currentPath));
}

function writeLiveIndex(
  paths: ContentPaths,
  pages: ManagedPage[],
  audit: AuditSummary,
  integrity: IntegrityState,
  generatedAt: string
) {
  const index: LiveContentIndex = {
    generatedAt,
    pages: [...pages].sort((a, b) => a.slug.localeCompare(b.slug)),
  };
  const nextContent = `${stableJson(index)}\n`;

  quarantineTamperedGeneratedFile(
    paths,
    integrity,
    paths.liveIndexPath,
    "live-content-index",
    "tampered-live-index",
    "generated live index was replaced with a rebuilt version from accepted revisions.",
    audit
  );
  if (compareContent(paths.liveIndexPath, nextContent)) {
    integrity.files[generatedKey(paths, paths.liveIndexPath)] = hashText(nextContent);
    return;
  }
  writeAtomic(paths.liveIndexPath, nextContent);
  integrity.files[generatedKey(paths, paths.liveIndexPath)] = hashText(nextContent);
  audit.regenerated.push(relativeFromRoot(paths, paths.liveIndexPath));
}

function writeRedirectsFile(
  paths: ContentPaths,
  pages: ManagedPage[],
  audit: AuditSummary,
  integrity: IntegrityState
) {
  const nextContent = buildRedirectsFile(pages);

  quarantineTamperedGeneratedFile(
    paths,
    integrity,
    paths.redirectsPath,
    "redirects",
    "tampered-redirects",
    "generated redirects were replaced with the latest published aliases.",
    audit
  );
  if (compareContent(paths.redirectsPath, nextContent)) {
    integrity.files[generatedKey(paths, paths.redirectsPath)] = hashText(nextContent);
    return;
  }
  writeAtomic(paths.redirectsPath, nextContent);
  integrity.files[generatedKey(paths, paths.redirectsPath)] = hashText(nextContent);
  audit.regenerated.push(relativeFromRoot(paths, paths.redirectsPath));
}

function expectedArchiveFiles(paths: ContentPaths, pages: ArchiveProjection[]) {
  const expected = new Map<string, string>();

  for (const projection of pages) {
    expected.set(
      archiveCurrentPath(paths, projection.latest.slug),
      projection.latest.source
    );

    for (const revision of projection.revisions) {
      expected.set(
        archiveRevisionPath(paths, projection.latest.slug, revision.revisionId),
        revision.source
      );
    }
  }

  return expected;
}

function syncArchive(
  paths: ContentPaths,
  pages: ArchiveProjection[],
  audit: AuditSummary,
  integrity: IntegrityState
) {
  ensureDir(paths.archiveDir);

  const expected = expectedArchiveFiles(paths, pages);
  const archiveReadme = toPosix(path.join(paths.archiveDir, "README.md"));

  for (const filePath of gatherFiles(paths.archiveDir)) {
    const normalized = toPosix(filePath);
    if (normalized === archiveReadme) continue;
    if (expected.has(filePath)) continue;

    const key = generatedKey(paths, filePath);
    const expectedHash = integrity.files[key];
    const actualHash = hashText(fs.readFileSync(filePath, "utf8"));

    if (expectedHash && actualHash === expectedHash) {
      fs.unlinkSync(filePath);
      delete integrity.files[key];
      continue;
    }

    const moved = quarantinePaths(
      paths,
      [{ filePath, preferredLabel: path.basename(filePath, path.extname(filePath)) }],
      "unexpected-archive-file",
      "content/archive is a generated view of accepted revisions. unexpected files were moved to recovered-drafts before the archive was rebuilt."
    );
    if (moved) audit.quarantined.push(...moved.files);
    delete integrity.files[key];
  }

  for (const [filePath, nextContent] of expected) {
    const key = generatedKey(paths, filePath);

    if (compareContent(filePath, nextContent)) {
      integrity.files[key] = hashText(nextContent);
      continue;
    }

    if (fileExists(filePath)) {
      const actualHash = hashText(fs.readFileSync(filePath, "utf8"));
      const expectedHash = integrity.files[key];

      if (!expectedHash || actualHash !== expectedHash) {
        const moved = quarantinePaths(
          paths,
          [{ filePath, preferredLabel: path.basename(filePath, path.extname(filePath)) }],
          "tampered-archive-file",
          "archive files are generated from accepted revisions. direct edits were moved to recovered-drafts before the archive was rebuilt."
        );
        if (moved) audit.quarantined.push(...moved.files);
      }
    }

    writeAtomic(filePath, nextContent);
    integrity.files[key] = hashText(nextContent);
    audit.regenerated.push(relativeFromRoot(paths, filePath));
  }

  const archivePrefix = `${relativeFromRoot(paths, paths.archiveDir)}/`;
  for (const key of Object.keys(integrity.files)) {
    if (!key.startsWith(archivePrefix)) continue;
    if (!fileExists(path.join(paths.rootDir, key))) {
      delete integrity.files[key];
    }
  }

  for (const entry of listDirs(paths.archiveDir)) {
    pruneEmptyDirs(path.join(paths.archiveDir, entry), paths.archiveDir);
  }
}

function validateAcceptedRevision(candidate: unknown) {
  if (!candidate || typeof candidate !== "object") return null;
  const accepted = candidate as AcceptedRevision;
  const parsedPage = managedPageSchema.safeParse(accepted.page);
  if (!parsedPage.success) return null;
  if (!accepted.source || typeof accepted.source !== "string") return null;
  if (!accepted.sourceHash || typeof accepted.sourceHash !== "string") return null;
  if (hashText(accepted.source) !== accepted.sourceHash) return null;
  if (accepted.page.sourceHash !== accepted.sourceHash) return null;
  if (accepted.page.revisionId !== accepted.revisionId) return null;
  if (accepted.page.pageId !== accepted.pageId) return null;
  return {
    ...accepted,
    page: parsedPage.data,
  } satisfies AcceptedRevision;
}

function repairRevisionPair(
  paths: ContentPaths,
  pageId: string,
  revisionId: string,
  audit: AuditSummary
) {
  const files = revisionPaths(paths, pageId, revisionId);
  const mdExists = fileExists(files.mdPath);
  const rawJson = readJson<AcceptedRevision>(files.jsonPath);
  const parsedJson = validateAcceptedRevision(rawJson);

  if (parsedJson) {
    if (!mdExists || fs.readFileSync(files.mdPath, "utf8") !== parsedJson.source) {
      if (mdExists) {
        const moved = quarantinePaths(
          paths,
          [{ filePath: files.mdPath, preferredLabel: `${pageId}-${revisionId}` }],
          "tampered-revision-source",
          "accepted markdown source was modified directly. the trusted revision source was restored."
        );
        if (moved) audit.quarantined.push(...moved.files);
      }
      writeAtomic(files.mdPath, parsedJson.source);
      audit.regenerated.push(relativeFromRoot(paths, files.mdPath));
    }
    return parsedJson;
  }

  if (!mdExists) {
    if (fileExists(files.jsonPath)) {
      const moved = quarantinePaths(
        paths,
        [{ filePath: files.jsonPath, preferredLabel: `${pageId}-${revisionId}` }],
        "broken-revision",
        "a broken revision json was quarantined because its source markdown was missing."
      );
      if (moved) audit.quarantined.push(...moved.files);
    }
    return null;
  }

  const source = fs.readFileSync(files.mdPath, "utf8");
  const sourceHash = hashText(source);
  const parsedDraft = parseDraftSource({ revisionId, source, sourceHash });

  if (!parsedDraft.ok) {
    const moved = quarantinePaths(
      paths,
      [
        { filePath: files.mdPath, preferredLabel: `${pageId}-${revisionId}` },
        ...(fileExists(files.jsonPath) ? [{ filePath: files.jsonPath, preferredLabel: `${pageId}-${revisionId}` }] : []),
      ],
      "invalid-revision",
      "a revision in hidden state failed validation and was quarantined."
    );
    if (moved) audit.quarantined.push(...moved.files);
    return null;
  }

  const accepted: AcceptedRevision = {
    acceptedAt: acceptedAtFromRevisionId(revisionId),
    page: {
      ...parsedDraft.page,
      pageId,
    },
    pageId,
    revisionId,
    slug: parsedDraft.page.slug,
    source,
    sourceHash,
    template: parsedDraft.page.template,
  };
  writeJsonAtomic(files.jsonPath, accepted);
  audit.regenerated.push(relativeFromRoot(paths, files.jsonPath));
  return accepted;
}

function auditVisibleMarkdown(paths: ContentPaths, audit: AuditSummary) {
  const visible = gatherMarkdownFiles(paths.contentRoot);
  const allowed = new Set([
    toPosix(path.join(paths.archiveDir, "README.md")),
    toPosix(path.join(paths.submitDir, "README.md")),
    toPosix(path.join(paths.recoveryDir, "README.md")),
  ]);

  for (const filePath of visible) {
    const normalized = toPosix(filePath);
    if (normalized.startsWith(toPosix(paths.submitDir) + "/")) continue;
    if (normalized.startsWith(toPosix(paths.recoveryDir) + "/")) continue;
    if (normalized.startsWith(toPosix(paths.examplesDir) + "/")) continue;
    if (normalized.startsWith(toPosix(paths.archiveDir) + "/")) continue;
    if (normalized.startsWith(toPosix(paths.stateDir) + "/")) continue;
    if (allowed.has(normalized)) continue;

    const moved = quarantinePaths(
      paths,
      [{ filePath, preferredLabel: path.basename(filePath, ".md") }],
      "stray-markdown",
      "markdown placed outside submit-here was quarantined to keep the live site safe."
    );
    if (moved) audit.quarantined.push(...moved.files);
  }
}

function bootstrapStateFromArchive(paths: ContentPaths, audit: AuditSummary) {
  if (hasHiddenState(paths)) return;

  for (const filePath of archiveRevisionSources(paths)) {
    const revisionId = path.basename(filePath, ".md");
    const source = fs.readFileSync(filePath, "utf8");
    const sourceHash = hashText(source);
    const parsed = parseDraftSource({ revisionId, source, sourceHash });

    if (!parsed.ok) {
      const moved = quarantinePaths(
        paths,
        [{ filePath, preferredLabel: revisionId }],
        "invalid-archive-revision",
        "an accepted archive revision failed validation while rebuilding hidden state."
      );
      if (moved) audit.quarantined.push(...moved.files);
      continue;
    }

    const accepted: AcceptedRevision = {
      acceptedAt: acceptedAtFromRevisionId(revisionId),
      page: parsed.page,
      pageId: parsed.page.pageId,
      revisionId,
      slug: parsed.page.slug,
      source,
      sourceHash,
      template: parsed.page.template,
    };

    const files = writeRevision(paths, accepted);
    audit.regenerated.push(relativeFromRoot(paths, files.mdPath));
    audit.regenerated.push(relativeFromRoot(paths, files.jsonPath));
  }
}

export function ensureContentScaffold(rootDir = process.cwd()) {
  const paths = resolveContentPaths(rootDir);
  ensureDir(paths.archiveDir);
  ensureDir(paths.publicDir);
  ensureDir(paths.submitDir);
  ensureDir(paths.recoveryDir);
  ensureDir(paths.stateDir);
  ensureDir(paths.pagesDir);
  ensureDir(paths.examplesDir);
  return paths;
}

export function rebuildContentState(rootDir = process.cwd()): AuditSummary {
  const paths = ensureContentScaffold(rootDir);
  const integrity = loadIntegrity(paths);
  const audit: AuditSummary = {
    livePages: 0,
    quarantined: [],
    regenerated: [],
  };

  auditVisibleMarkdown(paths, audit);
  bootstrapStateFromArchive(paths, audit);

  const pages: ManagedPage[] = [];
  const archivePages: ArchiveProjection[] = [];
  let latestAcceptedAt = new Date(0).toISOString();

  for (const pageId of listDirs(paths.pagesDir)) {
    const revisionsDir = pageRevisionsDir(paths, pageId);
    const revisionIds = listFiles(revisionsDir)
      .map((name) => name.replace(/\.(json|md)$/, ""))
      .filter((value, index, all) => all.indexOf(value) === index)
      .sort()
      .reverse();

    let latestAccepted: AcceptedRevision | null = null;
    let latestPublished: AcceptedRevision | null = null;
    const acceptedRevisions: AcceptedRevision[] = [];

    for (const revisionId of revisionIds) {
      const accepted = repairRevisionPair(paths, pageId, revisionId, audit);
      if (!accepted) continue;
      acceptedRevisions.push(accepted);
      if (!latestAccepted) latestAccepted = accepted;
      if (!latestPublished && accepted.page.status === "published") {
        latestPublished = accepted;
      }
    }

    if (!latestAccepted) continue;
    writeCurrentState(paths, latestAccepted, audit, integrity);
    archivePages.push({
      latest: latestAccepted,
      revisions: acceptedRevisions,
    });
    if (Date.parse(latestAccepted.acceptedAt) > Date.parse(latestAcceptedAt)) {
      latestAcceptedAt = latestAccepted.acceptedAt;
    }
    if (latestPublished) {
      pages.push(latestPublished.page);
    }
  }

  writeLiveIndex(paths, pages, audit, integrity, latestAcceptedAt);
  writeRedirectsFile(paths, pages, audit, integrity);
  syncArchive(paths, archivePages, audit, integrity);
  writeIntegrity(paths, integrity);
  audit.livePages = pages.length;

  return audit;
}

export function loadLiveIndex(rootDir = process.cwd()): LiveContentIndex {
  const paths = ensureContentScaffold(rootDir);
  const parsed = readJson<LiveContentIndex>(paths.liveIndexPath);
  if (parsed?.pages) return parsed;

  return {
    generatedAt: new Date(0).toISOString(),
    pages: [],
  };
}

export function listPages(rootDir = process.cwd()) {
  return loadLiveIndex(rootDir).pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

function listCurrentAcceptedPages(rootDir = process.cwd()) {
  const paths = ensureContentScaffold(rootDir);
  return listDirs(paths.pagesDir)
    .map((pageId) => {
      const current = readJson<PageCurrentState>(pageCurrentPath(paths, pageId));
      const parsed = managedPageSchema.safeParse(current?.page);
      if (!parsed.success) return null;
      return parsed.data;
    })
    .filter(Boolean) as ManagedPage[];
}

function routeClaims(page: ManagedPage) {
  return [
    { kind: "slug", path: page.slug },
    ...page.redirectFrom.map((path) => ({ kind: "redirect", path })),
  ];
}

function routeCollisionIssues(candidate: ManagedPage, existing: ManagedPage[]) {
  const issues: Array<{ message: string }> = [];
  const claims = new Map<string, { kind: string; pageId: string }>();

  for (const page of existing) {
    if (page.pageId === candidate.pageId) continue;
    for (const claim of routeClaims(page)) {
      claims.set(claim.path, { kind: claim.kind, pageId: page.pageId });
    }
  }

  for (const claim of routeClaims(candidate)) {
    const collision = claims.get(claim.path);
    if (!collision) continue;
    issues.push({
      message: `${claim.kind} ${claim.path} conflicts with ${collision.kind} of page_id ${collision.pageId}.`,
    });
  }

  return issues;
}

export function submitDraftFile(input: {
  filePath: string;
  rootDir?: string;
}) {
  const paths = ensureContentScaffold(input.rootDir);
  const source = fs.readFileSync(input.filePath, "utf8");
  const sourceHash = hashText(source);
  const revisionId = buildRevisionId(source);
  const parsed = parseDraftSource({ revisionId, source, sourceHash });

  if (!parsed.ok) {
    return {
      issues: parsed.issues,
      ok: false as const,
    };
  }

  const currentPages = listCurrentAcceptedPages(paths.rootDir);
  const slugCollision = currentPages.find(
    (page) =>
      page.slug === parsed.page.slug &&
      page.pageId !== parsed.page.pageId
  );
  if (slugCollision) {
    return {
      issues: [
        {
          message: `slug ${parsed.page.slug} is already used by page_id ${slugCollision.pageId}.`,
        },
      ],
      ok: false as const,
    };
  }

  const routeIssues = routeCollisionIssues(parsed.page, currentPages);
  if (routeIssues.length) {
    return {
      issues: routeIssues,
      ok: false as const,
    };
  }

  const accepted: AcceptedRevision = {
    acceptedAt: new Date().toISOString(),
    page: parsed.page,
    pageId: parsed.page.pageId,
    revisionId,
    slug: parsed.page.slug,
    source,
    sourceHash,
    template: parsed.page.template,
  };

  writeRevision(paths, accepted);

  if (path.resolve(input.filePath).startsWith(path.resolve(paths.submitDir) + path.sep)) {
    fs.unlinkSync(input.filePath);
  }

  const audit = rebuildContentState(paths.rootDir);

  return {
    action: "accepted",
    archiveCurrentPath: relativeFromRoot(
      paths,
      archiveCurrentPath(paths, accepted.page.slug)
    ),
    archiveRevisionPath: relativeFromRoot(
      paths,
      archiveRevisionPath(paths, accepted.page.slug, accepted.revisionId)
    ),
    livePages: audit.livePages,
    ok: true as const,
    page: parsed.page,
    quarantined: audit.quarantined,
  } satisfies SubmitSummary & { ok: true };
}

export function checkDraftFile(input: {
  filePath: string;
  rootDir?: string;
}): CheckSummary {
  const paths = ensureContentScaffold(input.rootDir);
  const source = fs.readFileSync(input.filePath, "utf8");
  const sourceHash = hashText(source);
  const revisionId = buildRevisionId(source);
  const parsed = parseDraftSource({ revisionId, source, sourceHash });

  if (!parsed.ok) {
    return {
      issues: parsed.issues,
      ok: false,
    };
  }

  const currentPages = listCurrentAcceptedPages(paths.rootDir);
  const slugCollision = currentPages.find(
    (page) =>
      page.slug === parsed.page.slug &&
      page.pageId !== parsed.page.pageId
  );

  if (slugCollision) {
    return {
      issues: [
        {
          message: `slug ${parsed.page.slug} is already used by page_id ${slugCollision.pageId}.`,
        },
      ],
      ok: false,
    };
  }

  const routeIssues = routeCollisionIssues(parsed.page, currentPages);
  if (routeIssues.length) {
    return {
      issues: routeIssues,
      ok: false,
    };
  }

  return {
    issues: [],
    ok: true,
    page: parsed.page,
  };
}

export function listRecovery(rootDir = process.cwd()): RecoveryEntry[] {
  const paths = ensureContentScaffold(rootDir);
  return listDirs(paths.recoveryDir)
    .map((id) => {
      const dir = path.join(paths.recoveryDir, id);
      const note = readJson<RecoveryEntry["note"]>(path.join(dir, "note.json"));
      if (!note) return null;
      const files = listFiles(dir)
        .filter((name) => name !== "note.json")
        .map((name) => relativeFromRoot(paths, path.join(dir, name)));
      return { files, id, note };
    })
    .filter(Boolean) as RecoveryEntry[];
}

export function restoreRecoveryEntry(input: {
  id: string;
  rootDir?: string;
}) {
  const paths = ensureContentScaffold(input.rootDir);
  const dir = path.join(paths.recoveryDir, input.id);
  if (!fileExists(dir)) {
    return {
      message: `recovery id not found: ${input.id}`,
      ok: false as const,
    };
  }

  const restored: string[] = [];
  for (const file of listFiles(dir)) {
    if (file === "note.json") continue;
    const sourcePath = path.join(dir, file);
    const targetPath = path.join(paths.submitDir, `${input.id}-${file}`);
    fs.copyFileSync(sourcePath, targetPath);
    restored.push(relativeFromRoot(paths, targetPath));
  }

  return {
    ok: true as const,
    restored,
  };
}
