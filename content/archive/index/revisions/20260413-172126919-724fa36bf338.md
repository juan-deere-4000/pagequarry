---
template: home
slug: /
page_id: home
title: PageQuarry
description: Repo-native publishing for React sites with humans and AI agents sharing one block-based workflow.
---

{% hero eyebrow="Repo-Native Publishing" title="A React Site Framework with a Block-Based Markdown CMS." deck="PageQuarry is an open-source React framework for teams that want humans and AI agents publishing in the repo without reopening layout decisions. Developers define blocks, templates, navigation, and SEO in code. Writers and agents fill those blocks in markdown." aside="Get Started opens the repo. Look Under the Hood reveals the exact homepage markdown now driving this page." actionHref="https://github.com/juan-deere-4000/pagequarry" actionLabel="Get Started" /%}

{% metrics %}
{% metric label="Runs" value="Inside Your React Repo" /%}
{% metric label="Publishing Surface" value="Markdown Blocks with Validation" /%}
{% metric label="Shared Workflow" value="Humans and Agents Use the Same Path" /%}
{% /metrics %}

{% sectionCopy eyebrow="Product Boundary" title="What You Actually Install and Run." %}
PageQuarry is not a hosted admin panel. It is a React codebase with a block-based publishing layer wired into the repo. You clone it, define the presentation system in React, and publish pages from markdown.

That boundary matters. React owns layout, templates, navigation, metadata, and styling. Markdown owns content entry inside approved blocks.

{% linkItem href="/case-studies" label="Examples" summary="Inspect example patterns and the public artifact behind this site." /%}
{% linkItem href="/howto/editorial/publishing-workflow" label="Publishing Guide" summary="Read the command flow a human or agent actually follows." /%}
{% linkItem href="/homepage-markdown" label="Homepage Markdown" summary="Open the exact source currently driving this homepage." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="Agent Workflow" title="What an Agent Actually Does." tone="subtle" %}
An agent does not invent a page from scratch. It opens a draft file, calls approved blocks, fills the allowed fields, runs the check command, and submits the page for review. The surrounding design system never moves.

The point is to give humans and agents the same constrained publishing surface instead of asking either one to restyle the site on every edit.

- Open a draft in submit-here
- Reuse approved blocks instead of inventing layout
- Run the check command before acceptance
- Submit or edit the page into the published archive
{% /sectionCopy %}

{% sectionCopy eyebrow="React Example" title="Define the Presentation Once." %}
A developer builds the hero, CTA, FAQ, comparison row, or release-note block once. That React component owns spacing, type, interaction states, and visual rhythm.

After that, every page can reuse the same presentation instead of re-solving design in content.
{% /sectionCopy %}

{% sectionCopy eyebrow="Markdown Example" title="Publish New Pages Without Opening the Layout." tone="subtle" %}
People and AI tools call that block from markdown by filling approved inputs. The content changes, but the presentation stays locked to the React implementation.

That is the core promise of PageQuarry: faster publishing without giving up control of the site.
{% /sectionCopy %}

{% sectionCopy eyebrow="Supporting Infrastructure" title="The Rest of the System Stays Out of the Editor." %}
Templates, navigation, footer copy, redirects, metadata defaults, and validation live in code. That supporting infrastructure is what makes the markdown surface small enough for fast human and agent edits.

- Templates decide which blocks belong on which page types
- Navigation and metadata stay stable across edits
- Published source stays visible and reviewable in the repo
- Validation catches bad routes and broken block calls before they ship
{% /sectionCopy %}

{% process eyebrow="Publishing Path" title="How a Change Moves from Draft to Production." %}
{% step title="Draft the Page" body="Start in a markdown draft, choose existing blocks, and fill the content fields those blocks allow." /%}
{% step title="Check and Accept It" body="Run the validation step, then submit a new page or edit an existing one into the approved archive." /%}
{% step title="Build from Approved Content" body="The live site ships from accepted page data instead of whatever ad hoc working files happen to be in the repo." /%}
{% /process %}

{% quote quote="React owns the frame. Markdown owns the fill." attribution="PageQuarry" context="Product Boundary" /%}

{% cta title="Open the Repo and Try the Workflow." body="Clone the project, inspect the block system, and ship a page through the same publishing flow this site uses." actionHref="https://github.com/juan-deere-4000/pagequarry" actionLabel="View on GitHub" /%}
