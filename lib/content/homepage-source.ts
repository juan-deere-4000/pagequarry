import fs from "node:fs";
import path from "node:path";

const blockAttributePattern = /([A-Za-z_][\w-]*)="((?:\\"|[^"])*)"/g;

function formatInlineBlockTag(match: string, body: string, selfClosing: string) {
  const trimmedBody = body.trim();

  if (!trimmedBody || trimmedBody.startsWith("/") || !trimmedBody.includes("=")) {
    return match;
  }

  const nameMatch = trimmedBody.match(/^([A-Za-z][\w-]*)(?:\s+(.*))?$/);

  if (!nameMatch) {
    return match;
  }

  const [, blockName, rawAttributes = ""] = nameMatch;
  const attributes = [...rawAttributes.matchAll(blockAttributePattern)];

  if (!attributes.length) {
    return match;
  }

  return [
    `{% ${blockName}`,
    ...attributes.map(([, key, value]) => `    ${key}="${value}"`),
    `${selfClosing ? "/" : ""}%}`,
  ].join("\n");
}

export function formatMarkdownForDisplay(source: string) {
  return source.replace(
    /\{%\s*([^\n]*?)\s*(\/?)%\}/g,
    formatInlineBlockTag
  );
}

export function getHomepageMarkdownSource() {
  return formatMarkdownForDisplay(
    fs.readFileSync(
      path.join(process.cwd(), "content/archive/index/current.md"),
      "utf8"
    )
  );
}
