---
template: hub
slug: /features
title: features
description: feature overview for the standalone cms starter site.
---

{% hero eyebrow="feature hub" title="one framework, several page families." deck="the product is not a visual page builder. it is a controlled publishing system with reusable templates, a shared block catalog, and a generated runtime model." actionHref="/contact" actionLabel="contact" /%}

{% sectionCopy eyebrow="site identity" title="one obvious config surface." %}
`content/site.ts` is where the site name, canonical url, navigation, footer copy, manifest defaults, and metadata defaults live.

that keeps brand edits and launch prep out of route files.

{% linkItem href="/how-it-works" label="how it works" summary="see how site config, archive history, and generated state fit together." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="editorial system" title="markdown drafts with validation." tone="subtle" %}
new pages start in `content/submit-here/`. the content cli validates frontmatter, approved block syntax, block order, and route collisions before accepting anything.

accepted revisions stay visible in `content/archive/`, which makes the publishing history easy to read and audit.

{% linkItem href="/howto/editorial/publishing-workflow" label="publishing guide" summary="the starter how-to page walks through the workflow." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="runtime safety" title="generated state keeps the live site calm." %}
the runtime reads a generated live index, not whichever markdown files happen to be present in the repo. direct mistakes are quarantined into recovery instead of silently becoming live.

{% linkItem href="/case-studies/teams/community-knowledge-base" label="starter case study" summary="see how one project can use the shared system without custom page code." /%}
{% linkItem href="/contact" label="contact" summary="replace the placeholder contact surface before launch." /%}
{% /sectionCopy %}

{% cta title="the framework is meant to be made yours." body="rename it, replace the starter content, and keep the publishing rules intact. the value is the structure, not the default copy." actionHref="/contact" actionLabel="contact" /%}
