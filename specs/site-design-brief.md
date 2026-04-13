# PageQuarry Site Design Brief

## Purpose
Build a one-page public site for PageQuarry that doubles as a real end-to-end proof that the CMS can be forked, customized, authored, built, and published cleanly.

## Audience
- technical founders
- product-minded operators
- developers who hate dashboard CMS bloat
- people evaluating whether this is a sane base for a real site

## Message
PageQuarry is a calm, opinionated, markdown-first site system.
It keeps publishing narrow, visible, and recoverable.
It is for people who would rather own files and clear contracts than babysit a brittle admin UI.

## Site Shape
Single page only.

Sections:
1. Hero
2. What it is
3. Why it is different
4. How it works
5. Proof / principles
6. Final GitHub CTA

## Visual Direction
- editorial, premium, quiet
- warm paper background
- dark ink text
- restrained accent, probably clay/copper
- strong typography and spacing
- looks serious on desktop, elegant on mobile
- avoid startup gradient sludge and fake enterprise chrome

## UX Rules
- primary CTA goes to the public GitHub repo
- nav should stay simple and anchor-based if used at all
- no extra routes in the final published site
- avoid walls of text
- every section should earn its space

## Technical Rules
- keep site-specific changes in site-owned surfaces where practical
- use Tailwind and existing tokens
- use Playwright for visual verification if environment allows
- document any environment blockers honestly
- file GitHub issues for real CMS rough edges discovered during the build
