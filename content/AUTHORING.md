# authoring guide

this repo has three editing layers. keep them separate.

## site-level

site-level changes live in code, not markdown.

use these when you need to change global behavior:

- `content/site.ts`
  brand name, canonical site url, nav, footer copy, manifest defaults, social image variants
- `lib/content/metadata.ts`
  page/template/site metadata resolution, schema, sitemap, redirects
- `components/blocks/registry.ts`
  approved block catalog
- `components/templates/registry.ts`
  approved page templates
- `components/site/*` and `app/globals.css`
  shared styling and layout primitives

if you need a new block, a new template, or a global metadata rule, that is a coding task.

## template-level

template choice controls the allowed page structure.

before writing a page, inspect the current contracts:

```bash
npm run content -- list-templates
npm run content -- list-blocks
```

each template has a fixed block order. each block has fixed attrs. writers should pick from that catalog instead of inventing new markup.

## page-level

page writing happens through markdown drafts in `content/submit-here/`.

normal cli flow:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- submit content/submit-here/<file>.md
```

accepted drafts are mirrored into `content/archive/`. rejected drafts stay visible and return structured lint feedback. misplaced work is moved into `content/recovered-drafts/`.

## command semantics

- `check <file>`
  validate a draft without accepting it
- `submit <file>`
  validate and accept a draft
- `edit <file>`
  alias of `submit`
  use it when the draft is a revision to an existing page and you want the command name to reflect intent
- `seed <dir>`
  bulk-submit every `.md` file in a directory
  this is for migrations, fixture imports, or maintainers, not normal page writing

overwriting a draft file in `content/submit-here/` and running `submit` is functionally fine. `edit` exists so the workflow reads clearly in logs and agent traces.

## OpenClaw tool mapping

the `bkk_content` OpenClaw tool mirrors the cli almost 1:1.

cli to tool mapping:

- `usage` -> `action: "usage"`
- `list-templates` -> `action: "list_templates"`
- `list-blocks` -> `action: "list_blocks"`
- `check <file>` -> `action: "check"`
- `submit <file>` -> `action: "submit"`
- `edit <file>` -> `action: "edit"`
- `audit` -> `action: "audit"`
- `pages` -> `action: "pages"`
- `recovery-list` -> `action: "recovery_list"`
- `recovery-restore <id>` -> `action: "recovery_restore"`
- `seed <dir>` -> `action: "seed"`

the one extra helper on the OpenClaw side is:

- `action: "stage"`
  write markdown into `content/submit-here/` without guessing paths

that means an OpenClaw writer can either:

1. write a draft file into `content/submit-here/` and then use `check` / `submit`
2. call `bkk_content` with `action: "stage"` and then use `check` / `submit`

## first places to look

- `content/submit-here/README.md`
- `content/archive/README.md`
- `content/recovered-drafts/README.md`
