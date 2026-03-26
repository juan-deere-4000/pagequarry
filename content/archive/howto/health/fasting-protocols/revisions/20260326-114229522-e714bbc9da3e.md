---
template: guide
slug: /howto/health/fasting-protocols
page_id: howto-health-fasting-protocols
title: "How to Build: Intermittent Fasting Protocols with Private AI"
description: "Build a private AI system that tracks IF schedules, enforces feeding windows, and derives fasting compliance automatically from meal timestamps."
---

{% hero eyebrow="guide" title="How to Build: Intermittent Fasting Protocols with Private AI" deck="A private AI system that tracks IF schedules, enforces feeding windows, and derives compliance automatically from meal timestamps — on your own hardware." actionHref="/contact" actionLabel="book a consultation" /%}

{% sectionCopy eyebrow="overview" title="What it is: compliance tracking from meal timestamps, not self-reporting" %}
A private system that manages structured fasting programs on top of your existing meal data. You define a weekly schedule — which days are intermittent fasting, which are full fasts, which are unrestricted — and the system handles the rest. It knows what type of day it is right now, whether your feeding window is open or closed, how long you've been fasting, and whether you're on track. Compliance is computed automatically from meal timestamps, not self-reported.

The interesting thing about a fasting system is that most of the data already exists. If you're tracking meals through a health app, a food logger, or conversational entries to your AI, the system already knows when you ate. Fasting compliance is derived from the gaps between meals, checked against a schedule. The system doesn't need you to "log a fast." It infers fasting status from the absence of food entries, which is more reliable than asking someone to remember to press a button.

You could build this a hundred different ways. What follows is one approach that works, comes from a system that's been running on real fasting data, and is straightforward to understand. Your AI agent checks in on a schedule, alerts you when something needs attention, and answers questions about your fasting history whenever you ask. The data lives in your database, on your hardware, queryable however you want.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="How you use it: daily IF status, window alerts, and weekly compliance" tone="subtle" %}
You tell your AI what your fasting schedule looks like: "Mondays and Thursdays are full fasts, Tuesday through Friday are 18:6 with a 13:00 to 19:00 window, weekends are free." The agent stores the schedule and starts tracking against it.

