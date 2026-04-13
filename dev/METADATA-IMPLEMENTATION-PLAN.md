# Metadata Implementation Plan

## Goal

Extend the managed markdown pipeline so accepted content carries enough page, template, and site metadata to behave like a serious editorial CMS without giving the writer agent too much rope.

The system should cover:

- page-level seo and social fields
- template-level defaults and schema behavior
- site-level canonical, robots, sitemap, manifest, and organization metadata
- redirect aliases generated from approved frontmatter
- draft vs published visibility without letting drafts break the live site

## Design Rules

- Markdown stays the authoring surface
- Frontmatter stays narrow and typed
- Most fields are optional because code supplies defaults
- The writer agent chooses from defined values instead of inventing raw HTML or one-off meta tags
- The app still trusts generated state, not arbitrary markdown paths

## Authoring Model

New frontmatter fields:

```yaml
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

author: PageQuarry
published_at: 2026-04-13T00:00:00Z
updated_at: 2026-04-13T00:00:00Z
redirect_from:
  - /guides/publishing-workflow
```

Validation rules:

- `status` is `published` or `draft`
- `robots` is `index` or `noindex`
- `twitter_card` is from a fixed allowlist
- `social_image` is from a fixed variant registry
- `canonical_url` must be either a leading-slash path or an absolute `http(s)` url
- `redirect_from` paths must follow slug rules, must not include the current slug, and must not duplicate each other
- dates must be valid iso datetimes when present

## Resolution Model

Add a metadata resolution layer in code:

- site defaults live in one place
- template defaults live in one place
- page frontmatter overrides them narrowly
- accepted pages store resolved metadata, not half-resolved raw fields

Resolved page metadata should include:

- visible title
- seo title
- description
- summary/excerpt
- canonical path/url
- robots booleans
- social title/description/image/card
- author
- published and updated timestamps
- redirect aliases
- schema type info

## Publication Model

Accepted revisions remain versioned in hidden state and mirrored into `content/archive/`.

For live publication:

- only the newest accepted `published` revision per `page_id` should appear in the live index
- newer `draft` revisions should stay accepted and archived, but should not replace the last published page on the live site
- if a page has never had a published revision, it should stay out of the live index

This gives us a useful draft status without accidentally yanking a page off the site just because a draft revision was submitted.

## Generated Outputs

In addition to the live page index, the pipeline should generate:

- `public/_redirects`
  contains 301 redirects from `redirect_from` aliases to canonical slugs for published pages
- `app/robots.ts`
  uses site defaults and sitemap url
- `app/sitemap.ts`
  lists published, indexable pages only
- `app/manifest.ts`
  emits a basic app/site manifest from site config

Direct edits to generated outputs should be overwritten on audit or build.

## Runtime Model

Runtime helpers should resolve:

- next `Metadata` objects from managed pages
- template-aware open graph and twitter metadata
- canonical alternates
- page-level json-ld
- breadcrumb schema for non-root pages
- organization/web site schema from site config

Template defaults:

- `home` => website-style metadata, `WebSite`
- `hub` => service-oriented defaults
- `guide` => article defaults
- `caseStudy` => article defaults with case-study social/schema treatment
- `narrative` => generic `WebPage`

## Asset Model

Social image choices should be code-owned:

- a fixed registry of social image variants
- static assets under `public/og/`
- frontmatter only references the variant key

The writer agent should never hand-author image URLs.

## Test Plan

Contracts and parser:

- accepts the expanded metadata schema
- rejects invalid robots, status, dates, twitter cards, social image keys, canonical urls, and redirect aliases
- resolves defaults when optional metadata is omitted

State and publication:

- published pages enter the live index
- draft-only pages stay out of the live index
- a newer draft revision does not replace an older published revision in the live index
- redirects file is generated for published aliases only
- redirect collisions are rejected
- tampered `_redirects` file is regenerated

Runtime:

- generated page metadata contains canonical, robots, open graph, twitter, and article fields
- sitemap excludes drafts and `noindex` pages
- structured data matches template defaults

Functional and adversarial:

- submit valid published and draft fixtures through the cli
- edit a published page with a draft revision and confirm the live page stays published
- try bad redirect aliases, bad dates, bad robots values, and unknown social images
- tamper with `content/archive/` and generated redirect output and confirm audit restores them

## Commit Plan

1. Plan doc and failing tests
2. Metadata types, contracts, parser, and defaults
3. Publication and redirect generation
4. Next runtime metadata, sitemap, robots, manifest, and schema
5. Docs, functional runs, and adversarial fixes
