---
template: caseStudy
slug: /case-studies/teams/community-knowledge-base
page_id: case-studies-teams-community-knowledge-base
title: community knowledge base launch
description: a starter case study showing how a small team can use the shared publishing system without custom page code.
---

{% hero eyebrow="starter case study" title="a community archive with safer publishing." deck="this example case study shows how the same site framework can support a real editorial project without one-off routes, ad-hoc styling, or unpublished markdown leaking into runtime." aside="the case-study template is for proof pages: one concrete project, a few metrics, and a clear explanation of what changed." actionHref="/contact" actionLabel="contact" /%}

{% metrics %}
{% metric label="site type" value="community knowledge base" /%}
{% metric label="editorial team" value="small volunteer staff" /%}
{% metric label="publishing model" value="reviewed markdown revisions" /%}
{% /metrics %}

{% sectionCopy eyebrow="problem" title="the team needed a public site that stayed legible." %}
the old workflow mixed raw markdown, copied html fragments, and direct edits to production files. nobody was fully sure which change would become live next.

that made contributor onboarding harder and made every content change feel riskier than it needed to be.
{% /sectionCopy %}

{% sectionCopy eyebrow="build" title="the solution was a narrower editorial surface." tone="subtle" %}
the rebuild moved global identity into `content/site.ts`, page writing into `content/submit-here/`, and trusted runtime data into generated state.

accepted revisions remained readable in `content/archive/`, which gave the team a clean editorial history without exposing the runtime to arbitrary file writes.
{% /sectionCopy %}

{% sectionCopy eyebrow="result" title="publishing got simpler because the path got shorter." %}
contributors learned one draft location, one validation command, and one acceptance command. maintainers gained a visible archive, generated redirects, and recovery paths for bad direct writes.

{% linkItem href="/howto/editorial/publishing-workflow" label="publishing guide" summary="see the step-by-step version of the workflow used in this case study." /%}
{% linkItem href="/features" label="features" summary="review the rest of the framework around the same editorial model." /%}
{% /sectionCopy %}

{% cta title="use the case study as a template, not as a claim." body="the shipped examples are neutral by design. replace them with real work once the fork has a real audience, archive, and editorial voice." actionHref="/contact" actionLabel="contact" /%}
