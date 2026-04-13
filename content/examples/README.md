# Examples

this directory holds maintainer-owned starter fixtures and example content.

use it when you need to:

- reseed the default public starter site
- test the content pipeline against known-good examples
- inspect one example for each template family

the seedable markdown fixtures live in `content/examples/seed/`.

to reseed from them:

```bash
npm run content -- seed content/examples/seed
```

normal writing should not happen here. new drafts still belong in `content/submit-here/`.
