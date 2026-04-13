# Recovered Drafts

This directory is the safety net.

if a draft was written to the wrong place, or if accepted/generated content was edited directly, the system moves that work here instead of deleting it.

If something vanished, look here first.

## Why Files End Up Here

Common reasons:

- a draft was written outside `content/submit-here/`
- `content/archive/` was edited directly
- hidden state under `content/.state/` was edited directly
- generated files were tampered with

the system preserves the work here, then restores the trusted accepted state.

## What to Do When You Find a File Here

1. list recovery entries:

```bash
npm run content -- recovery-list
```

2. restore the one you want:

```bash
npm run content -- recovery-restore <id>
```

3. validate the restored draft:

```bash
npm run content -- check content/submit-here/<restored-file>.md
```

4. publish it correctly:

```bash
npm run content -- submit content/submit-here/<restored-file>.md
```

or, if it is a revision to an existing page:

```bash
npm run content -- edit content/submit-here/<restored-file>.md
```

## Important Behavior

- Files here are preserved on purpose
- Nothing here is live
- Restoring a file does not publish it
- Restore only moves a copy back into `content/submit-here/`
- You still need to run `check` and `submit` or `edit`
