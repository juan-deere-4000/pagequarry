---
template: hub
slug: /howto
page_id: howto
title: Guides
description: Guides and operational pages for running the PageQuarry publishing workflow.
---

{% hero eyebrow="Guides" title="Operational Guides for Running the Publishing Flow." deck="These pages are for the practical side of PageQuarry: how to stage a draft, validate it, accept it, and understand what the runtime does next." actionHref="/howto/editorial/publishing-workflow" actionLabel="Open the Guide" /%}

{% sectionCopy eyebrow="Start Here" title="Begin with the Publishing Workflow." %}
If you want the shortest path to understanding the system, start with the guide. It covers the actual sequence a human or agent would follow to get a page from draft to live site.

{% linkItem href="/howto/editorial/publishing-workflow" label="Publishing Workflow" summary="The concrete guide for writing, checking, and accepting a page." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="Then Read the Architecture" title="Use the Guides Together, Not in Isolation." tone="subtle" %}
The guide explains what to do. The architecture page explains why the system is built that way. Read them together and the model becomes much easier to judge.

{% linkItem href="/how-it-works" label="How It Works" summary="The plain-language explanation of how accepted content becomes the site." /%}
{% linkItem href="/features" label="Features" summary="The surrounding system that keeps the publishing surface small." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="Audience" title="These Guides Are for Teams Publishing from the Repo." %}
The guides assume the site lives in version control, the presentation system lives in React, and content is being edited by humans and AI agents inside the same repository.

That is the environment PageQuarry is designed for.
{% /sectionCopy %}

{% cta title="Open the Workflow Guide." body="Start with the concrete page-publishing sequence, then work outward into features and architecture." actionHref="/howto/editorial/publishing-workflow" actionLabel="Read the Workflow" /%}
