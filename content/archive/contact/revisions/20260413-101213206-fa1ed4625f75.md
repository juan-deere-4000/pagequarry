---
template: narrative
slug: /contact
title: contact
description: safe placeholder contact page for the starter site.
---

{% hero eyebrow="contact" title="replace this page before launch." deck="the starter site ships with a neutral contact surface and `hello@example.com` so the repo can be public without leaking a real inbox." actionHref="mailto:hello@example.com?subject=hello%20from%20the%20starter%20site" actionLabel="email" /%}

{% sectionCopy eyebrow="what to change" title="swap the placeholder details before you ship." %}
update the contact email in `content/site.ts`, then rewrite this page to match the real call to action for your site.

the default copy is intentionally boring. it exists to keep the repo public-safe while still giving the navigation and template system a real page to render.
{% /sectionCopy %}

{% sectionCopy eyebrow="why it is a page" title="the starter site still needs a complete route map." tone="subtle" %}
navigation, metadata, social cards, and generated state all behave better when the default site has one accepted page for each core route you expect to keep.

that makes `/contact` useful as a placeholder. it demonstrates the narrative template and gives you one obvious place to replace the launch-facing contact copy later.
{% /sectionCopy %}

{% sectionCopy eyebrow="current placeholder" title="starter contact details" %}
hello@example.com

replace the email, location line, and cta text before the site goes live.
{% /sectionCopy %}

{% cta title="use the placeholder, then replace it intentionally." body="a public starter repo should be safe by default. once the fork has a real identity, rewrite this page through the content pipeline instead of patching the runtime directly." actionHref="/howto/editorial/publishing-workflow" actionLabel="review the publishing guide" /%}