From there, everything runs on its own. Each morning, a message tells you what kind of day it is and when your feeding window opens (or that it's a full fast day). During an IF day, you get a heads-up when the window is about to close. At the end of each week, OpenClaw delivers a compliance summary to your Telegram, Signal, Discord, or whichever channel you use — how many days you hit, how many you missed, your current streak.

Meals flow in through whatever path you're already using. If you log food in a health app on your phone, those entries sync automatically. Sending a photo of your lunch to the bot works. Typing "had a coffee with cream at 10:30" works. There's nothing extra to do for the fasting side — the system watches what you eat and when, and derives the rest.

You can ask questions whenever: "am I on track today?" gives you your current fasting duration, window status, and whether you've eaten anything. "How was last week?" shows compliance day by day. "What's my longest streak?" pulls it from the history. If your schedule changes — you want to swap a fasting day for an IF day, shift your window to 14:00-20:00, or take a week off — just tell the agent. The schedule updates and tracking adjusts immediately.
{% /sectionCopy %}

{% sectionCopy eyebrow="architecture" title="Architecture: SQLite, Node.js CLI, and OpenClaw plugin" %}
This system is a computation layer on top of existing meal data, not a standalone data pipeline. If you already have food entries flowing into a health database (from a phone health app, a food logger, or conversational logging), the fasting system reads those entries and derives everything from timestamps. If you don't have meal data yet, you'll need that piece first — see Meal & Nutrition Tracking for the ingestion side.

The implementation described here uses Node.js, SQLite, and a CLI tool wrapped as an OpenClaw plugin. Python with the same SQLite driver works equally well. Go and DuckDB would too. The important parts are the data model and the separation between deterministic computation and conversational interface, not the specific language.

**The schedule**

The weekly schedule is the core configuration. It defines, for each day of the week, what type of day it is and what rules apply. Three day types: **fast** (no caloric intake for 24 hours), **if** (intermittent fasting with a defined feeding window), and **free** (unrestricted eating, though calorie targets may still apply). Each day in the schedule specifies its type, and for IF days, the window open and close times (for example, 13:00 and 19:00). Per-day calorie caps can live at the day-type level or per individual day, depending on how granular you want to get.

This can live in the database or a config file. A database table makes it easier to track schedule changes over time — when did you switch from 16:8 to 18:6? what was the schedule when you hit your best compliance streak? A config file is simpler if you don't care about schedule history. Either way, the system reads the schedule to determine today's rules, then evaluates food entries against them.

The schedule defines intent, not compliance. Compliance is always computed from actual meal data. If Tuesday is scheduled as a fast day but you ate lunch, the system records Tuesday as non-compliant. It doesn't ask you to confirm or self-report. The meal timestamp is the ground truth.

**Eating state computation**

This is the core of the system: given the current time and today's schedule, what's the fasting status right now?

The computation reads the latest food entries from the database, looks up today's day type from the schedule, and derives:

- **Day type** — fast, IF, or free, from the schedule by day of week
- **Current fast duration** — time elapsed since the last food entry's timestamp
- **Feeding window status** — for IF days: open, closed, or a countdown. "Window opens in 2h 15m" or "window closes in 45m"
- **Calories consumed today** — sum of caloric entries since midnight
- **On-track flag** — a boolean. For fast days: no food entries today. For IF days: all entries within the window and calories under the cap. For free days: always on-track, or under the calorie cap if one is set

All of this is deterministic. No model involved. The computation is timestamp arithmetic and threshold checks. Fasting duration is the difference between the current time and the last meal timestamp. The on-track flag is a set of boolean conditions. This is code you can test exhaustively with known inputs, which is important because the edge cases multiply quickly. What happens at midnight? What if the last meal was two days ago? What if someone logs black coffee on a fast day — is that a violation? (It depends on your protocol. Zero-calorie entries might be fine. The system should let you configure this rather than hard-coding an opinion.)

The eating state function is the most-called piece of the system. Cron jobs call it. The agent calls it when you ask "how's my fast going?" It should be fast, pure (no side effects), and thoroughly tested.

**Storage**

If you already have a health database with food entries (timestamps, calories, macros), the fasting system adds two concerns: the schedule and optionally a compliance cache.

The **fasting_schedule** table holds one row per day-of-week per schedule version. Fields include the day of week (0-6), day type (fast/if/free), window open and close times (or null), calorie cap (or null), and an effective-from date. The effective-from field versions schedule changes: when you switch protocols, a new row set takes effect and the old schedule is preserved for historical compliance queries. This is worth building in from the start.

The **fasting_compliance** table (optional) holds one row per day, computed and cached by an end-of-day cron job. Fields include the date, day type, compliant flag, first and last meal timestamps, calories, window violation count, and notes.

The compliance cache is optional because compliance can be computed on the fly from raw food entries. Query all entries for a date range, evaluate each day against the schedule that was active on that date, and you're done. For personal use with a few months of data, this is fast enough. If you're building for a practice with hundreds of clients, you'll want the cache. For most people, start without it and add it if queries slow down.

The food entries themselves live in the health database. They already exist with timestamps, calories, and macros. The fasting system reads them; it doesn't own them. This is a design decision worth being deliberate about — the fasting layer is a read-only consumer of meal data. If something looks wrong in the compliance report, the fix is in the meal data, not the fasting system.

SQLite with WAL mode for concurrent reads, foreign keys enforced. The database file sits on your local disk with no network exposure. Filesystem permissions handle access control. If your machine has disk encryption enabled (FileVault, LUKS), the data is encrypted at rest automatically.

**CLI surface**

Every operation is a CLI subcommand returning structured JSON. The CLI handles data and computation; OpenClaw's agent handles natural language. This separation matters because JSON output makes the tool testable, composable, and trivially wrappable as an OpenClaw plugin. If the output is human-formatted text, the plugin has to scrape it. With JSON, the plugin is mechanical: parse args, call CLI, return stdout.

Subcommands:

- **today** — real-time eating state. Day type, fasting duration, window status (open/closed/countdown), calories consumed, on-track flag. This is what the agent calls when you ask "how's my fast going?" and what cron jobs call for status checks. Returns everything needed in one call.
- **compliance** — compliance report over a date range. Each day's type, whether it was compliant, first and last meal timestamps, calorie total, and window violation count. Supports daily, weekly, and monthly rollups. Returns streak information: current streak length and longest streak.
- **window** — feeding window detail for IF days. When it opened, when it closes, entries inside and outside the window, time remaining. Useful for the window-close warning cron.
- **schedule** — read or update the weekly schedule. Returns the active schedule with effective date. Updates create a new version rather than overwriting, so historical queries always reference the schedule that was active at the time.
- **summary** — trend data over weeks or months. Compliance percentages by week, average fasting duration on IF days, calorie averages by day type, streak history.

Each subcommand includes a next-step field when the output suggests a follow-up action. If today returns a violation (eating outside the window), it points to checking the full day's entries. If compliance shows a broken streak, it notes the specific day. This output chaining means the agent doesn't need workflow instructions in a system prompt — each step's output contains the next step's context.

**Scheduling and alerts**

OpenClaw's cron system runs scheduled checks. The CLI returns JSON. OpenClaw runs it on a schedule and delivers output through whichever messaging channel you use. The CLI doesn't send messages or know about channels. This separation means adding a new alert is an OpenClaw cron entry, not code in the tool. If you switch from Telegram to Signal, zero code changes in the CLI.

Typical cron jobs:

**Morning check.** Runs early. Calls today and tells you what kind of day it is. On IF days, includes the countdown to window open. On fast days, a reminder. On free days, it can skip entirely or just note the calorie target. This is the simplest job and the one people find most useful — it replaces the mental overhead of remembering what today's protocol is.

**Window close warning.** Runs 30-60 minutes before the feeding window closes on IF days. The window close is the compliance boundary people actually miss, usually not because they forgot but because they lost track of time. This job needs to check whether today is an IF day before deciding to run, which means it calls today first.

**End-of-day compliance.** Runs after the window closes (or at end of day for fast days). Computes whether the day was compliant. If there were violations, the output says what happened: "IF day, ate at 11:42, window opens at 13:00, 1 violation." Optionally writes the result to the compliance cache.

**Weekly summary.** Runs once a week. Compliance percentage, streak status, calorie averages by day type, comparison to the previous week.

One thing that's easy to get wrong: time zones. The schedule is defined in local time. Cron jobs need to run in local time. Feeding window boundaries are local time. If you travel, the system needs to know your current time zone, or your 13:00 window opens at the wrong hour. Store the time zone in config and use it in all timestamp computations. This is solvable but easy to forget until it breaks.

**Integration points**

All capabilities run as tools inside the same OpenClaw instance, so the agent can combine them in a single conversation turn without custom glue code.

**Meal and nutrition data.** The fasting system reads the same food entries that the nutrition tracker writes. When you log lunch, the fasting system immediately sees the timestamp and calorie count. One data source feeds both systems. This also means the fasting system knows the nutritional content of what you ate during the window, which matters when you're trying to hit protein targets in a compressed eating period.

**Weight and body composition.** Fasting compliance alongside weight trends shows whether the protocol is working. If compliance has been 90%+ for a month and weight is flat, the schedule might not be aggressive enough, or calorie caps need adjusting. The data shares a database, so the query is straightforward.

**Workout scheduling.** Training timing relative to the feeding window is something people care about. Fasted morning runs, fed afternoon lifting sessions, the effect of workout timing on performance — if workout data lives in the same system, the agent can surface correlations. Not because the fasting tool knows about workouts, but because both tools read from the same database and the agent can combine their outputs.

**Sleep data.** Late eating affects sleep onset. If sleep timestamps and food timestamps coexist in the same database, the system can surface patterns: "on days you ate after 20:00, sleep onset averaged 40 minutes later." This is a question the user asks, not a feature the fasting system ships with. It falls out of having the data in one place.

**Platform considerations**

Food entry data needs to reach the database from wherever you log meals. On iOS, Health Auto Export (or similar tools) pushes HealthKit data, including food entries with timestamps and calories, to a local server over HTTP. On Android, Health Connect serves the same role, bridgeable via Gadgetbridge or a custom exporter.

If you log meals conversationally (sending messages to your AI), those entries land in the database directly through the meal tracking tool. If you use a dedicated food tracking app, it syncs to HealthKit or Health Connect, which then feeds the pipeline.

The fasting system itself has no platform dependency. It reads timestamps and calories from a SQLite database. How those entries got there is the meal tracker's concern. OpenClaw runs on macOS, Linux, or any system with Node.js — a Mac Mini in your Bangkok apartment, a Raspberry Pi, a VPS, whatever you have.
{% /sectionCopy %}

{% sectionCopy eyebrow="development" title="Development: building the state engine and cron alerts" tone="subtle" %}
**How a coding agent builds this**

A coding agent builds this iteratively, starting from the computation core and extending outward. This is one sequence that works. Depending on whether you already have meal tracking in place, you might start at a different point.

- **Eating state function.** This is the foundation. Given a schedule definition and a set of food entries, compute the current fasting state: day type, fast duration, window status, on-track flag. Write this as a pure function first, taking a schedule object and an array of timestamped entries and returning a state object. No database dependency yet. This makes it trivially testable before you wire up persistence. The edge cases are where people get stuck: midnight boundaries, entries that span two calendar days, zero-calorie entries, time zones, the exact second the window opens or closes. Get the test coverage right before moving on. A coding agent can implement the function in an hour. Getting the edges right takes longer and matters more.

- **Schedule storage.** Persist the weekly schedule. If you use a database table, add the effective-from field from day one, even if you don't plan to change your schedule soon. Retrofitting versioned schedules onto a system that assumed a single static schedule is surprisingly painful. A config file works too, but you lose the ability to query historical schedules later.

- **Tests alongside code.** The eating state function needs an exhaustive test matrix. Day types x times of day x meal patterns x edge cases. What does "on track" mean at 23:59 on a fast day when you haven't eaten? What about at 00:01 when yesterday's last meal was at 23:50? Is an entry at exactly window close time inside or outside the window? These decisions are arbitrary, but they need to be consistent and documented. The test suite is the documentation. A coding agent works fast and introduces regressions fast, and the test suite is the only thing that catches them. Run it after every change.

- **CLI subcommands.** Wrap the computation in CLI subcommands: today, compliance, window, schedule, summary. Each returns JSON and has corresponding test coverage. Build today first because it exercises the core computation and is the most frequently called. Then compliance, which adds date-range queries and streak calculation. The rest follow naturally.

- **OpenClaw plugin.** Wrap the CLI in a plugin with typed parameters and an action enum. The plugin is a mechanical wrapper: validate inputs, call the CLI, return JSON. One thing specific to fasting: the today tool should work with zero arguments and always return current state. The agent shouldn't need to know the day type before it can ask what the day type is. A typed parameter schema also prevents the agent from calling nonexistent subcommands, which is better than a markdown instruction it might ignore.

- **Cron jobs.** Start with the morning check. Verify the full loop: cron triggers, CLI returns JSON, output arrives in your messaging channel. Then add the window close warning and the end-of-day compliance job. The weekly summary comes last. Don't set up four cron jobs at once, make sure one works end-to-end first.

- **Version control.** Git from the first commit. Commit after every working change. If a coding agent refactors the state computation and something breaks, git diff shows what changed. Debugging a coding agent's work without version control is archaeology.

**Best practices**

The practice that matters most for a fasting system, in our experience, is **exhaustive testing of the state computation**. The eating state function is a state machine with time-dependent behavior, and edge cases multiply faster than you'd expect. Day boundaries, time zones, whether the window boundary minute is inclusive or exclusive, what counts as breaking a fast (only caloric entries? any entry?), what happens when the last meal is from two days ago — all of these need explicit test cases and documented decisions. The test matrix is the single most important artifact in the codebase.

**Deterministic logic over LLM inference** applies strongly. Whether today is a fasting day is a table lookup. Whether you're within your feeding window is a time comparison. Whether you're compliant is a set of boolean checks. The temptation is to ask the model "is this person on track today?" but the answer depends on timestamp arithmetic that a model will get approximately right. Approximate compliance tracking over weeks and months undermines trust in the system. If the numbers aren't reliable, people stop checking.

**Versioned schedules** deserve upfront investment. The moment someone changes their protocol, every historical compliance query needs to know which schedule was active on which date. If you stored a single schedule and overwrote it, last month's compliance is now evaluated against this month's rules. The fix is simple (an effective-from date per schedule version) but annoying to retrofit.

**Embed guidance in CLI output.** The today subcommand is called both by cron jobs and by the agent in conversation. When the output includes context about the day type, relevant thresholds, and any active violations, the agent can present a natural summary without needing separate formatting instructions per day type.

See also: Best Practices for Private AI Systems for the full list.
{% /sectionCopy %}

{% sectionCopy eyebrow="models" title="Models" %}
Almost nothing in this system needs a language model. Day type lookup, feeding window computation, compliance checks, streak calculation, and trend aggregation are all deterministic code operating on timestamps and numbers. There's no ambiguity in whether 14:00 falls between 13:00 and 19:00.

The model handles the conversational layer: interpreting questions ("how's my fast going?", "what's my streak?"), rendering JSON as natural-language summaries, and processing schedule changes from freeform input ("move my window to 14:00-20:00" or "swap Friday and Monday"). If you're also doing AI-assisted food logging — typing "had a salad for lunch" rather than entering structured data — the model handles that parsing on the ingestion side, but that's a meal tracking concern rather than a fasting one.

For the coding agent that builds the system, you want strong code generation and comfort with a test-heavy iterative workflow. The eating state function and its test matrix will be the longest part of the build. See Choosing Models for Private AI Systems for guidance on model selection by task.
{% /sectionCopy %}

{% sectionCopy eyebrow="security" title="Security: local hardware, no new ingestion surfaces" tone="subtle" %}
The fasting system's security profile is straightforward because it mostly reads data already in your health database. It doesn't open new ingestion surfaces the way email monitoring or HTTP webhooks do. The attack surface is small by design.

**The primary external input is meal data from your phone's health app**, flowing through the same HTTP endpoint your other health data uses. That endpoint should already be authenticated with a shared secret in the request header and schema-validated, if you've set up a health data pipeline. The fasting system doesn't add a new endpoint. It reads entries that are already ingested.

**Schedule changes come through the agent conversationally.** Only you, or whoever has access to your messaging channel, can talk to the agent. This isn't an additional surface beyond the channel's own access controls. Restrict who can message the bot on platforms that support it.

**Compliance data** — your fasting history, streaks, daily records — is personal but less sensitive than bloodwork or medication records. Standard machine hygiene applies: disk encryption on the database, filesystem permissions on the SQLite file, encrypted backups if you push them offsite.

For a practice managing client fasting protocols, the sensitivity increases. Client compliance data is health information under most regulatory frameworks. Encrypt backups, restrict database access, and maintain audit logs. But for personal use on your own hardware, the risk profile is low. The data lives in a database with no network interface, accessible only through tools you've configured.

See also: Security Considerations for Private AI Systems for the full reference.
{% /sectionCopy %}

{% sectionCopy eyebrow="timeline" title="Timeline: from first status check to full cron coverage" %}
Start with the eating state function and the today subcommand. Define your schedule, point the system at your existing food entries, and ask "am I on track?" That alone is useful — a real-time fasting status that understands your specific protocol rather than a generic timer that doesn't know the difference between a fast day and an IF day.

Add compliance tracking after a week of use. Seven days of data makes a weekly compliance report meaningful. Streak tracking follows naturally from the compliance logic. Wrap the CLI in an OpenClaw plugin when you're ready for conversational access and scheduled checks.

Cron jobs are the high-value addition. The morning check, window close warning, and weekly summary turn the system from something you query into something that comes to you. Add these once the plugin works and you've verified the messaging delivery path end-to-end.

Integration with weight trends, workout timing, and sleep data is a later refinement. The data is already in the same database, so the queries are easy to write when you want them. There's no architectural work needed — it's just SQL across tables that already exist.
{% /sectionCopy %}

{% sectionCopy eyebrow="personal use" title="Personal use cases: patterns you can't see in a fasting timer app" tone="subtle" %}
Fasting is one of those things that's simple in concept and slippery in practice. You know what you're supposed to do. The hard part is knowing whether you're actually doing it, consistently, over weeks. These are the situations where having a real tracking system changes things.

You're doing an 18:6 protocol on weekdays and had a meal at 12:15 without thinking about it. The window doesn't open until 13:00. On its own, that 45-minute slip is barely worth noting. But the compliance report at the end of the week shows it happened three times. You weren't aware of the pattern. Your "18:6" has actually been a 17:5 most days, which is almost two hours less fasting per day than you intended.

A friend invites you to an early brunch on Saturday. You can't remember whether Saturday is a free day or an IF day. You message the bot: "what's today?" Free day, no restrictions. You go to brunch. The whole interaction took five seconds and replaced a mental negotiation that would have lasted through your first mimosa.

Six weeks into a mixed protocol — two fasting days, three IF days, two free days — you ask "how's my compliance this month?" Overall: 88%. You've nailed every fasting day, but three IF days were non-compliant, all on Fridays. The pattern is obvious once you see it: lunch plans keep pulling you out of the window early. You swap Friday to a free day and move an IF day to Monday. One message to the agent and the schedule updates.

Three months in, you want to know if the protocol is doing anything. You ask the OpenClaw agent to show your weight trend alongside your fasting compliance since you started. The data comes from the same database. Weight started dropping consistently about four weeks after you hit 90% weekly compliance. Before that, you were hovering around 70% and the trend was flat. You couldn't have seen this in a fasting timer app because fasting timer apps don't know what you weigh.

It's 18:30 on a Wednesday and you're making dinner. A message arrives: "feeding window closes in 30 minutes." You plate up instead of spending another 20 minutes on something elaborate. The reminder didn't change your behavior dramatically. It kept you from drifting past 19:00 the way you did last Wednesday and the Wednesday before.

You've been running Tuesday and Thursday mornings during your fast. Your performance seems fine, but you're curious. You ask the agent to compare fasted and fed workout data. It cross-references workout timestamps against your feeding schedule: pace is similar, but heart rate averages about 5 BPM higher on fasted runs. Not something you'd act on. Just interesting — and not something any single app could have told you, because no single app has both the fasting schedule and the workout data.
{% /sectionCopy %}

{% sectionCopy eyebrow="business use" title="Business use cases: clinics, coaches, and research on objective compliance" %}
Fasting programs show up in clinical, coaching, and wellness contexts where someone needs to know whether participants are actually following the protocol. That tracking is usually self-reported, which makes it unreliable, or not tracked at all.

A weight management clinic in Bangkok prescribes intermittent fasting as part of a structured program. Patients visit monthly, and the dietitian asks how the fasting is going. "Pretty well, mostly" could mean anything. With this system, the clinic has real compliance data: days hit, days missed, feeding window violations, calorie totals during eating periods. Before each appointment, the dietitian reviews actual numbers and has a specific conversation — "you've been solid on your fasting days but your IF days show late eating three times a week, let's talk about the evening routine" — instead of working from a patient's hazy self-assessment.

A health coaching practice manages 50 clients on different protocols. Some do 16:8, some 18:6, some alternate-day fasting. Today, compliance tracking means a shared spreadsheet that clients update manually, and maybe a third of them keep up with it. The system automates tracking through each client's meal data and generates weekly summaries. The coach sees all clients sorted by compliance and focuses attention on the ones who are struggling, identified by data rather than by who remembered to fill in the spreadsheet.

A functional medicine practice runs a 12-week reset program with progressive fasting. Weeks 1-4 are 14:10. Weeks 5-8 are 16:8. Weeks 9-12 are 18:6. The schedule changes need to land on the right dates for each participant, and compliance needs to be evaluated against the protocol that was active at the time, not the current one. Versioned schedules handle this: the system knows that a participant was on 14:10 in week 3 and 16:8 in week 6, and evaluates each week against the correct rules. The practitioner sees a compliance arc over the full 12 weeks showing how the patient adapted as the protocol tightened.

A clinical research group studies time-restricted eating and inflammatory markers over 16 weeks. The protocol requires 18:6 fasting. Compliance is a critical variable — if participants aren't actually fasting, the biomarker data is meaningless, and the study's conclusions are built on sand. The system provides objective, timestamp-based compliance for each participant, exportable as structured data. Researchers can filter by adherence threshold ("only participants above 85%") and correlate fasting compliance with biomarker changes. The compliance numbers come from meal timestamps, not from a questionnaire filled out from memory at the end of each week.

A corporate wellness program offers a 30-day fasting challenge. Employees opt in, choose a protocol, and the system tracks compliance automatically. The coordinator sees aggregate statistics — participation rate, average compliance, most popular protocol — without accessing individual meal data. Opt-in leaderboards show streak leaders. The thing that makes this work where previous challenges didn't is that tracking is automatic. Nobody fills out a form. Nobody self-reports. Compliance numbers come from meal timestamps, so they're real, and that changes the dynamic of the whole program.

{% linkItem href="/services" label="Our services" summary="See how we build private health AI systems for clinics, coaches, and individuals." /%}
{% linkItem href="/how-it-works" label="How it works" summary="Learn about our development process and what a typical engagement looks like." /%}
{% /sectionCopy %}

{% cta title="Ready to build your fasting protocol system?" body="We help clinics, coaches, and individuals build private AI systems for fasting compliance, nutrition tracking, and health monitoring — on your own hardware, with your own data." actionHref="/contact" actionLabel="Book a consultation" /%}
