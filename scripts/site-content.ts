#!/usr/bin/env node

import { runContentCli } from "@/lib/content/cli";

async function main() {
  const { exitCode, output } = await runContentCli(process.argv.slice(2));
  process.stdout.write(output);
  process.exit(exitCode);
}

void main();
