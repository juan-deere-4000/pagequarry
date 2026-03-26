---
template: narrative
slug: /how-it-works
title: how it works
description: plain-language architecture page covering local-first deployment, privacy boundaries, and capability expansion.
---

{% hero eyebrow="how it works" title="private ai should be explainable in plain english." deck="the useful version of this story is simple: connect to what already exists, keep the data where it belongs, and choose the inference path that matches the privacy bar." actionHref="/contact" actionLabel="book a consultation" /%}

{% sectionCopy eyebrow="step one" title="connect to the tools already in use." %}
email stays email. calendars stay calendars. file servers stay file servers.

the system becomes a connective layer that makes those sources legible and operationally useful together.
{% /sectionCopy %}

{% sectionCopy eyebrow="step two" title="keep the data in the client's environment." tone="subtle" %}
the default position is local-first.

either the models run locally, or the sensitive context stays local and only bounded inference requests leave the machine. ownership and revocability are not afterthoughts.
{% /sectionCopy %}

{% sectionCopy eyebrow="step three" title="expand by adding capabilities, not replacing the stack." %}
once the first workflow is live, the rest of the system grows by connecting more sources and turning on more skills.

the architecture is unified, so the client does not accumulate five unrelated mini-products.
{% /sectionCopy %}

{% process eyebrow="what the prototype proves" title="the poc site mirrors the product thesis in code." %}
{% step title="strict visual vocabulary" body="the prototype is built from a narrow set of containers, sections, blocks, and templates. no page-specific css hacks." /%}
{% step title="typed content shapes" body="the example pages are driven by structured content objects that map cleanly to the future markdown and block system." /%}
{% step title="coherent page families" body="home, hub, guide, case study, and narrative pages each have a stable structure and a stable job." /%}
{% /process %}

{% cta title="the real build would replace hard-coded content with a controlled authoring system." body="that means markdown-backed content, shared blocks, validation, and a content api for OpenClaw instead of editing JSX directly." actionHref="/contact" actionLabel="move from poc to production" /%}
