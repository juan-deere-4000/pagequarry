# Site Customization Boundary

This directory is the site-owned seam for an upstream fork workflow.

- `config.ts`
  site identity, canonical url, navigation, footer copy, manifest defaults, and metadata defaults
- `blocks.ts`
  explicit composition point for site-owned overrides of the existing block keys
- `templates.ts`
  explicit composition point for site-owned overrides of the existing template keys

Today this seam is intentionally narrow:

- swap an existing renderer key in `site/blocks.ts` or `site/templates.ts`
- keep site-only presentation work local to the fork
- upstream a renderer later if it proves broadly reusable

Example shape:

```ts
export const siteBlockRegistry = {
  ...coreBlockRegistry,
  hero: SiteHeroBlock,
} satisfies SiteBlockRegistry;
```

Adding a brand-new block or template name still requires core contract and parser changes in `lib/content/*`. The starter keeps that limitation explicit instead of pretending the downstream contract is broader than it is.

Templates are also deliberately thin in this starter. Treat them as structured page families with shared layout primitives, not as fully separate app shells.

Canonical CMS core stays in the existing core directories:

- `components/blocks/*` and `components/templates/*`
  canonical block and template implementations
- `lib/content/*`
  content pipeline, generated state handling, metadata, and archive logic
- `components/site/*`
  shared layout primitives

`content/site.ts` remains a compatibility shim so older references do not break, but new site customization work should start here.
