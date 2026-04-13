---
template: guide
slug: /howto/editorial/publishing-workflow
page_id: howto-editorial-publishing-workflow
title: publishing workflow
description: how to validate and publish a page safely through the content pipeline.
---

{% hero eyebrow="starter guide" title="publishing a page from markdown." deck="this guide shows the default editorial path for standalone cms: stage the draft, validate it, accept it, and let the runtime rebuild from trusted state." aside="the guide template is intentionally simple. it is for practical walkthroughs, not homepage storytelling." actionHref="/contact" actionLabel="contact" /%}

{% sectionCopy eyebrow="start here" title="write the draft in one place." %}
new markdown belongs in `content/submit-here/`. that is the only directory writers should treat as a staging surface.

keeping drafts out of the archive and out of hidden state is what makes the recovery model straightforward.
{% /sectionCopy %}

{% sectionCopy eyebrow="validate" title="check before accepting." tone="subtle" %}
run `npm run content -- check content/submit-here/<file>.md` before you publish if the draft is new or uncertain.

the checker catches bad frontmatter, invalid block attrs, broken template order, and route collisions before the draft becomes accepted content.
{% /sectionCopy %}

{% sectionCopy eyebrow="accept" title="submit new pages or edit existing ones." %}
`submit` accepts a new draft. `edit` accepts a revision to an existing page. both commands write accepted revisions, rebuild the live index, and mirror the readable source into `content/archive/`.

{% linkItem href="/how-it-works" label="how it works" summary="review the full generated-state model behind the publishing flow." /%}
{% linkItem href="/features" label="features" summary="see the broader site system around the editorial workflow." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="recovery" title="mistakes should still be recoverable." tone="subtle" %}
if someone edits generated files directly or drops markdown in the wrong place, the system quarantines that work into `content/recovered-drafts/` instead of letting it vanish.

that is why the framework can tolerate messy automation without turning the live site brittle.
{% /sectionCopy %}

{% cta title="use the guide, then replace it with your own." body="the starter guide is here to prove the template, archive, and how-to index. once the fork has real editorial needs, publish the guides your site actually needs." actionHref="/contact" actionLabel="contact" /%}
