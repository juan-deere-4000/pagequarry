# Content Pipeline Plan

## Goal

Build a content system that assumes the writer agent is unreliable.

The live site must stay stable even if an agent:

- writes markdown into the wrong folder
- edits accepted content directly
- edits generated state directly
- submits malformed or structurally invalid markdown
- ignores docs and guesses paths

The system must preserve work, quarantine mistakes, and only publish validated content.

## Key Decisions

### 1. Obvious Public Paths, Hidden Trusted State

Document only:

- `content/submit-here/`
- `content/recovered-drafts/`

Hide the trusted runtime state under:

- `content/.state/`

The app will trust only a generated manifest inside `.state/`.

### 2. Runtime Trusts Generated State, Never Raw Markdown

The site will render only from generated page records.

Raw markdown in the repo is never a routable source of truth.

That means:

- stray `.md` files cannot become live
- broken markdown cannot break styling at runtime
- direct edits to accepted markdown do not automatically affect the site

### 3. Accepted Content Is Revisioned

Each accepted page gets a stable `page_id` and a revision history under `.state/pages/<page_id>/revisions/`.

Each accepted revision stores:

- the accepted source markdown
- the normalized page json derived from that markdown
- metadata such as source hash, slug, template, accepted timestamp

Generated convenience files like `current.json` and the aggregate live index are rebuilt from accepted revisions.

### 4. Quarantine Instead of Delete

Bad writes are never discarded.

Anything found in the wrong place, or any direct tampering with generated or accepted files, gets moved into:

- `content/recovered-drafts/<timestamp>-<slug>/`

With a note explaining:

- where it came from
- why it was quarantined
- how to resubmit it

### 5. Closed Block Grammar

Authoring uses `Markdoc` with:

- yaml frontmatter for page metadata
- custom tags for approved blocks only
- strict attribute schemas
- template-specific block ordering rules
- no raw html
- no custom classes
- no inline style control

The writer agent is choosing from a fixed block library, not styling pages.

### 6. CLI Owns Publication

The CLI will provide:

- `usage`
- `list-templates`
- `list-blocks`
- `check`
- `submit`
- `edit`
- `audit`
- `recovery-list`
- `recovery-restore`
- `pages`

`submit` and `edit` validate, normalize, revision, regenerate state, and quarantine mistakes when needed.

### 7. Agent Tooling Is a Narrow Wrapper

Build a dedicated wrapper that exposes focused `content_*` tools for writers and keeps admin actions separate.

The plugin will surface structured validation failures in a readable format, following the same strong-formatting pattern that works well in the hk plugin.

The plugin docs will mention only:

- `content/submit-here/`
- `content/recovered-drafts/`

They will not mention `.state/`.

## Implementation Order

1. refactor runtime to read from a generated manifest and catch-all route generation
2. define the normalized page model and block grammar
3. implement markdoc parsing + validation + normalization
4. implement state store, revisioning, and atomic manifest regeneration
5. implement quarantine/audit logic
6. implement the cli
7. seed the current example pages through the cli so the live site uses the pipeline
8. build the automation wrapper and docs
9. add vitest with strong unit + integration coverage
10. run real functional tests from the shell as a sloppy writer
11. run adversarial tests as a dumb toddler against wrong paths and direct edits
12. fix findings until the loop is clean

## Testing Standard

Tests must cover:

- valid acceptance for each template family
- invalid tags and invalid attributes
- malformed frontmatter
- wrong block ordering
- duplicate slugs and route collisions
- direct writes into protected paths
- direct edits to accepted content
- direct edits to generated state
- recovery preservation
- manifest regeneration
- runtime route generation from generated state only

Manual testing must include:

- happy-path submit
- edit existing page
- invalid submit
- bypassing the cli and writing into hidden state
- bypassing the cli and writing into visible content folders
- re-running audit until the site is stable again

## Review Before Execution

The only reliable way to make an unreliable writer safe is to make direct writes inert and publication explicit.

That is what this plan does.
