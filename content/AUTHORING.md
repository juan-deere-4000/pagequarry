# authoring guide

this is the plain-language map of the content system.

if you are writing page content, you should mostly care about four places:

- `content/submit-here/`
  where new draft markdown goes
- `content/archive/`
  where accepted markdown is mirrored for reading and git history
- `content/recovered-drafts/`
  where rescued mistakes go if something was written to the wrong place
- `npm run content -- ...`
  the cli used to validate and publish drafts

if you are not doing a coding task, do not touch anything else.

## one-sentence rule

writers only write markdown drafts into `content/submit-here/`, validate them, then publish them through the content cli or a thin automation wrapper around it.

## the three editing layers

### site-level

site-level changes live in code, not markdown.

use these when you need to change global behavior:

- `site/config.ts`
  site identity, canonical site url, nav, footer copy, manifest defaults, contact defaults, social image variants
- `site/blocks.ts` and `site/templates.ts`
  site-owned registry composition points for a fork that needs to extend the core catalogs
- `lib/content/metadata.ts`
  page, template, and site metadata resolution plus schema, sitemap, and redirects
- `components/blocks/registry.ts`
  canonical core block catalog
- `components/templates/registry.ts`
  canonical core page templates
- `components/site/*` and `app/globals.css`
  shared layout primitives and styling rules

if you need a new block, a new template, a new metadata rule, or a styling change, that is a coding task, not a writing task.

important:

- the header and mobile menu are code-owned in `site/config.ts`
- the header is flat. top-level links are `home`, `features`, `how it works`, `how-to`, `case studies`, and `contact`
- publishing `/howto/...` or `/case-studies/...` pages does not add child links to nav by itself
- `/howto` and `/case-studies` are generated archive indexes in code until real markdown pages exist at those slugs
- if a page should appear as a top-level nav item, a coding agent must update `site/config.ts`
- `content/site.ts` still exists as a compatibility shim, but new site customization work should not start there

### template-level

template choice controls the allowed page structure.

before writing a page, inspect the current contracts:

```bash
npm run content -- list-templates
npm run content -- list-blocks
```

each template has a fixed block order. each block has fixed attrs. writers should pick from that catalog instead of inventing new markup.

### page-level

page writing happens through markdown drafts in `content/submit-here/`.

normal cli flow:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- submit content/submit-here/<file>.md
```

accepted drafts are mirrored into `content/archive/`. rejected drafts stay visible and return structured lint feedback. misplaced work is moved into `content/recovered-drafts/`.

page-level markdown can control:

- the page url via `slug`
- page metadata
- page body blocks

page-level markdown cannot control:

- the global nav or footer
- which pages appear in the header or mobile menu
- shared styling rules

## never touch these directly

- `content/.state/`
  hidden generated state used by the runtime
- `content/archive/`
  visible accepted history, but not a staging area
- `public/_redirects`
  generated from accepted page metadata

if you edit those directly, the system will quarantine the change and restore the accepted state.

## commands you actually need

- `npm run content -- pages`
  list the live published pages
- `npm run content -- list-templates`
  show allowed template shapes
- `npm run content -- list-blocks`
  show allowed block syntax
- `npm run content -- check <file>`
  validate a draft without accepting it
- `npm run content -- submit <file>`
  validate and accept a new draft
- `npm run content -- edit <file>`
  validate and accept a revision to an existing page
- `npm run content -- recovery-list`
  list quarantined files
- `npm run content -- recovery-restore <id>`
  restore a quarantined file into `content/submit-here/`

maintainer-only commands:

- `npm run content -- audit`
- `npm run content -- seed <dir>`

normal writing should not use `seed`.

## exact writer workflows

### create a new page

1. inspect the current system:

```bash
npm run content -- pages
npm run content -- list-templates
npm run content -- list-blocks
```

2. write a new draft in `content/submit-here/<file>.md`
3. validate it:

```bash
npm run content -- check content/submit-here/<file>.md
```

4. if it passes, publish it:

```bash
npm run content -- submit content/submit-here/<file>.md
```

5. confirm it is live:

```bash
npm run content -- pages
```

### replace an existing live page

1. list live pages:

```bash
npm run content -- pages
```

2. find the current accepted source in `content/archive/.../current.md`
3. keep the same `page_id` and same `slug`
4. write the revised markdown to `content/submit-here/<file>.md`
5. validate it:

```bash
npm run content -- check content/submit-here/<file>.md
```

6. publish the revision:

```bash
npm run content -- edit content/submit-here/<file>.md
```

`edit` is the same acceptance path as `submit`. it exists so revision logs are obvious.

### recover missing work

if your draft seems to have vanished, look here first:

- `content/recovered-drafts/`

then run:

```bash
npm run content -- recovery-list
npm run content -- recovery-restore <id>
```

that restores the quarantined file into `content/submit-here/` so you can validate and submit it correctly.

## frontmatter rules

minimum valid frontmatter:

```yaml
---
template: guide
slug: /howto/editorial/publishing-workflow
title: publishing workflow
description: how to validate and publish a page safely through the content pipeline
---
```

full metadata example:

```yaml
---
template: guide
slug: /howto/editorial/publishing-workflow
page_id: howto-editorial-publishing-workflow
status: published

