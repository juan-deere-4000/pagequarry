# Examples

This directory holds maintainer-owned starter fixtures and example content.

Use it when you need to:

- reseed the default public starter site
- test the content pipeline against known-good examples
- inspect one example for each template family

The seedable markdown fixtures live in `content/examples/seed/`.

To reseed from them:

```bash
npm run content -- seed content/examples/seed
```

Normal writing should not happen here. New drafts still belong in `content/submit-here/`.
