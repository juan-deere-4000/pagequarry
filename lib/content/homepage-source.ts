import fs from "node:fs";
import path from "node:path";

export function getHomepageMarkdownSource() {
  return fs.readFileSync(
    path.join(process.cwd(), "content/archive/index/current.md"),
    "utf8"
  );
}
