# content pipeline plan

## goal

build a content system that assumes the writer agent is unreliable.

the live site must stay stable even if an agent:

- writes markdown into the wrong folder
- edits accepted content directly
- edits generated state directly
- submits malformed or structurally invalid markdown
- ignores docs and guesses paths

the system must preserve work, quarantine mistakes, and only publish validated content.

## key decisions

### 1. obvious public paths, hidden trusted state

document only:

- `content/submit-here/`
- `content/recovered-drafts/`

hide the trusted runtime state under:

- `content/.state/`

the app will trust only a generated manifest inside `.state/`.

### 2. runtime trusts generated state, never raw markdown

the site will render only from generated page records.

raw markdown in the repo is never a routable source of truth.

that means:

- stray `.md` files cannot become live
- broken markdown cannot break styling at runtime
- direct edits to accepted markdown do not automatically affect the site

### 3. accepted content is revisioned

each accepted page gets a stable `page_id` and a revision history under `.state/pages/<page_id>/revisions/`.

each accepted revision stores:

- the accepted source markdown
- the normalized page json derived from that markdown
- metadata such as source hash, slug, template, accepted timestamp

generated convenience files like `current.json` and the aggregate live index are rebuilt from accepted revisions.

### 4. quarantine instead of delete

bad writes are never discarded.

anything found in the wrong place, or any direct tampering with generated/accepted files, gets moved into:

- `content/recovered-drafts/<timestamp>-<slug>/`

with a note explaining:

- where it came from
- why it was quarantined
- how to resubmit it

### 5. closed block grammar

authoring uses `Markdoc` with:

- yaml frontmatter for page metadata
- custom tags for approved blocks only
- strict attribute schemas
- template-specific block ordering rules
- no raw html
- no custom classes
- no inline style control

the writer agent is choosing from a fixed block library, not styling pages.

### 6. cli owns publication

the cli will provide:

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

### 7. openclaw plugin is a narrow wrapper

build a dedicated plugin that wraps the cli with a single `bkk_content` tool.

the plugin will surface structured validation failures in a highly readable format, following the same strong-formatting pattern that works well in the hk plugin.

the plugin docs will mention only:

- `content/submit-here/`
- `content/recovered-drafts/`

they will not mention `.state/`.

## implementation order

1. refactor runtime to read from a generated manifest and catch-all route generation
2. define the normalized page model and block grammar
3. implement markdoc parsing + validation + normalization
4. implement state store, revisioning, and atomic manifest regeneration
5. implement quarantine/audit logic
6. implement the cli
7. seed the current example pages through the cli so the live site uses the pipeline
8. build the openclaw plugin wrapper and docs
9. add vitest with strong unit + integration coverage
10. run real functional tests from the shell as a sloppy writer
11. run adversarial tests as a dumb toddler against wrong paths and direct edits
12. fix findings until the loop is clean

## testing standard

tests must cover:

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

manual testing must include:

- happy-path submit
- edit existing page
- invalid submit
- bypassing the cli and writing into hidden state
- bypassing the cli and writing into visible content folders
- re-running audit until the site is stable again

## review before execution

the only reliable way to make an unreliable writer safe is to make direct writes inert and publication explicit.

that is what this plan does.
