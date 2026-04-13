# Site Customization Boundary

this directory is the site-owned seam for an upstream-fork workflow.

- `config.ts`
  site identity, canonical url, navigation, footer copy, manifest defaults, and metadata defaults
- `blocks.ts`
  explicit composition point for site-owned block registry changes
- `templates.ts`
  explicit composition point for site-owned template registry changes

canonical cms core stays in the existing core directories:

- `components/blocks/*` and `components/templates/*`
  canonical block and template implementations
- `lib/content/*`
  content pipeline, generated state handling, metadata, and archive logic
- `components/site/*`
  shared layout primitives

`content/site.ts` remains as a compatibility shim so older references do not break, but new site customization work should start here.
