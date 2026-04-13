# Pagequarry

`Pagequarry` is a self-hostable site framework for editorial, text-first sites that want markdown publishing without turning the runtime into a pile of raw files.

it ships with:

- a strict `Markdoc` content pipeline
- reusable blocks and page templates
- one obvious site-owned customization root in `site/`
- visible accepted-content history in `content/archive/`
- recovery paths for misplaced drafts
- static export output from Next.js 16

the runtime only trusts generated state. raw markdown is authoring input, not the thing the app renders directly.

## quick start

```bash
npm install
npm run content -- audit
npm run dev
```

for a production build:

```bash
npm run lint
npm run test
npm run build
```

`npm run content -- audit` is important on a fresh clone because `content/.state/` is intentionally ignored and rebuilt from the accepted archive.

## where to edit

- `site/config.ts`
  site identity, canonical url, navigation, footer copy, manifest defaults, default metadata, social card registry
- `site/blocks.ts` and `site/templates.ts`
  site-owned registry composition points when a fork needs to extend or swap the canonical catalogs
- `content/AUTHORING.md`
  editorial system overview and writer rules
- `content/examples/seed/`
  starter markdown fixtures for each page family
- `content/submit-here/`
  the only approved place for new drafts
- `components/blocks/registry.ts`
  canonical core block catalog
- `components/templates/registry.ts`
  canonical core page-template catalog
- `components/site/*`
  shared visual primitives
- `app/globals.css`
  tokens and global styling rules

## core vs site boundary

- `site/*`
  site-owned customization seam for upstream-fork workflows
- `lib/content/*`, `components/blocks/*`, `components/templates/*`
  canonical cms core
- `content/site.ts`
  compatibility shim for older references; new customization work should start in `site/`

## publishing model

- drafts are written in `content/submit-here/`
- `npm run content -- check <file>` validates a draft without accepting it
- `npm run content -- submit <file>` accepts a new page
- `npm run content -- edit <file>` accepts a revision to an existing page
- accepted revisions are mirrored into `content/archive/`
- the runtime rebuilds hidden generated state under `content/.state/`
- only the newest accepted `published` revision per page becomes live
- accepted `draft` revisions stay archived without replacing the live page
- bad direct writes are quarantined into `content/recovered-drafts/`

## starter content

the repo includes safe starter pages so it can be pushed to a public github remote without leaking a real brand, inbox, or business history.

default starter routes:

- `/`
- `/features`
- `/how-it-works`
- `/howto/editorial/publishing-workflow`
- `/case-studies/teams/community-knowledge-base`
- `/contact`

replace them through the content pipeline or reseed from `content/examples/seed/`.

## deployment

the app is configured for static export with `next build`.

- `next.config.ts` uses `output: "export"`
- `public/_worker.js` optionally enforces a canonical host when `CANONICAL_HOST` is set
- `.github/workflows/deploy-pages.yml` can deploy to Cloudflare Pages when repo variables and secrets are configured

## writer docs

read these in order:

1. `content/AUTHORING.md`
2. `content/submit-here/README.md`
3. `content/archive/README.md`
4. `content/recovered-drafts/README.md`
