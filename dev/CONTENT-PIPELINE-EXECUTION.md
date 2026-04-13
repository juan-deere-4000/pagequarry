# content pipeline execution

## objective

ship a content pipeline that assumes the writer automation is unreliable, impatient, and bad at following directions.

the site must stay stable if it:

- writes markdown into random folders
- edits accepted files directly
- edits generated state directly
- submits malformed markdown
- ignores the cli and guesses

the pipeline is complete only when those failures are either rejected cleanly or quarantined without losing work.

## non-negotiables

- the app trusts only generated state under `content/.state/`
- the documented authoring path is `content/submit-here/`
- rescued mistakes land in `content/recovered-drafts/`
- the app never renders raw markdown directly
- publication happens only through the cli or a thin wrapper around it
- any direct-write mistake must preserve the draft somewhere recoverable

## execution loop

### 1. lock the contract

- finalize the page model, block grammar, template rules, and route collision rules
- make the runtime read only from generated state
- seed example markdown fixtures that match the contract

exit condition:
- one valid markdown example exists for each page family the site currently uses

### 2. go red on tests

- run unit and integration tests for parser, state, cli, and runtime paths
- add missing tests before fixing code if an important failure mode is not covered
- keep the tests honest: no fake success expectations, no vague assertion text, no brittle snapshots as the primary guardrail

exit condition:
- failures describe real gaps, not test mistakes

### 3. fix the system until green

- repair parser, normalization, state rebuild, slug checks, and quarantine behavior
- seed content through the cli and make the app boot from generated state
- keep rerunning `test`, `lint`, `build`, `content:audit`, and `content:seed` as needed

exit condition:
- tests, lint, build, audit, and seed are all green

### 4. wrap it for automation

- build a dedicated wrapper with a narrow content tool surface
- mirror the command patterns and readable failure formatting used in the cli
- document only the public authoring and recovery paths
- do not mention internal state paths in plugin-facing docs

exit condition:
- the wrapper can list templates, list blocks, check drafts, submit drafts, inspect recovery, and restore drafts

### 5. tighten coverage

- measure coverage after the system works
- add tests for any low-coverage branches that matter to correctness
- prioritize direct-write quarantine, revision repair, malformed markdown, and bad edit flows

exit condition:
- coverage thresholds are met without padding the suite with bullshit tests

### 6. functional testing as a sloppy writer

- use the cli by hand with valid drafts
- submit broken drafts
- edit an existing page
- drop files into the wrong folders
- tamper with accepted content and generated state
- verify the system preserves work and keeps the site stable

exit condition:
- real shell usage matches the designed safety model

### 7. adversarial testing as a dumb toddler

- try wrong folders, wrong filenames, wrong frontmatter, wrong blocks, wrong child tags, duplicate slugs, route collisions, and direct state edits
- keep anything valuable in recovery instead of losing it
- confirm the runtime still serves the last good content

exit condition:
- the easiest wrong move is still recoverable and non-destructive

### 8. ship

- commit the repo coherently
- deploy the site update to the chosen static host
- summarize the exact guarantees, the recovery path, and any remaining edge risk

exit condition:
- repo, deploy, and docs all describe the same system

## once-over before execution

the failure mode the maintainer actually cares about is not “the markdown linter caught a typo.”

it is “an unreliable agent had shell access, did the wrong thing for an hour, and still did not break production or lose the draft.”

that means the critical path is:

1. generated-state-only runtime
2. quarantine and recovery
3. strict validation
4. narrow wrapper surface
5. real-world abuse testing

that is the order i’m following.
