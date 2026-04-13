# PageQuarry

PageQuarry is a self-hostable, markdown-first site framework for editorial websites.

It is built for a simple upstream-fork workflow:
- fork the repo
- use your fork as your site
- customize the site-owned surfaces in `site/`
- write and publish content through the content pipeline
- pull upstream improvements when useful, then let your agent resolve conflicts if needed

The runtime only trusts generated state. Raw markdown is authoring input, not the live runtime source.

## what you get

- a strict Markdoc content pipeline
- reusable canonical blocks and page templates
- one obvious site-owned customization root in `site/`
- visible accepted-content history in `content/archive/`
- recovery paths for misplaced drafts or direct edits
- static-export output from Next.js 16

## 5 minute agent quickstart

If an agent is dropped into this repo cold, do this first:

```bash
npm install
npm run content -- audit
npm run dev
```

For a full validation pass:

```bash
npm run lint
npm run test
npm run build
```

`npm run content -- audit` matters on a fresh clone because `content/.state/` is ignored and rebuilt from the accepted archive.

## where agents should edit

### site-owned surfaces

Start here for normal site customization:

- `site/config.ts`
  - site name
  - canonical URL
  - nav
  - footer copy
  - manifest defaults
  - metadata defaults
  - social card registry
- `site/blocks.ts`
  - site-level block registry composition
- `site/templates.ts`
  - site-level template registry composition
- `app/globals.css`
  - tokens and global styling
- `components/site/*`
  - shared site chrome and visual primitives
- `content/examples/seed/*`
  - starter content examples

### canonical CMS core

Leave these alone unless you are improving the framework itself:

- `lib/content/*`
- `components/blocks/*`
- `components/templates/*`
- `content/types.ts`
- `scripts/site-content.ts`

## content workflow

New markdown drafts only go in:

- `content/submit-here/`

Common commands:

```bash
npm run content -- check content/submit-here/<file>.md
npm run content -- submit content/submit-here/<file>.md
npm run content -- edit content/submit-here/<file>.md
npm run content -- pages
npm run content -- list-templates
npm run content -- list-blocks
npm run content -- recovery-list
```

Publishing model:
- accepted revisions are mirrored into `content/archive/`
- the runtime rebuilds hidden generated state under `content/.state/`
- only the newest accepted `published` revision per page becomes live
- accepted `draft` revisions stay archived without replacing the live page
- bad direct writes are quarantined into `content/recovered-drafts/`

## default starter routes

The repo ships with safe placeholder content so it can be public without leaking private history.

Default routes:
- `/`
- `/features`
- `/how-it-works`
- `/howto/editorial/publishing-workflow`
- `/case-studies/teams/community-knowledge-base`
- `/contact`

Replace them through the content pipeline or reseed from `content/examples/seed/`.

## repo shape

- `site/*`
  site-owned customization seam for downstream forks
- `content/*`
  editorial inputs, archive, and recovery paths
- `lib/content/*`
  content engine, validation, state, metadata, archive, and recovery logic
- `components/blocks/*`
  canonical block implementations
- `components/templates/*`
  canonical page-template implementations
- `content/site.ts`
  compatibility shim for older references, now forwarding to `site/config.ts`

## deployment

The app is configured for static export with `next build`.

- `next.config.ts` uses `output: "export"`
- `public/_worker.js` can enforce a canonical host when `CANONICAL_HOST` is set
- `.github/workflows/deploy-pages.yml` can deploy to Cloudflare Pages when repo variables and secrets are configured

## docs to read next

For humans and agents, this is the best reading order:

1. `content/AUTHORING.md`
2. `content/submit-here/README.md`
3. `content/archive/README.md`
4. `content/recovered-drafts/README.md`
5. `site/README.md`
