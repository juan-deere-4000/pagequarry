import fs from "node:fs";
import path from "node:path";

import { blockDocs, describeTemplate, templateKeys } from "@/lib/content/contracts";
import {
  checkDraftFile,
  listPages,
  listRecovery,
  rebuildContentState,
  restoreRecoveryEntry,
  submitDraftFile,
} from "@/lib/content/state";

type CliContext = {
  json: boolean;
  rootDir: string;
};

type CliResult = {
  exitCode: number;
  payload: unknown;
  text: string;
};

function stableJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function ok(payload: unknown, text: string): CliResult {
  return { exitCode: 0, payload, text };
}

function fail(payload: unknown, text: string, exitCode = 1): CliResult {
  return { exitCode, payload, text };
}

function lintFeedback(issues: Array<{ line?: number; message: string }>) {
  return issues
    .map((entry, index) => {
      const prefix = entry.line ? `line ${entry.line}` : "global";
      return `${index + 1}. ${prefix}: ${entry.message}`;
    })
    .join("\n");
}

function usageText() {
  return [
    "site-content usage",
    "",
    "commands:",
    "  usage                    show this help",
    "  list-templates           show available page templates and required block order",
    "  list-blocks              show approved block tags and attrs",
    "  check <file>             validate a draft without accepting it",
    "  submit <file>            validate and accept a draft",
    "  edit <file>              alias of submit, intended for revising an existing page",
    "  audit                    rebuild generated state and quarantine bad direct writes",
    "  pages                    list live published pages",
    "  recovery-list            list quarantined files",
    "  recovery-restore <id>    restore a quarantined entry into submit-here",
    "  seed <dir>               bulk-submit every .md file in a directory",
    "",
    "writer flow:",
    "  1. put draft markdown in content/submit-here/",
    "  2. run site-content check content/submit-here/<file>.md",
    "  3. run site-content submit content/submit-here/<file>.md",
    "  4. use edit instead of submit when you are revising an existing page",
    "  5. accepted drafts are mirrored into content/archive/ by canonical url",
    "  6. if rejected, read the lint feedback and fix the draft",
    "  7. if your work disappeared, look in content/recovered-drafts/",
    "",
    "optional agent tool mapping:",
    "  if you expose the cli to automation, keep the tool surface narrow:",
    "  content_templates == list-templates",
    "  content_blocks == list-blocks",
    "  content_stage writes a draft into content/submit-here/",
    "  content_check == check <file>",
    "  content_submit == submit <file>",
    "  content_edit == edit <file>",
    "  content_pages == pages",
    "  content_recovery_list == recovery-list",
    "  content_recovery_restore == recovery-restore",
    "  maintainer tools:",
    "  content_admin_audit == audit",
    "  content_admin_seed == seed <dir>",
  ].join("\n");
}

function parseCliArgs(argv: string[]) {
  const rest = [...argv];
  let json = false;
  let rootDir = process.cwd();

  while (rest.length) {
    const head = rest[0];
    if (head === "--json") {
      json = true;
      rest.shift();
      continue;
    }
    if (head === "--root") {
      rest.shift();
      rootDir = path.resolve(rest.shift() || process.cwd());
      continue;
    }
    break;
  }

  return {
    command: rest.shift() || "usage",
    context: { json, rootDir } satisfies CliContext,
    rest,
  };
}

function render(result: CliResult, context: CliContext) {
  return {
    exitCode: result.exitCode,
    output: context.json ? `${stableJson(result.payload)}\n` : `${result.text}\n`,
  };
}

function listTemplatesResult() {
  const templates = templateKeys.map((template) => describeTemplate(template));
  return ok(
    { ok: true, templates },
    templates
      .map((template) =>
        [
          template.template,
          `  ${template.description}`,
          ...template.steps.map((step) => `  - ${step}`),
        ].join("\n")
      )
      .join("\n\n")
  );
}

function listBlocksResult() {
  const blocks = Object.entries(blockDocs).map(([name, doc]) => ({
    description: doc.description,
    name,
    syntax: doc.syntax,
  }));
  return ok(
    { blocks, ok: true },
    blocks
      .map((block) =>
        [block.name, `  ${block.description}`, `  ${block.syntax}`].join("\n")
      )
      .join("\n\n")
  );
}

function checkResult(filePath: string, context: CliContext) {
  const absolutePath = path.resolve(filePath);
  const checked = checkDraftFile({ filePath: absolutePath, rootDir: context.rootDir });
  if (!checked.ok) {
    const payload = {
      docs: [
        "content/archive/README.md",
        "content/submit-here/README.md",
        "content/recovered-drafts/README.md",
      ],
      gate: "content-lint",
      issues: checked.issues,
      lint_feedback: lintFeedback(checked.issues),
      message: "draft rejected. fix the markdown and resubmit.",
      ok: false,
    };
    return fail(payload, stableJson(payload));
  }

  return ok(
    { ok: true, page: checked.page },
    [
      "draft passed",
      `page_id: ${checked.page.pageId}`,
      `slug: ${checked.page.slug}`,
      `template: ${checked.page.template}`,
    ].join("\n")
  );
}

