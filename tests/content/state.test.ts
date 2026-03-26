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
import { resolveContentPaths } from "@/lib/content/paths";
import { createTempRoot, copyFixture, writeFile } from "@/tests/helpers/temp-root";

describe("content state pipeline", () => {
  it("accepts a valid submit and removes it from submit-here", () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "home.md");

    const result = submitDraftFile({ filePath, rootDir });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.slug).toBe("/");
      expect(fs.existsSync(filePath)).toBe(false);
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
    const conflicting = copyFixture(rootDir, "services.md");

    const source = fs
      .readFileSync(conflicting, "utf8")
      .replace("slug: /services", "slug: /\npage_id: services");
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
    const conflicting = copyFixture(rootDir, "services.md");

    const source = fs
      .readFileSync(conflicting, "utf8")
      .replace("slug: /services", "slug: /\npage_id: services");
    fs.writeFileSync(conflicting, source, "utf8");

    const result = submitDraftFile({ filePath: conflicting, rootDir });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.message).toContain("already used");
    }
  });

  it("treats matching slug and page_id as an edit instead of a collision", () => {
    const rootDir = createTempRoot();
    submitDraftFile({ filePath: copyFixture(rootDir, "home.md"), rootDir });
    const editPath = copyFixture(rootDir, "home.md", path.join("drafts", "home-edit.md"));

    const source = fs.readFileSync(editPath, "utf8").replace("title: home", "title: home revised");
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

  it("ignores internal state markdown and documented readme paths during audit", () => {
    const rootDir = createTempRoot();
    writeFile(rootDir, "content/.state/ignored.md", "# hidden");
    writeFile(rootDir, "content/submit-here/README.md", "submit docs");
    writeFile(rootDir, "content/recovered-drafts/README.md", "recovery docs");

    const audit = rebuildContentState(rootDir);

    expect(audit.quarantined).toEqual([]);
  });

  it("restores a tampered revision source from the trusted revision json", () => {
    const rootDir = createTempRoot();
    const submit = submitDraftFile({ filePath: copyFixture(rootDir, "services.md"), rootDir });
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
    submitDraftFile({ filePath: copyFixture(rootDir, "services.md"), rootDir });
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
    submitDraftFile({ filePath: copyFixture(rootDir, "services.md"), rootDir });
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
