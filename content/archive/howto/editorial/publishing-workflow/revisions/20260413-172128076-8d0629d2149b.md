---
template: guide
slug: /howto/editorial/publishing-workflow
page_id: howto-editorial-publishing-workflow
title: Publishing Workflow
description: How to publish a page in PageQuarry without breaking the site.
---

{% hero eyebrow="Guide" title="How to Publish a Page Without Breaking the Site." deck="A human or agent follows the same short loop: draft a markdown file, call approved blocks, run the check command, accept the page, and rebuild from approved content." aside="The goal is not more process. The goal is one clear path that humans and AI tools can both follow." actionHref="/how-it-works" actionLabel="How It Works" /%}

{% sectionCopy eyebrow="Write the Draft" title="Start with One Markdown File." %}
Write the page in the submit-here directory so drafts stay separate from published history and generated site data. The draft should call approved blocks and fill their inputs rather than invent new presentation in markdown.

One draft file should lead to one clear publishing decision.
{% /sectionCopy %}

{% sectionCopy eyebrow="Validate" title="Run the Check Command Before You Accept It." tone="subtle" %}
Use npm run content -- check content/submit-here/your-file.md to validate the draft. The checker catches bad frontmatter, invalid block usage, and route collisions before the change becomes trusted.

That validation step is what keeps fast editing from turning into silent production mistakes.
{% /sectionCopy %}

{% sectionCopy eyebrow="Accept" title="Accept New Pages or Revisions with One Command." %}
Use npm run content -- submit content/submit-here/your-file.md for a new page. Use npm run content -- edit content/submit-here/your-file.md when you are revising an existing page.

Published source is mirrored into the archive and the live site data is rebuilt from there. That means the agent can help write the draft, but the trusted source only changes when the reviewed command runs.

{% linkItem href="/how-it-works" label="How It Works" summary="See why the site builds from reviewed pages instead of raw files." /%}
{% linkItem href="/features" label="Features" summary="Review the surrounding system that keeps the workflow predictable." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="Recovery" title="Bad Edits Should Still Be Recoverable." tone="subtle" %}
If someone writes to the wrong place or mangles generated files, the system quarantines that work into recovered drafts instead of letting it disappear or leak live.

That is a practical requirement when people and AI tools are both touching the same repository.
{% /sectionCopy %}

{% cta title="See the Rest of the Workflow." body="If the command flow makes sense, the architecture page shows why the system is structured this way." actionHref="/how-it-works" actionLabel="Read How It Works" /%}
