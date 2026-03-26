# siam ai lab poc agent rules

this repo is a constrained frontend system. the point is to make future ai edits predictable.

## next.js note

this repo is on Next.js 16. if you touch framework behavior you are not fully sure about, read the relevant guide in `node_modules/next/dist/docs/` first.

## do not improvise styling

- do not add page-specific css
- do not add css modules
- do not add inline styles
- do not add raw hex colors outside `app/globals.css`
- do not add arbitrary tailwind values in page files
- do not tune margins/padding one page at a time

## approved control surfaces

- tokens: `app/globals.css`
- typography: `components/site/text.tsx`
- shared layout primitives: `components/site/*`
- global brand/nav/footer copy: `content/site.ts`
- metadata defaults and schema helpers: `lib/content/metadata.ts`
- authoring guide: `content/AUTHORING.md`
- accepted-content archive docs: `content/archive/README.md`
- authoring inbox docs: `content/submit-here/README.md`
- recovery docs: `content/recovered-drafts/README.md`
- content pipeline logic: `lib/content/*`
- example markdown fixtures: `content/examples/seed/*`
- block catalog: `components/blocks/registry.ts`
- template catalog: `components/templates/registry.ts`

## extension rules

- if content needs a new visual pattern, add a block component and register it
- if a new page family is needed, add a template and register it
- route files should stay thin and should not contain layout logic
- do not make raw markdown files routable directly
- treat publication as a content-pipeline concern, not a route-file concern
- keep the system editorial, light, serif-led, and text-first
- the `bkk_content` OpenClaw tool mirrors `npm run content` and should be treated as the same publishing surface, with `stage` as the one extra helper