function submitResult(filePath: string, context: CliContext) {
  const absolutePath = path.resolve(filePath);
  const submitted = submitDraftFile({ filePath: absolutePath, rootDir: context.rootDir });
  if (!submitted.ok) {
    const payload = {
      docs: [
        "content/archive/README.md",
        "content/submit-here/README.md",
        "content/recovered-drafts/README.md",
      ],
      gate: "content-lint",
      issues: submitted.issues,
      lint_feedback: lintFeedback(submitted.issues),
      message: "draft rejected. fix the markdown and resubmit.",
      ok: false,
    };
    return fail(payload, stableJson(payload));
  }

  return ok(
    submitted,
    [
      "draft accepted",
      `page_id: ${submitted.page.pageId}`,
      `slug: ${submitted.page.slug}`,
      `template: ${submitted.page.template}`,
      `revision: ${submitted.page.revisionId}`,
      `live pages: ${submitted.livePages}`,
      `archive current: ${submitted.archiveCurrentPath}`,
      `archive revision: ${submitted.archiveRevisionPath}`,
    ].join("\n")
  );
}

function auditResult(context: CliContext) {
  const audit = rebuildContentState(context.rootDir);
  const lines = [
    "audit complete",
    `live pages: ${audit.livePages}`,
    `quarantined: ${audit.quarantined.length}`,
    `regenerated: ${audit.regenerated.length}`,
  ];

  if (audit.bootstrappedHiddenState) {
    lines.push(
      "note: hidden state was missing, so audit rebuilt it from content/archive/. regenerated files are normal on a fresh clone."
    );
  }

  if (audit.quarantined.length > 0) {
    lines.push(
      "note: quarantined files mean audit found misplaced markdown or direct edits to generated files. inspect content/recovered-drafts/."
    );
  }

  return ok(
    { ok: true, ...audit },
    lines.join("\n")
  );
}

function pagesResult(context: CliContext) {
  const pages = listPages(context.rootDir);
  return ok(
    { ok: true, pages },
    pages
      .map((page) => `${page.pageId}  ${page.slug}  ${page.template}`)
      .join("\n") || "no live pages"
  );
}

function recoveryListResult(context: CliContext) {
  const recovery = listRecovery(context.rootDir);
  return ok(
    { ok: true, recovery },
    recovery
      .map((entry) =>
        [
          entry.id,
          `  reason: ${entry.note.reason}`,
          ...entry.files.map((file) => `  file: ${file}`),
        ].join("\n")
      )
      .join("\n\n") || "no recovered drafts"
  );
}

function recoveryRestoreResult(id: string, context: CliContext) {
  const restored = restoreRecoveryEntry({ id, rootDir: context.rootDir });
  if (!restored.ok) {
    return fail(restored, restored.message);
  }

  return ok(
    restored,
    ["recovery restored", ...restored.restored.map((file) => `  ${file}`)].join("\n")
  );
}

function seedResult(dir: string, context: CliContext) {
  const absoluteDir = path.resolve(dir);
  const files = fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(absoluteDir, entry.name))
    .sort();

  const accepted = [];
  const rejected = [];

  for (const file of files) {
    const result = submitDraftFile({ filePath: file, rootDir: context.rootDir });
    if (result.ok) {
      accepted.push({ file, pageId: result.page.pageId, slug: result.page.slug });
    } else {
      rejected.push({ file, issues: result.issues });
    }
  }

  const payload = { accepted, ok: rejected.length === 0, rejected };
  if (rejected.length) {
    return fail(payload, stableJson(payload));
  }
  return ok(payload, accepted.map((entry) => `${entry.pageId}  ${entry.slug}`).join("\n"));
}

export async function runContentCli(argv: string[]) {
  const parsed = parseCliArgs(argv);
  const { context } = parsed;

  let result: CliResult;
  switch (parsed.command) {
    case "usage":
      result = ok({ ok: true, usage: usageText() }, usageText());
      break;
    case "list-templates":
      result = listTemplatesResult();
      break;
    case "list-blocks":
      result = listBlocksResult();
      break;
    case "check":
      result = parsed.rest[0]
        ? checkResult(parsed.rest[0], context)
        : fail({ ok: false, error: "check requires <file>" }, "check requires <file>");
      break;
    case "submit":
    case "edit":
      result = parsed.rest[0]
        ? submitResult(parsed.rest[0], context)
        : fail({ ok: false, error: `${parsed.command} requires <file>` }, `${parsed.command} requires <file>`);
      break;
    case "audit":
      result = auditResult(context);
      break;
    case "pages":
      result = pagesResult(context);
      break;
    case "recovery-list":
      result = recoveryListResult(context);
      break;
    case "recovery-restore":
      result = parsed.rest[0]
        ? recoveryRestoreResult(parsed.rest[0], context)
        : fail({ ok: false, error: "recovery-restore requires <id>" }, "recovery-restore requires <id>");
      break;
    case "seed":
      result = parsed.rest[0]
        ? seedResult(parsed.rest[0], context)
        : fail({ ok: false, error: "seed requires <dir>" }, "seed requires <dir>");
      break;
    default:
      result = fail(
        { ok: false, error: `unknown command: ${parsed.command}` },
        `unknown command: ${parsed.command}\n\n${usageText()}`
      );
      break;
  }

  return render(result, context);
}
