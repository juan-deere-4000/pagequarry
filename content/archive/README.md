# archive

this directory is a visible archive of accepted markdown.

it exists so writers and git can see the accepted source and revision history.

## what is here

- folders mirror the current canonical url
- `/` lives at `content/archive/index/`
- the latest accepted source lives at `current.md`
- all accepted revisions live under `revisions/`

example:

- `content/archive/contact/current.md`
- `content/archive/contact/revisions/<revision-id>.md`

## what this directory is for

use this for:

- reading the current accepted source for a page
- copying the current accepted source before making an edit
- browsing revision history in git
- confirming what the pipeline last accepted

do not use this directory as the syntax reference for the system.

for canonical block syntax and frontmatter rules, use:

- `content/AUTHORING.md`
- `content/submit-here/README.md`
- `npm run content -- list-blocks`
- `npm run content -- list-templates`

## what this directory is not for

do not use this for:

- staging new drafts
- publishing edits
- making direct fixes

this is a generated mirror, not a staging area.

## important behavior

- the site does not render directly from these markdown files
- the site renders from hidden generated state in `content/.state/`
- direct edits here do not publish anything
- if you edit files here directly, the pipeline will restore the accepted version and move your edit into `content/recovered-drafts/`
- if a page slug changes, this archive moves with the new canonical url on the next rebuild
- `current.md` is the latest accepted revision, which may be a `draft`
- the live site uses the newest accepted `published` revision for that page

## how to use this directory correctly

to revise an existing page:

1. open `current.md` for that page
2. copy its content into a new draft under `content/submit-here/`
3. make your edits there
4. run `check`
5. run `edit`

example:

```bash
npm run content -- check content/submit-here/contact.md
npm run content -- edit content/submit-here/contact.md
```

for new drafts, always use:

- `content/submit-here/`

not this directory.
