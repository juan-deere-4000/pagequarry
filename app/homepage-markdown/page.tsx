import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { siteConfig } from "@/site/config";

export const metadata: Metadata = {
  description: "The actual markdown file driving the PageQuarry homepage.",
  title: `Homepage Markdown | ${siteConfig.identity.title}`,
};

function getHomepageMarkdownSource() {
  return fs.readFileSync(
    path.join(process.cwd(), "content/archive/index/current.md"),
    "utf8"
  );
}

export default function HomepageMarkdownPage() {
  const source = getHomepageMarkdownSource();
  const lines = source.split("\n");

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-700/40 bg-[linear-gradient(180deg,rgba(13,25,39,0.98),rgba(16,33,53,0.96))] shadow-[0_28px_70px_rgba(8,18,31,0.28)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="font-mono text-[0.72rem] font-medium tracking-[0.06em] text-slate-400">
            content/archive/index/current.md
          </span>
        </div>

        <pre className="overflow-x-auto px-4 py-5 text-[0.84rem] leading-7 text-slate-200 sm:px-6 sm:py-6">
          <code>
            {lines.map((line, index) => (
              <span
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                key={`${index}-${line}`}
              >
                <span className="text-right text-slate-500">{index + 1}</span>
                <span className="whitespace-pre">{line || " "}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </main>
  );
}
