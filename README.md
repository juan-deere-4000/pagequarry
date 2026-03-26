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

- raw authoring starts in `content/submit-here/`
- rescued mistakes land in `content/recovered-drafts/`
- `lib/content/markdown.ts` parses and validates the closed `Markdoc` block grammar
- `lib/content/state.ts` accepts revisions, rebuilds generated state, and quarantines bad direct writes
- `lib/content/runtime.ts` reads only the generated live index
- `components/renderers/render-page.tsx` resolves the template from the registry
- page route files stay thin and render by slug from generated content state

## working rules

- do not style route files directly
- do not add page-specific css
- if a visual treatment is new, add or edit a shared recipe/block/template
- raw drafts belong in `content/submit-here/`
- use `npm run content -- check <file>` before `submit` when a draft is uncertain
- if work disappears, check `content/recovered-drafts/` before assuming it is lost
- keep visual decisions in `components/site/*` or block files

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
npm run test
npm run test:coverage
npm run content -- usage
npm run build
```
