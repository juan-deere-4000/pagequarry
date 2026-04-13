---
template: home
slug: /
page_id: home
title: PageQuarry
description: self-hostable site framework with markdown-first publishing and generated runtime state.
---

{% hero eyebrow="markdown-first publishing" title="ship a site that edits through markdown, not a fragile dashboard." deck="PageQuarry is a self-hostable site framework built for teams that want predictable publishing, clean starter content, and a runtime that only trusts generated state." aside="the system stays narrow on purpose: shared blocks, shared templates, one obvious site config file, and a content pipeline that treats mistakes as recoverable instead of fatal." actionHref="/contact" actionLabel="contact" /%}

{% metrics %}
{% metric label="hosting" value="static export, self-hostable" /%}
{% metric label="editorial model" value="markdown drafts with validation" /%}
{% metric label="runtime" value="generated state, not raw files" /%}
{% /metrics %}

{% sectionCopy eyebrow="what it is" title="a site framework with a narrow editing surface." %}
the goal is not to give every page its own ad-hoc layout logic. the goal is to make future edits predictable.

blocks and templates live in code. accepted markdown stays visible in the archive. the runtime renders only generated state, so the live site does not depend on stray files or guessed paths.

{% linkItem href="/features" label="features" summary="see the shared page families and site-level controls." /%}
{% linkItem href="/how-it-works" label="how it works" summary="see how drafts, archive history, and generated state fit together." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="what it keeps strict" title="the system is opinionated so future edits stay coherent." tone="subtle" %}
the framework ships with constraints because constraints are what make AI-assisted edits usable in the long run.

- no page-specific css in route files
- no raw markdown routed directly
- no hidden unpublished content leaking into runtime
- no guessing which file controls site identity
{% /sectionCopy %}

{% sectionCopy eyebrow="starter content" title="the shipped defaults are safe to replace." %}
this repo is meant to go public without leaking a real inbox, a client list, or a half-finished internal sales site.

the starter pages are neutral on purpose. use them as reference material, or replace them entirely through the content pipeline once you decide what the site actually needs to say.

{% linkItem href="/howto/editorial/publishing-workflow" label="starter guide" summary="a sample guide page showing the main editorial workflow." /%}
{% linkItem href="/case-studies/teams/community-knowledge-base" label="starter case study" summary="a sample case study page showing how the archive and case-study template behave." /%}
{% /sectionCopy %}

{% process eyebrow="publishing flow" title="configure, write, publish." %}
{% step title="set site identity in one place" body="edit content/site.ts for the name, site url, navigation, footer copy, manifest data, and default metadata." /%}
{% step title="write or revise markdown drafts" body="draft new pages in content/submit-here/, validate them, then accept them through the content cli." /%}
{% step title="ship from generated state" body="accepted revisions mirror into the visible archive, rebuild hidden state, and keep the runtime deterministic." /%}
{% /process %}

{% quote quote="the safest publishing system is the one that makes the right path obvious." attribution="PageQuarry" context="core product principle" /%}

{% cta title="start by editing the site config and starter pages." body="the repo is meant to be forked, renamed, and made yours. the defaults are there to show the system, not to lock you into a brand voice." actionHref="/contact" actionLabel="contact" /%}
