# submit here

put draft markdown files here, then run:

```bash
npm run content -- submit content/submit-here/<file>.md
```

minimum valid frontmatter:

```yaml
---
template: guide
slug: /howto/productivity/email-triage
title: private email triage
description: private inbox routing without another saas dependency
---
```

full metadata example:

```yaml
---
template: guide
slug: /howto/productivity/email-triage
page_id: howto-productivity-email-triage
status: published

title: private email triage
description: private inbox routing without another saas dependency
summary: local-first email triage with strict workflow control

seo_title: private email triage for personal and executive inboxes
canonical_url: /howto/productivity/email-triage
robots: index

social_title: private email triage
social_description: local-first email triage with strict workflow control
social_image: guide
twitter_card: summary_large_image

author: bkk ai lab
published_at: 2026-03-26T00:00:00Z
updated_at: 2026-03-26T00:00:00Z
redirect_from:
  - /guides/email-triage
---
```

allowed values:

- `status`: `published` or `draft`
- `robots`: `index` or `noindex`
- `social_image`: `site`, `home`, `hub`, `guide`, `caseStudy`, `narrative`
- `twitter_card`: `summary` or `summary_large_image`

important behavior:

- `draft` revisions are accepted and archived, but do not replace the last published page on the live site
- if a page has never had a published revision, `draft` keeps it off the live site entirely
- accepted markdown appears in `content/archive/`
- redirects are generated from `redirect_from` for published pages

rules:

- do not write drafts anywhere else
- do not invent extra frontmatter keys
- if your draft gets rejected, read the lint output and fix the markdown
- if your work seems to disappear, check `content/recovered-drafts/`
