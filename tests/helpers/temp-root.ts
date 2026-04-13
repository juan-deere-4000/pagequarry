import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function createTempRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "standalone-cms-"));
  fs.mkdirSync(path.join(rootDir, "content"), { recursive: true });
  return rootDir;
}

export function fixturePath(name: string) {
  return path.join(process.cwd(), "content", "examples", "seed", name);
}

export function writeFile(rootDir: string, relativePath: string, content: string) {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
}

export function copyFixture(rootDir: string, name: string, targetRelativePath?: string) {
  const target = targetRelativePath || path.join("content", "submit-here", name);
  const content = fs.readFileSync(fixturePath(name), "utf8");
  return writeFile(rootDir, target, content);
}
