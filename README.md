# bkk ai lab poc

editorial proof-of-concept for the future `bkk-ai-lab` site.

the point of this repo is not just to show some sample pages. it is to prove a frontend shape that future ai agents can extend without inventing new spacing, colors, or component patterns on every page.

## control surfaces

if you need to change the site globally, start here:

- `app/globals.css`: color and font tokens
- `components/site/text.tsx`: typography recipes
- `components/site/button.tsx`: button recipe
- `components/site/section.tsx`: section spacing and tone rules
- `components/site/page-container.tsx`: content widths
- `content/site.ts`: site-wide metadata, nav, footer copy
- `components/blocks/registry.ts`: available block components
- `components/templates/registry.ts`: available page templates

## architecture

- `content/pages.ts` holds typed page entries
- each page entry declares its `template`, `path`, and `meta`
- `components/renderers/render-page.tsx` resolves the template from the registry
- templates assemble an ordered list of approved blocks
- `components/renderers/render-block.tsx` resolves each block from the block registry
- page route files should stay thin: metadata + one content entry

## working rules

- do not style route files directly
- do not add page-specific css
- if a visual treatment is new, add or edit a shared recipe/block/template
- keep content decisions in `content/*` and visual decisions in `components/site/*` or block files

## pages in the poc

- `/`
- `/services`
- `/how-it-works`
- `/howto/productivity/email-triage`
- `/case-studies/individuals/personal-health-ai`
- `/contact`

## commands

```bash
npm run dev
npm run lint
npm run build
```