title: publishing workflow
description: how to validate and publish a page safely through the content pipeline
summary: stage drafts, lint them, and accept them without touching generated runtime files

seo_title: publishing workflow for a markdown-first site
canonical_url: /howto/editorial/publishing-workflow
robots: index

social_title: publishing workflow
social_description: stage drafts, lint them, and accept them without touching generated runtime files
social_image: guide
twitter_card: summary_large_image

author: Pagequarry
published_at: 2026-04-13T00:00:00Z
updated_at: 2026-04-13T00:00:00Z
redirect_from:
  - /guides/publishing-workflow
---
```

allowed values:

- `status`: `published` or `draft`
- `robots`: `index` or `noindex`
- `social_image`: `site`, `home`, `hub`, `guide`, `caseStudy`, `narrative`
- `twitter_card`: `summary` or `summary_large_image`

rules:

- `slug` must start with `/`
- `slug` must be lowercase
- `slug` must not end with `/` unless it is exactly `/`
- `page_id` should stay stable when you revise an existing page
- do not invent extra frontmatter keys

## common block patterns

the canonical source for block syntax is:

```bash
npm run content -- list-blocks
```

common patterns:

### hero with a normal internal link

```md
{% hero eyebrow="features" title="one framework, several page families." deck="..." actionHref="/contact" actionLabel="contact" /%}
```

### hero with a direct email button

```md
{% hero eyebrow="contact" title="replace this page before launch." deck="..." actionHref="mailto:hello@pagequarry.com" actionLabel="email" /%}
```

### hero with email and subject

```md
{% hero eyebrow="contact" title="replace this page before launch." deck="..." actionHref="mailto:hello@pagequarry.com?subject=hello%20from%20the%20starter%20site" actionLabel="email" /%}
```

important:

- use `mailto:` inside `actionHref`
- separate query params with `&`
- encode spaces in subjects as `%20`
- the same `actionHref` pattern works in `cta` blocks too

### section with inline supporting links

```md
{% sectionCopy eyebrow="next step" title="what to review first" %}
body paragraph

{% linkItem href="/features" label="features" summary="see the shared page families" /%}
{% linkItem href="/contact" label="contact" summary="replace the placeholder contact surface" /%}
{% /sectionCopy %}
```

## what happens after submit

when a draft is accepted:

1. the markdown is validated
2. an accepted revision is written into hidden state
3. a visible copy is mirrored into `content/archive/.../current.md`
4. a revision copy is mirrored into `content/archive/.../revisions/`
5. the live index is rebuilt
6. if the revision is `published`, the live site updates on the next build/deploy
7. if the revision is `draft`, it stays accepted and archived but does not replace the live page

## automation mapping

if you expose the content cli through agent tools, keep the surface narrow.

normal writer tools:

- `content_templates` -> `npm run content -- list-templates`
- `content_blocks` -> `npm run content -- list-blocks`
- `content_stage`
  write markdown into `content/submit-here/` without guessing paths
- `content_check` -> `npm run content -- check <file>`
- `content_submit` -> `npm run content -- submit <file>`
- `content_edit` -> `npm run content -- edit <file>`
- `content_pages` -> `npm run content -- pages`
- `content_recovery_list` -> `npm run content -- recovery-list`
- `content_recovery_restore` -> `npm run content -- recovery-restore <id>`

maintainer-only tools:

- `content_admin_audit` -> `npm run content -- audit`
- `content_admin_seed` -> `npm run content -- seed <dir>`

default automation flow:

1. call `content_templates` and `content_blocks` if you need the current contracts
2. call `content_stage` with a filename and markdown
3. call `content_check`
4. if it passes, call `content_submit` for a new page or `content_edit` for a revision
5. if it fails, fix the markdown using the returned lint feedback and run `content_check` again

## first places to look

- `content/submit-here/README.md`
- `content/archive/README.md`
- `content/recovered-drafts/README.md`
