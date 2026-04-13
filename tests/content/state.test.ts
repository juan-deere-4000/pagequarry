import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  checkDraftFile,
  listPages,
  listRecovery,
  loadLiveIndex,
  rebuildContentState,
  restoreRecoveryEntry,
  submitDraftFile,
} from "@/lib/content/state";
import {
  archiveCurrentPath,
  archiveRevisionPath,
  resolveContentPaths,
} from "@/lib/content/paths";
import { createTempRoot, copyFixture, writeFile } from "@/tests/helpers/temp-root";

describe("content state pipeline", () => {
  it("accepts a valid submit, removes it from submit-here, and mirrors it into archive", () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "home.md");

    const result = submitDraftFile({ filePath, rootDir });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const paths = resolveContentPaths(rootDir);
      expect(result.page.slug).toBe("/");
      expect(fs.existsSync(filePath)).toBe(false);
      expect(fs.existsSync(path.join(rootDir, result.archiveCurrentPath))).toBe(true);
      expect(fs.existsSync(path.join(rootDir, result.archiveRevisionPath))).toBe(true);
      expect(fs.readFileSync(archiveCurrentPath(paths, "/"), "utf8")).toContain("title: PageQuarry");
      expect(fs.readFileSync(archiveRevisionPath(paths, "/", result.page.revisionId), "utf8")).toContain(
        "title: PageQuarry"
      );
      expect(listPages(rootDir)).toHaveLength(1);
    }
  });

  it("returns an empty live index before any content is accepted", () => {
    const rootDir = createTempRoot();

    expect(loadLiveIndex(rootDir).pages).toEqual([]);
    expect(listPages(rootDir)).toEqual([]);
  });

  it("falls back to an empty live index when the index json is invalid", () => {
    const rootDir = createTempRoot();
    const paths = resolveContentPaths(rootDir);
    fs.mkdirSync(path.dirname(paths.liveIndexPath), { recursive: true });
    fs.writeFileSync(paths.liveIndexPath, "{bad", "utf8");

    expect(loadLiveIndex(rootDir).pages).toEqual([]);
  });

  it("detects slug collisions during check", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "home.md"), rootDir });
    const conflicting = copyFixture(rootDir, "features.md");

    const source = fs
      .readFileSync(conflicting, "utf8")
      .replace("slug: /features", "slug: /\npage_id: features");
    fs.writeFileSync(conflicting, source, "utf8");

    const result = checkDraftFile({ filePath: conflicting, rootDir });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.message).toContain("already used");
    }
  });

  it("detects slug collisions during submit", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "home.md"), rootDir });
    const conflicting = copyFixture(rootDir, "features.md");

    const source = fs
      .readFileSync(conflicting, "utf8")
      .replace("slug: /features", "slug: /\npage_id: features");
    fs.writeFileSync(conflicting, source, "utf8");

    const result = submitDraftFile({ filePath: conflicting, rootDir });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.message).toContain("already used");
    }
  });

  it("keeps draft pages out of the live index while archiving them", () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "contact.md");
    const source = fs
      .readFileSync(filePath, "utf8")
      .replace("title: contact", "status: draft\ntitle: contact");
    fs.writeFileSync(filePath, source, "utf8");

    const result = submitDraftFile({ filePath, rootDir });
    const liveIndex = loadLiveIndex(rootDir);

    expect(result.ok).toBe(true);
    expect(liveIndex.pages).toEqual([]);
    if (result.ok) {
      expect(fs.existsSync(path.join(rootDir, result.archiveCurrentPath))).toBe(true);
    }
  });

  it("keeps the last published revision live when a newer draft revision is accepted", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });

    const draftEdit = copyFixture(rootDir, "contact.md", path.join("drafts", "contact-draft.md"));
    const draftSource = fs
      .readFileSync(draftEdit, "utf8")
      .replace("title: contact", "page_id: contact\nstatus: draft\ntitle: contact draft");
    fs.writeFileSync(draftEdit, draftSource, "utf8");

    const result = submitDraftFile({ filePath: draftEdit, rootDir });
    const livePages = listPages(rootDir);

    expect(result.ok).toBe(true);
    expect(livePages).toHaveLength(1);
    expect(livePages[0]!.slug).toBe("/contact");
    expect(livePages[0]!.meta.title).toBe("contact");
  });

  it("rehydrates hidden state from the visible archive on a clean clone", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);

    fs.rmSync(paths.stateDir, { force: true, recursive: true });

    const audit = rebuildContentState(rootDir);
    const livePages = listPages(rootDir);

    expect(audit.bootstrappedHiddenState).toBe(true);
    expect(audit.quarantined).toEqual([]);
    expect(audit.livePages).toBe(1);
    expect(audit.regenerated.length).toBeGreaterThan(0);
    expect(livePages).toHaveLength(1);
    expect(livePages[0]!.slug).toBe("/contact");
    expect(fs.existsSync(path.join(paths.pagesDir, "contact", "current.json"))).toBe(true);
  });

  it("does not report bootstrap when hidden state is already present", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });

    const audit = rebuildContentState(rootDir);

    expect(audit.bootstrappedHiddenState).toBe(false);
  });

  it("rehydrates published live state from archive revisions even when archive current is a draft", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });

    const draftEdit = copyFixture(rootDir, "contact.md", path.join("drafts", "contact-draft.md"));
    const draftSource = fs
      .readFileSync(draftEdit, "utf8")
      .replace("title: contact", "page_id: contact\nstatus: draft\ntitle: contact draft");
    fs.writeFileSync(draftEdit, draftSource, "utf8");
    submitDraftFile({ filePath: draftEdit, rootDir });

    const paths = resolveContentPaths(rootDir);
    fs.rmSync(paths.stateDir, { force: true, recursive: true });

    const audit = rebuildContentState(rootDir);
    const livePages = listPages(rootDir);

    expect(audit.livePages).toBe(1);
    expect(livePages[0]!.meta.title).toBe("contact");
    expect(fs.readFileSync(archiveCurrentPath(paths, "/contact"), "utf8")).toContain(
      "title: contact draft"
    );
  });

  it("generates redirects for published aliases and rejects collisions", () => {
    const rootDir = createTempRoot();
    const features = copyFixture(rootDir, "features.md");
    const featuresSource = fs
      .readFileSync(features, "utf8")
      .replace("description: feature overview for the PageQuarry starter site.", [
        "description: feature overview for the PageQuarry starter site.",
        "redirect_from:",
        "  - /feature-overview",
      ].join("\n"));
    fs.writeFileSync(features, featuresSource, "utf8");
    submitDraftFile({ filePath: features, rootDir });

    const paths = resolveContentPaths(rootDir);
    const redirectsPath = path.join(rootDir, "public", "_redirects");
    expect(fs.readFileSync(redirectsPath, "utf8")).toContain("/feature-overview /features 301");

    const conflict = copyFixture(rootDir, "contact.md");
    const conflictSource = fs
      .readFileSync(conflict, "utf8")
      .replace("description: safe placeholder contact page for the starter site.", [
        "description: safe placeholder contact page for the starter site.",
        "redirect_from:",
        "  - /features",
      ].join("\n"));
    fs.writeFileSync(conflict, conflictSource, "utf8");

    const result = submitDraftFile({ filePath: conflict, rootDir });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((entry) => entry.message.includes("redirect"))).toBe(true);
    }
    expect(fs.existsSync(paths.liveIndexPath)).toBe(true);
  });

  it("treats matching slug and page_id as an edit instead of a collision", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "home.md"), rootDir });
    const editPath = copyFixture(rootDir, "home.md", path.join("drafts", "home-edit.md"));

    const source = fs
      .readFileSync(editPath, "utf8")
      .replace("title: PageQuarry", "title: PageQuarry revised");
    fs.writeFileSync(editPath, source, "utf8");

    const result = checkDraftFile({ filePath: editPath, rootDir });

    expect(result.ok).toBe(true);
  });

  it("quarantines stray markdown outside submit-here", () => {
    const rootDir = createTempRoot();
    writeFile(rootDir, "content/oops.md", "# bad path");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.length).toBeGreaterThan(0);
    expect(listRecovery(rootDir)).toHaveLength(1);
    expect(fs.existsSync(path.join(rootDir, "content", "oops.md"))).toBe(false);
  });

  it("leaves staged drafts in submit-here alone during audit", () => {
    const rootDir = createTempRoot();
    const staged = copyFixture(rootDir, "contact.md");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined).toEqual([]);
    expect(fs.existsSync(staged)).toBe(true);
  });

  it("ignores markdown in examples and skips recovery folders without notes", () => {
    const rootDir = createTempRoot();
    writeFile(rootDir, "content/examples/kept.md", "# example");
    fs.mkdirSync(path.join(rootDir, "content", "recovered-drafts", "orphan"), { recursive: true });
    writeFile(rootDir, "content/recovered-drafts/orphan/draft.md", "# recovered");

    const audit = rebuildContentState(rootDir);
    const recovery = listRecovery(rootDir);

    expect(audit.quarantined).toEqual([]);
    expect(recovery).toEqual([]);
  });

  it("ignores internal state markdown and documented doc paths during audit", () => {
    const rootDir = createTempRoot();
    writeFile(rootDir, "content/.state/ignored.md", "# hidden");
    writeFile(rootDir, "content/AUTHORING.md", "authoring docs");
    writeFile(rootDir, "content/archive/README.md", "archive docs");
    writeFile(rootDir, "content/submit-here/README.md", "submit docs");
    writeFile(rootDir, "content/recovered-drafts/README.md", "recovery docs");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined).toEqual([]);
  });

  it("moves the visible archive when a page slug changes", () => {
    const rootDir = createTempRoot();
    const first = submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    expect(first.ok).toBe(true);

    const editPath = copyFixture(rootDir, "contact.md", path.join("drafts", "contact-renamed.md"));
    const renamed = fs
      .readFileSync(editPath, "utf8")
      .replace("slug: /contact", "slug: /reach-out\npage_id: contact")
      .replace("title: contact", "title: reach out");
    fs.writeFileSync(editPath, renamed, "utf8");

    const second = submitDraftFile({ filePath: editPath, rootDir });

    expect(second.ok).toBe(true);
    if (second.ok) {
      const paths = resolveContentPaths(rootDir);
      expect(fs.existsSync(archiveCurrentPath(paths, "/contact"))).toBe(false);
      expect(fs.existsSync(archiveCurrentPath(paths, "/reach-out"))).toBe(true);
      expect(
        fs.existsSync(
          archiveRevisionPath(paths, "/reach-out", first.ok ? first.page.revisionId : "missing")
        )
      ).toBe(true);
      expect(
        fs.existsSync(archiveRevisionPath(paths, "/reach-out", second.page.revisionId))
      ).toBe(true);
    }
  });

  it("restores a tampered revision source from the trusted revision json", () => {
    const rootDir = createTempRoot();
    const submit = submitDraftFile({ filePath: copyFixture(rootDir, "features.md"), rootDir });
    expect(submit.ok).toBe(true);

    const paths = resolveContentPaths(rootDir);
    const pageId = listPages(rootDir)[0]?.pageId;
    expect(pageId).toBeTruthy();
    const revisionsDir = path.join(paths.pagesDir, pageId!, "revisions");
    const revisionBase = fs
      .readdirSync(revisionsDir)
      .find((name) => name.endsWith(".md"))!
      .replace(/\.md$/, "");
    const revisionMd = path.join(revisionsDir, `${revisionBase}.md`);
    const original = fs.readFileSync(revisionMd, "utf8");

    fs.writeFileSync(revisionMd, "tampered", "utf8");
    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.length).toBeGreaterThan(0);
    expect(fs.readFileSync(revisionMd, "utf8")).toBe(original);
  });

  it("quarantines a tampered current page state and rewrites it", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "features.md"), rootDir });
    const paths = resolveContentPaths(rootDir);
    const pageId = listPages(rootDir)[0]!.pageId;
    const currentPath = path.join(paths.pagesDir, pageId, "current.json");
    const original = fs.readFileSync(currentPath, "utf8");

    fs.writeFileSync(currentPath, '{"tampered":true}\n', "utf8");
    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.includes(`${pageId}-current`))).toBe(true);
    expect(fs.readFileSync(currentPath, "utf8")).toBe(original);
  });

  it("quarantines a tampered live index and regenerates it", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);

    fs.writeFileSync(paths.liveIndexPath, '{"bad":true}', "utf8");
    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.includes("live-content-index"))).toBe(true);
    const liveIndex = fs.readFileSync(paths.liveIndexPath, "utf8");
    expect(liveIndex).toContain('"pages"');
  });

  it("quarantines direct edits to archive files and restores the accepted version", () => {
    const rootDir = createTempRoot();
    const submit = submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    expect(submit.ok).toBe(true);

    const paths = resolveContentPaths(rootDir);
    const archivePath = archiveCurrentPath(paths, "/contact");
    const original = fs.readFileSync(archivePath, "utf8");

    fs.writeFileSync(archivePath, "tampered archive", "utf8");
    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.endsWith("current.md"))).toBe(true);
    expect(fs.readFileSync(archivePath, "utf8")).toBe(original);
  });

  it("quarantines unexpected files dropped into archive", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    writeFile(rootDir, "content/archive/contact/random.md", "# stray archive file");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.endsWith("random.md"))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, "content", "archive", "contact", "random.md"))).toBe(
      false
    );
  });

  it("quarantines a broken revision json when the markdown source is missing", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);
    const pageId = listPages(rootDir)[0]!.pageId;
    const revisionsDir = path.join(paths.pagesDir, pageId, "revisions");
    const revisionBase = fs
      .readdirSync(revisionsDir)
      .find((name) => name.endsWith(".json"))!
      .replace(/\.json$/, "");

    fs.writeFileSync(path.join(revisionsDir, `${revisionBase}.json`), '{"bad":true}\n', "utf8");
    fs.unlinkSync(path.join(revisionsDir, `${revisionBase}.md`));
    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.endsWith(`${revisionBase}.json`))).toBe(true);
  });

  it("rebuilds a missing revision json from valid markdown in hidden state", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);
    const pageId = listPages(rootDir)[0]!.pageId;
    const revisionsDir = path.join(paths.pagesDir, pageId, "revisions");
    const revisionBase = fs
      .readdirSync(revisionsDir)
      .find((name) => name.endsWith(".json"))!
      .replace(/\.json$/, "");
    const jsonPath = path.join(revisionsDir, `${revisionBase}.json`);

    fs.writeFileSync(jsonPath, '{"bad":true}\n', "utf8");
    const audit = rebuildContentState(rootDir);

    expect(audit.regenerated.some((item) => item.endsWith(`${revisionBase}.json`))).toBe(true);
    expect(JSON.parse(fs.readFileSync(jsonPath, "utf8")).pageId).toBe(pageId);
  });

  it("quarantines an invalid hidden revision pair", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);
    const pageId = listPages(rootDir)[0]!.pageId;
    const revisionsDir = path.join(paths.pagesDir, pageId, "revisions");
    const revisionBase = fs
      .readdirSync(revisionsDir)
      .find((name) => name.endsWith(".md"))!
      .replace(/\.md$/, "");
    const revisionMd = path.join(revisionsDir, `${revisionBase}.md`);
    const revisionJson = path.join(revisionsDir, `${revisionBase}.json`);

    fs.writeFileSync(revisionMd, "not markdoc", "utf8");
    fs.writeFileSync(revisionJson, '{"bad":true}\n', "utf8");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined.some((item) => item.endsWith(`${revisionBase}.md`))).toBe(true);
    expect(audit.quarantined.some((item) => item.endsWith(`${revisionBase}.json`))).toBe(true);
  });

  it("restores recovered drafts back into submit-here", () => {
    const rootDir = createTempRoot();
    writeFile(rootDir, "content/bad-place.md", "# stray");
    rebuildContentState(rootDir);
    const recovery = listRecovery(rootDir);

    const restored = restoreRecoveryEntry({ id: recovery[0]!.id, rootDir });

    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.restored[0]).toContain("content/submit-here/");
    }
  });

  it("returns a clear error when a recovery entry is missing", () => {
    const rootDir = createTempRoot();

    const restored = restoreRecoveryEntry({ id: "missing-entry", rootDir });

    expect(restored.ok).toBe(false);
    if (!restored.ok) {
      expect(restored.message).toContain("recovery id not found");
    }
  });

  it("keeps non-inbox drafts in place after submit", () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "contact.md", path.join("drafts", "contact.md"));

    const result = submitDraftFile({ filePath, rootDir });

    expect(result.ok).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("rejects invalid drafts in submit and check flows", () => {
    const rootDir = createTempRoot();
    const broken = writeFile(rootDir, "content/submit-here/broken.md", "---\nslug: /\n---\n");

    const check = checkDraftFile({ filePath: broken, rootDir });
    const submit = submitDraftFile({ filePath: broken, rootDir });

    expect(check.ok).toBe(false);
    expect(submit.ok).toBe(false);
  });

  it("uses the newest accepted revision timestamp for the live index", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "features.md"), rootDir });
    submitDraftFile({ filePath: copyFixture(rootDir, "contact.md"), rootDir });
    const paths = resolveContentPaths(rootDir);

    const audit = rebuildContentState(rootDir);
    const liveIndex = JSON.parse(fs.readFileSync(paths.liveIndexPath, "utf8"));
    const contactCurrent = JSON.parse(
      fs.readFileSync(path.join(paths.pagesDir, "contact", "current.json"), "utf8")
    );

    expect(audit.livePages).toBe(2);
    expect(liveIndex.generatedAt).toBe(contactCurrent.updatedAt);
  });
});
