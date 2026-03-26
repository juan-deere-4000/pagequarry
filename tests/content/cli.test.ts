import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { runContentCli } from "@/lib/content/cli";
import { createTempRoot, copyFixture } from "@/tests/helpers/temp-root";

describe("content cli", () => {
  it("prints usage text in plain mode", async () => {
    const result = await runContentCli(["usage"]);

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("content/archive/");
    expect(result.output).toContain("content/submit-here/");
    expect(result.output).toContain("content/recovered-drafts/");
    expect(result.output).toContain("edit <file>              alias of submit");
    expect(result.output).toContain("seed <dir>               bulk-submit every .md file in a directory");
    expect(result.output).toContain("content_stage writes a draft into content/submit-here/");
  });

  it("lists templates", async () => {
    const result = await runContentCli(["--json", "list-templates"]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(0);
    expect(payload.templates).toHaveLength(5);
  });

  it("lists blocks", async () => {
    const result = await runContentCli(["--json", "list-blocks"]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(0);
    expect(payload.blocks.some((block: { name: string }) => block.name === "hero")).toBe(true);
  });

  it("returns structured lint feedback for an invalid submit", async () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "home.md");
    const broken = fs
      .readFileSync(filePath, "utf8")
      .replace('{% metrics %}', '{% madeUpBlock %}');
    fs.writeFileSync(filePath, broken, "utf8");

    const result = await runContentCli(["--json", "--root", rootDir, "submit", filePath]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(1);
    expect(payload.gate).toBe("content-lint");
    expect(payload.lint_feedback).toContain("unknown");
  });

  it("returns structured lint feedback for an invalid check", async () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "home.md");
    const broken = fs
      .readFileSync(filePath, "utf8")
      .replace('{% metrics %}', '{% metrics %}\n{% step title="x" body="y" /%}');
    fs.writeFileSync(filePath, broken, "utf8");

    const result = await runContentCli(["--json", "--root", rootDir, "check", filePath]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(1);
    expect(payload.gate).toBe("content-lint");
    expect(payload.lint_feedback).toContain("metrics may only contain metric child tags");
  });

  it("checks a valid fixture through the cli", async () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "services.md");

    const result = await runContentCli(["--json", "--root", rootDir, "check", filePath]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(0);
    expect(payload.page.slug).toBe("/services");
  });

  it("submits a valid fixture through the cli", async () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "contact.md");

    const result = await runContentCli(["--json", "--root", rootDir, "submit", filePath]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(0);
    expect(payload.ok).toBe(true);
    expect(payload.page.slug).toBe("/contact");
    expect(payload.archiveCurrentPath).toBe("content/archive/contact/current.md");
    expect(payload.archiveRevisionPath).toContain("content/archive/contact/revisions/");
  });

  it("seeds a directory of markdown fixtures", async () => {
    const rootDir = createTempRoot();
    const seedDir = path.join(rootDir, "content", "examples", "seed");
    fs.mkdirSync(seedDir, { recursive: true });
    for (const file of ["home.md", "services.md", "contact.md"]) {
      copyFixture(rootDir, file, path.join("content", "examples", "seed", file));
    }

    const result = await runContentCli(["--json", "--root", rootDir, "seed", seedDir]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(0);
    expect(payload.accepted).toHaveLength(3);
  });

  it("shows empty pages and recovery lists cleanly", async () => {
    const rootDir = createTempRoot();
    const pages = await runContentCli(["--root", rootDir, "pages"]);
    const recovery = await runContentCli(["--root", rootDir, "recovery-list"]);

    expect(pages.exitCode).toBe(0);
    expect(pages.output).toContain("no live pages");
    expect(recovery.exitCode).toBe(0);
    expect(recovery.output).toContain("no recovered drafts");
  });

  it("prints populated pages in plain mode", async () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "contact.md");
    await runContentCli(["--json", "--root", rootDir, "submit", filePath]);

    const result = await runContentCli(["--root", rootDir, "pages"]);

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("/contact");
  });

  it("runs audit and recovery flows through the cli", async () => {
    const rootDir = createTempRoot();
    copyFixture(rootDir, "home.md");
    fs.writeFileSync(path.join(rootDir, "content", "oops.md"), "# stray", "utf8");

    const audit = await runContentCli(["--json", "--root", rootDir, "audit"]);
    const auditPayload = JSON.parse(audit.output);
    const recoveryList = await runContentCli(["--json", "--root", rootDir, "recovery-list"]);
    const recoveryPayload = JSON.parse(recoveryList.output);
    const restored = await runContentCli([
      "--json",
      "--root",
      rootDir,
      "recovery-restore",
      recoveryPayload.recovery[0].id,
    ]);
    const restoredPayload = JSON.parse(restored.output);

    expect(audit.exitCode).toBe(0);
    expect(auditPayload.quarantined).toHaveLength(1);
    expect(recoveryPayload.recovery).toHaveLength(1);
    expect(restored.exitCode).toBe(0);
    expect(restoredPayload.restored[0]).toContain("content/submit-here/");
  });

  it("returns command errors for missing args and unknown commands", async () => {
    const missingCheck = await runContentCli(["--json", "check"]);
    const missingSubmit = await runContentCli(["--json", "submit"]);
    const missingRecovery = await runContentCli(["--json", "recovery-restore"]);
    const missingSeed = await runContentCli(["--json", "seed"]);
    const unknown = await runContentCli(["--json", "wat"]);

    expect(missingCheck.exitCode).toBe(1);
    expect(JSON.parse(missingCheck.output).error).toContain("check requires");
    expect(missingSubmit.exitCode).toBe(1);
    expect(JSON.parse(missingSubmit.output).error).toContain("submit requires");
    expect(missingRecovery.exitCode).toBe(1);
    expect(JSON.parse(missingRecovery.output).error).toContain("recovery-restore requires");
    expect(missingSeed.exitCode).toBe(1);
    expect(JSON.parse(missingSeed.output).error).toContain("seed requires");
    expect(unknown.exitCode).toBe(1);
    expect(JSON.parse(unknown.output).error).toContain("unknown command");
  });

  it("returns a cli error when recovery restore points to a missing entry", async () => {
    const rootDir = createTempRoot();

    const result = await runContentCli(["--json", "--root", rootDir, "recovery-restore", "missing"]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(1);
    expect(payload.message).toContain("recovery id not found");
  });

  it("fails seed when one fixture is invalid", async () => {
    const rootDir = createTempRoot();
    const seedDir = path.join(rootDir, "content", "examples", "seed");
    fs.mkdirSync(seedDir, { recursive: true });
    copyFixture(rootDir, "home.md", path.join("content", "examples", "seed", "home.md"));
    fs.writeFileSync(path.join(seedDir, "broken.md"), "---\nslug: /\n---\n", "utf8");

    const result = await runContentCli(["--json", "--root", rootDir, "seed", seedDir]);
    const payload = JSON.parse(result.output);

    expect(result.exitCode).toBe(1);
    expect(payload.ok).toBe(false);
    expect(payload.rejected).toHaveLength(1);
  });
});
