---
template: narrative
slug: /how-it-works
title: how it works
description: plain-language architecture page covering site config, markdown publishing, and generated runtime state.
---

{% hero eyebrow="how it works" title="generated state keeps the runtime predictable." deck="the editing model is simple: write markdown in one place, validate it, accept it, and let the system rebuild the live index from trusted revisions." actionHref="/contact" actionLabel="contact" /%}

{% sectionCopy eyebrow="step one" title="set the site identity in one file." %}
`content/site.ts` is the public config surface. it holds the site name, canonical url, navigation, footer copy, manifest defaults, and metadata defaults.

you should not need to hunt through route files to rename the site or change the header.
{% /sectionCopy %}

{% sectionCopy eyebrow="step two" title="stage drafts in one obvious place." tone="subtle" %}
new markdown goes into `content/submit-here/`. that keeps writing separate from accepted history and separate from the generated runtime files.

the content cli validates frontmatter, block syntax, template order, and route collisions before anything becomes trusted state.
{% /sectionCopy %}

{% sectionCopy eyebrow="step three" title="render only from accepted revisions." %}
the app does not route raw markdown directly. accepted revisions are mirrored into `content/archive/`, then rebuilt into hidden generated state under `content/.state/`.

that means bad direct writes are recoverable without becoming live by accident.
{% /sectionCopy %}

{% process eyebrow="runtime model" title="how accepted content becomes the site." %}
{% step title="validate drafts" body="the parser checks frontmatter, approved block tags, and template sequence before a draft can be accepted." /%}
{% step title="mirror accepted content" body="accepted revisions land in the visible archive so the live source remains readable in git." /%}
{% step title="rebuild trusted state" body="the runtime reads the generated live index, not whatever markdown files happen to exist in the repo." /%}
{% /process %}

{% cta title="the editing path should stay obvious." body="that is the entire point of the framework. if a future edit requires guessing where content lives or what becomes live, the system is no longer doing its job." actionHref="/features" actionLabel="review the feature set" /%}
