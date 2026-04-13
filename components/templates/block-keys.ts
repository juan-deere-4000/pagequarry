import type { ContentBlock } from "@/content/types";

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function blockContentFingerprint(block: ContentBlock) {
  return `${block.type}-${hashString(stableSerialize(block))}`;
}

export function blockRenderKeys(blocks: ContentBlock[]) {
  const seen = new Map<string, number>();

  return blocks.map((block) => {
    const fingerprint = blockContentFingerprint(block);
    const occurrence = seen.get(fingerprint) ?? 0;
    seen.set(fingerprint, occurrence + 1);
    return `${fingerprint}-${occurrence}`;
  });
}
