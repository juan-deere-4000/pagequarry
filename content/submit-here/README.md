# submit here

this directory is the only approved place for new draft markdown.

if you are writing content, start here.

read this first:

- `content/AUTHORING.md`

## the short version

1. put a draft markdown file here
2. run `check`
3. fix any errors
4. run `submit` for a new page or `edit` for a revision

## exact commands

new page:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- submit content/submit-here/<file>.md
```

revision to an existing page:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- edit content/submit-here/<file>.md
```

`edit` is an alias of `submit`. it exists so revisions read clearly in logs and agent traces.

## before you write

inspect the current system first:

```bash
npm run content -- pages
npm run content -- list-templates
npm run content -- list-blocks
```

that tells you:

- which pages already exist
- which template each page uses
- which blocks are allowed
- what block order each template requires

## minimum valid frontmatter

```yaml
---
template: guide
slug: /howto/editorial/publishing-workflow
title: publishing workflow
description: how to validate and publish a page safely through the content pipeline
---
```

## full metadata example

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

## exact replacement flow for an existing page

1. list the live pages:

```bash
npm run content -- pages
```

2. find the current accepted source in `content/archive/.../current.md`
3. keep the same `page_id`
4. keep the same `slug` unless the url is intentionally changing
5. save the revised draft here
6. run:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- edit content/submit-here/<file>.md
```

## common block examples

### normal internal button

```md
{% hero eyebrow="features" title="one framework, several page families." deck="..." actionHref="/contact" actionLabel="contact" /%}
```

### email button

```md
{% hero eyebrow="contact" title="replace this page before launch." deck="..." actionHref="mailto:hello@pagequarry.com" actionLabel="email" /%}
```

### email button with subject

```md
{% hero eyebrow="contact" title="replace this page before launch." deck="..." actionHref="mailto:hello@pagequarry.com?subject=hello%20from%20the%20starter%20site" actionLabel="email" /%}
```

important:

- use `mailto:` inside `actionHref`
- the same pattern works in `cta` blocks
- spaces in email subjects must be `%20`

## important behavior

- `draft` revisions are accepted and archived, but do not replace the last published page on the live site
- if a page has never had a published revision, `draft` keeps it off the live site entirely
- accepted markdown appears in `content/archive/`
- redirects are generated from `redirect_from` for published pages
- if you expose the cli through agent tools, map them narrowly to `content_templates`, `content_blocks`, `content_stage`, `content_check`, `content_submit`, `content_edit`, `content_pages`, `content_recovery_list`, and `content_recovery_restore`
- `content_stage` should stay the entry point because it writes drafts here without guessing paths

## do not do these things

- do not write drafts anywhere except `content/submit-here/`
- do not edit `content/archive/` directly
- do not edit `content/.state/` directly
- do not invent extra frontmatter keys
- do not invent new block names or attrs

## if something goes wrong

if `check` or `submit` fails:

- read the lint output carefully
- fix the markdown
- run `check` again

if your work seems to disappear:

- check `content/recovered-drafts/`
- run `npm run content -- recovery-list`
- run `npm run content -- recovery-restore <id>`

for maintainers and migration work only:

```bash
npm run content -- seed <directory-of-md-files>
```

normal page writing should still happen one draft at a time in `content/submit-here/`.
