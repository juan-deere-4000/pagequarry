# archive

this directory is a visible archive of accepted markdown.

layout:

- folders mirror the current canonical url
- `/` lives at `content/archive/index/`
- the latest accepted source lives at `current.md`
- all accepted revisions live under `revisions/`

important:

- this is a generated view, not the live source of truth
- the site still renders from hidden generated state in `content/.state/`
- direct edits here do not publish anything
- if you edit files here directly, the pipeline will restore the accepted version and move your edit into `content/recovered-drafts/`
- if a page slug changes, this archive moves with the new canonical url on the next rebuild

use this for:

- reading accepted markdown
- browsing revision history in git
- finding the current accepted source for a page

do not use this for:

- staging new drafts
- publishing edits

for new drafts, use `content/submit-here/` and the `bkk-content` cli.
