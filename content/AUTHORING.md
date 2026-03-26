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

writers only write markdown drafts into `content/submit-here/`, validate them, then publish them through the content cli or the matching `OpenClaw` tools.

## the three editing layers

### site-level

site-level changes live in code, not markdown.

use these when you need to change global behavior:

- `content/site.ts`
  brand name, canonical site url, nav, footer copy, manifest defaults, social image variants
- `lib/content/metadata.ts`
  page, template, and site metadata resolution plus schema, sitemap, and redirects
- `components/blocks/registry.ts`
  approved block catalog
- `components/templates/registry.ts`
  approved page templates
- `components/site/*` and `app/globals.css`
  shared layout primitives and styling rules

if you need a new block, a new template, a new metadata rule, or a styling change, that is a coding task, not a writing task.

important:

- the header and mobile menu are code-owned in `content/site.ts`
- nested urls are supported, but nested markdown pages do not auto-populate the menu
- publishing `/howto/...` or `/case-studies/...` pages does not add them to nav by itself
- if a page should appear in the menu, a coding agent must update `content/site.ts`

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
slug: /howto/productivity/email-triage
title: private email triage
description: private inbox routing without another saas dependency
---
```

full metadata example:

```yaml
---
template: guide
slug: /howto/productivity/email-triage
page_id: howto-productivity-email-triage
status: published

title: private email triage
description: private inbox routing without another saas dependency
summary: local-first email triage with strict workflow control

seo_title: private email triage for personal and executive inboxes
canonical_url: /howto/productivity/email-triage
robots: index

social_title: private email triage
social_description: local-first email triage with strict workflow control
social_image: guide
twitter_card: summary_large_image

author: siam ai lab
published_at: 2026-03-26T00:00:00Z
updated_at: 2026-03-26T00:00:00Z
redirect_from:
  - /guides/email-triage
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
{% hero eyebrow="services" title="private systems, not public prompts." deck="..." actionHref="/contact" actionLabel="book a consultation" /%}
```

### hero with a direct email button

```md
{% hero eyebrow="contact" title="start with the real bottleneck." deck="..." actionHref="mailto:joe.guilmette@gmail.com" actionLabel="email joe" /%}
```

### hero with a direct email button plus cc

```md
{% hero eyebrow="contact" title="start with the real bottleneck." deck="..." actionHref="mailto:joe.guilmette@gmail.com?cc=juan.deere.4000@gmail.com" actionLabel="email joe" /%}
```

### hero with email, cc, and subject

```md
{% hero eyebrow="contact" title="start with the real bottleneck." deck="..." actionHref="mailto:joe.guilmette@gmail.com?cc=juan.deere.4000@gmail.com&subject=siam%20ai%20lab%20inquiry" actionLabel="email joe" /%}
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

{% linkItem href="/services" label="services" summary="see the service map" /%}
{% linkItem href="/contact" label="contact" summary="start the conversation" /%}
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

## OpenClaw tool mapping

the `OpenClaw` content tools are split by intent.

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

default `OpenClaw` writer flow:

1. call `content_templates` and `content_blocks` if you need the current contracts
2. call `content_stage` with a filename and markdown
3. call `content_check`
4. if it passes, call `content_submit` for a new page or `content_edit` for a revision
5. if it fails, fix the markdown using the returned lint feedback and run `content_check` again

## first places to look

- `content/submit-here/README.md`
- `content/archive/README.md`
- `content/recovered-drafts/README.md`
