import path from "node:path";

export type ContentPaths = ReturnType<typeof resolveContentPaths>;

export function resolveContentPaths(rootDir = process.cwd()) {
  const contentRoot = path.join(rootDir, "content");
  const archiveDir = path.join(contentRoot, "archive");
  const publicDir = path.join(rootDir, "public");
  const redirectsPath = path.join(publicDir, "_redirects");
  const submitDir = path.join(contentRoot, "submit-here");
  const recoveryDir = path.join(contentRoot, "recovered-drafts");
  const examplesDir = path.join(contentRoot, "examples");
  const stateDir = path.join(contentRoot, ".state");
  const pagesDir = path.join(stateDir, "pages");
  const integrityPath = path.join(stateDir, "integrity.json");
  const liveIndexPath = path.join(stateDir, "live-content-index.json");

  return {
    archiveDir,
    contentRoot,
    examplesDir,
    integrityPath,
    liveIndexPath,
    pagesDir,
    publicDir,
    recoveryDir,
    redirectsPath,
    rootDir,
    stateDir,
    submitDir,
  };
}

export function pageDir(paths: ContentPaths, pageId: string) {
  return path.join(paths.pagesDir, pageId);
}

export function pageRevisionsDir(paths: ContentPaths, pageId: string) {
  return path.join(pageDir(paths, pageId), "revisions");
}

export function pageCurrentPath(paths: ContentPaths, pageId: string) {
  return path.join(pageDir(paths, pageId), "current.json");
}

function archiveSegmentsFromSlug(slug: string) {
  if (slug === "/") return ["index"];
  return slug.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
}

export function archivePageDir(paths: ContentPaths, slug: string) {
  return path.join(paths.archiveDir, ...archiveSegmentsFromSlug(slug));
}

export function archiveCurrentPath(paths: ContentPaths, slug: string) {
  return path.join(archivePageDir(paths, slug), "current.md");
}

export function archiveRevisionPath(
  paths: ContentPaths,
  slug: string,
  revisionId: string
) {
  return path.join(archivePageDir(paths, slug), "revisions", `${revisionId}.md`);
}
