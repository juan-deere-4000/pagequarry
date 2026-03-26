import path from "node:path";

export type ContentPaths = ReturnType<typeof resolveContentPaths>;

export function resolveContentPaths(rootDir = process.cwd()) {
  const contentRoot = path.join(rootDir, "content");
  const submitDir = path.join(contentRoot, "submit-here");
  const recoveryDir = path.join(contentRoot, "recovered-drafts");
  const examplesDir = path.join(contentRoot, "examples");
  const stateDir = path.join(contentRoot, ".state");
  const pagesDir = path.join(stateDir, "pages");
  const integrityPath = path.join(stateDir, "integrity.json");
  const liveIndexPath = path.join(stateDir, "live-content-index.json");

  return {
    contentRoot,
    examplesDir,
    integrityPath,
    liveIndexPath,
    pagesDir,
    recoveryDir,
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
