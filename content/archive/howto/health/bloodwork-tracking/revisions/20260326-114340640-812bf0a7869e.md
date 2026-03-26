---
template: guide
slug: /howto/health/bloodwork-tracking
page_id: howto-health-bloodwork-tracking
title: "How to Build: Bloodwork Tracking & Analysis"
description: "Build a private bloodwork tracking system that ingests lab reports, tracks biomarker trends, flags out-of-range values, and automates retest scheduling."
---

{% hero eyebrow="guide" title="How to Build: Bloodwork Tracking & Analysis" deck="Ingest lab reports, track biomarker trends over time, flag out-of-range values against personal targets, and automate retest scheduling. All data stays on your hardware." actionHref="/contact" actionLabel="book a consultation" /%}

{% sectionCopy eyebrow="overview" title="What It Is" %}
A private system that stores your complete bloodwork history in a local database. It tracks every marker over time, compares results against both standard lab reference ranges and your personal target ranges, detects trends across draws, and manages a retest schedule with due-date alerts. Your AI agent interprets new results in the context of your full history, not a single snapshot.

The agent monitors your markers, tells you when something changes, and reminds you when it's time to retest. Results come to you through whatever messaging channel you use, not through a portal you have to remember to check.

You could build this a hundred different ways. What follows is one approach that works, is straightforward to understand, and comes from a system that's been running in production on real bloodwork data.
{% /sectionCopy %}

{% sectionCopy eyebrow="usage" title="How You Use It" tone="subtle" %}
You get bloodwork done at a lab. The results reach your system however is easiest for you. Forward the lab's email to your AI. Have the lab email your AI directly. Photograph the paper report and send the picture to your bot on Telegram. Screenshot the patient portal and drop it in a chat. Save the PDF to a Dropbox folder that the system watches. Paste the values in a message. It doesn't matter. The data gets in, the system handles the rest.

The lowest-friction path is usually email. Most labs already email you a PDF. Set up a forwarding rule so anything from your lab's domain goes straight to your AI's inbox, or just give the lab the bot's email address directly. One-time setup, then every future result flows in automatically.

Once the data is in, everything is automatic. A daily check looks at which markers are due for retesting and sends you a reminder. A weekly check runs a flags report and tells you if anything needs attention. These run on your hardware, on your schedule, with no cloud service involved.

You can also just ask things conversationally: "how's my vitamin D trending?", "show me my thyroid history", "what's due for retesting?", "compare my January and March panels." The agent queries your database and answers in plain language. No predefined dashboards, no export step.

If you want to adjust your targets ("my endocrinologist wants TSH between 1.0 and 2.0"), you just tell the agent. It updates the target and uses the new threshold going forward.
{% /sectionCopy %}

{% sectionCopy eyebrow="architecture" title="Architecture" %}
The stack described here is Node.js, SQLite, and a CLI that the AI agent calls as a tool. If you prefer Python and Postgres, or Go and DuckDB, the same ideas apply. The important parts are the data model and the separation between deterministic logic and AI interpretation, not the specific tools.

**Ingestion**

Reports are ingested as structured JSON through a CLI tool. The schema includes a report_type (such as "bloodwork"), a report_date, an optional source_name for the lab, and an array of results. Each result contains a marker name, a numeric value, a unit, and the lab's reference range as ref_low and ref_high. For example, an ingested report might include LDL Cholesterol at 142 mg/dL with a reference range of 0 to 100, and TSH at 2.4 mIU/L with a reference range of 0.4 to 4.0.

The question is how the JSON gets produced. Three paths, from most automated to most hands-on:

- **Email ingestion** is the most hands-off path. Your OpenClaw instance monitors an email inbox via IMAP. When a message arrives from a known lab sender, the agent downloads the PDF attachment, extracts the marker table, and produces the JSON payload. You can set this up as a forwarding rule from your personal email, or give the lab a dedicated address directly. The extraction can be deterministic (a PDF parser for that lab's format) or AI-assisted (the agent reads the PDF and pulls values). Either way, the result is validated against the schema before ingestion. A note on email security: your agent reads and processes email content, which means the email body enters the agent's context. For lab results from known senders, this is fine. Filtering by sender domain and only processing attachments keeps the surface small.

- **Image and message transcription** lets you photograph a paper report or screenshot a patient portal and send it through any connected messaging channel (Telegram, Signal, Discord). The agent reads the image, identifies the marker table, extracts values, and validates them against the expected schema before ingesting. Works well for clean, tabular lab reports. For handwritten or poorly formatted documents, the agent flags uncertain extractions for your confirmation rather than guessing.

- **Deterministic PDF parser** is for labs you use repeatedly. A coding agent writes a one-time parser script for that lab's PDF format. The parser extracts text, identifies the marker table, and outputs JSON. Once written, it handles every future report from that lab without AI involvement. This is the most reliable path for recurring labs.

On ingestion, the CLI canonicalizes marker names, infers categories, resolves reference ranges, inserts the report and results in a single transaction, and returns a summary of what was inserted. Same-day disambiguation is handled: if you get bloodwork at Lab A in the morning and Lab B in the afternoon, a report_number field differentiates them.

**Marker Canonicalization**

Lab reports use inconsistent naming. "LDL-C", "LDL Cholesterol", "LDL (Direct)" all mean the same marker. The ingestion layer normalizes these through a static lookup table of known aliases mapping to canonical snake_case names (ldl_cholesterol, hba1c, free_testosterone, and so on). Same for categories: the system infers category from marker name if the report doesn't provide one, using a hardcoded map (testosterone maps to hormone, alt maps to liver, tsh maps to thyroid).

This canonicalization is deterministic code, not LLM inference. You don't want a language model deciding whether "LDL-C" and "LDL Cholesterol" are the same marker. A static alias table is correct every time, testable, and doesn't depend on prompt quality or model version. The table grows over time as you encounter new labs with different naming conventions.

**Storage**

SQLite is the simplest starting point: no server process, single file on disk, easy to back up. Any relational database works here (Postgres, MySQL, DuckDB), but the point is structured data in a real database so you get queries, indexes, unique constraints, foreign keys, and transactions.

Three tables is enough to start. The first, health_reports, stores one row per lab visit with fields for report_date, report_type (bloodwork, dxa, cardiac), report_subtype, source_name, location, report_number, and source_file. A unique constraint on report_date and report_type prevents duplicates, with report_number for same-day disambiguation.

The second table, health_results, stores one row per marker per report, foreign-keyed to health_reports. Fields include marker (canonical snake_case), display_name, value (numeric), value_text (for non-numeric results like "negative"), unit, flag (high/low/critical from the lab), ref_low and ref_high (lab reference range), and category.

The third table, health_targets, stores one row per marker you're personally tracking. Fields include target_low and target_high (your optimal range, separate from the lab's reference range), default_cadence_days (retest frequency), next_due (auto-advanced after each ingestion), and notes.

The database file lives on your local disk with no network exposure. Access control is filesystem permissions. If the machine has disk encryption enabled, the data is encrypted at rest automatically.

**Analysis and CLI Surface**

The system is CLI-first. Every operation is a subcommand that returns structured JSON. JSON output makes the CLI testable (pipe to jq, assert on fields), composable (chain subcommands in scripts), and trivially wrappable as an agent plugin. The CLI doesn't produce conversational text. The agent handles natural language; the CLI handles data.

Key subcommands include: report-add for ingesting a new report, which returns inserted counts and a next_step field telling the agent what to do next; latest for current values across all markers with flags against both lab ranges and personal targets; marker for a longitudinal view of a single marker across all draws; category for all markers in a group (like the full lipid panel); flags for everything out of personal target range ordered by severity; trend for direction computed from the last several draws per marker; report for full report view or side-by-side comparison of two draws; review for a specific report with each marker's value, target, trend, and active medications that could affect it; targets for listing all personal targets; and due-soon for markers approaching their retest date.

**Target Management and Retest Scheduling**

Personal targets are distinct from lab reference ranges. Your lab says LDL under 100 is "normal." Your cardiologist says get it under 70. The target table holds the cardiologist's number.

Each target has a default_cadence_days and next_due. When a new report is ingested containing that marker, next_due advances by the cadence from the report date. A cron job runs due-soon on a daily schedule and delivers upcoming or overdue retests through whichever messaging channel you use. The due-soon subcommand returns JSON; it doesn't send messages. The agent framework handles scheduling and delivery.

**Integration Points**

Because all capabilities run as tools inside the same agent instance, the agent can call multiple tools in a single conversation turn without custom glue code. This is where bloodwork tracking stops being an isolated database and starts being part of a complete health picture.

Medication correlation is automatic. You started atorvastatin in March. Your June draw shows LDL dropped 40%. The review context surfaces that connection because the medication tracker and bloodwork tracker share the same database. The agent sees the start date, sees the marker change, and presents them together.

Automated email ingestion means your lab emails you a PDF, the email tool picks it up, runs it through the ingestion pipeline, and messages you with a summary. Calendar and reminders integration means retest due dates become calendar events. Unified health view means bloodwork markers live alongside sleep, weight, activity, body composition, and nutrition data in the same database.

**Platform Considerations**

Bloodwork ingestion doesn't depend on a phone health data pipeline. Reports come in as structured JSON through the CLI regardless of platform.

If you want to integrate bloodwork alongside other health metrics, you'll need a data bridge from your phone's health store. On iOS, Health Auto Export (HAE) pushes HealthKit data as JSON over HTTP to a local server behind a tunnel. On Android, Health Connect is the equivalent, bridged via Gadgetbridge or a custom exporter.

The server and CLI run on your hardware: a Mac Mini, a Raspberry Pi, a NUC, a VPS, whatever you have. The phone pushes data to the server; the agent orchestrates everything else.
{% /sectionCopy %}

{% sectionCopy eyebrow="development" title="Development" tone="subtle" %}
**How a Coding Agent Builds This**

A coding agent (Claude Code, Codex, or whatever you prefer) builds the system through iterative prompting. This is one sequence that works well.

- **Schema and CLI skeleton.** The coding agent scaffolds the SQLite tables, indexes, constraints, and a CLI entry point with stub subcommands. Start with just report-add and latest. Get data in, get data out. Resist the urge to design all the subcommands upfront.

- **Tests alongside code.** A coding agent works fast, and it introduces regressions fast. The test suite is the only thing that catches them. Write tests for every subcommand as you build it: known inputs, expected JSON outputs, run against a temp database that's created and destroyed per test. After every change, the suite runs.

- **Read commands.** Add marker, category, flags, trend, report, review, targets, due-soon one at a time. Each returns structured JSON and has corresponding test coverage. Build the ones you'll use first.

- **Agent plugin.** Wrap the CLI in a plugin. The plugin defines each tool with a name, description, and typed parameter schema. It calls the CLI underneath and returns the JSON output. This is the step where the tool becomes conversational. The plugin is a small, mechanical wrapper. Don't put business logic in the plugin.

- **Email integration.** Configure the email tool to monitor the inbox. Write sender-based filtering rules. This is worth prioritizing early if your lab already sends results electronically.

- **Cron jobs.** Set up scheduled checks: a daily due-soon that surfaces retests, an email check that processes new lab results, and optionally a weekly flags summary. Start with one job and make sure the delivery path works end-to-end before adding more.

- **Version control.** Git from the first commit, not after things are "ready." Commit after every working change.

- **PDF parsers.** When you settle on a lab you use regularly, the coding agent writes a deterministic parser for that lab's PDF format. Don't bother writing parsers speculatively.

**Best Practices**

The practice that matters most is deterministic logic over LLM inference. Your health data pipeline cannot be probabilistic. Marker canonicalization, trend detection, threshold comparison, and flag generation are all deterministic code. The agent's role is interpreting and presenting, not calculating.

Right behind that: structured data in a real database. Bloodwork accumulates over years. You will want to query it in ways you can't predict today. A SQLite database with proper indexes handles these queries instantly. A pile of JSON files or a spreadsheet does not.

Embed guidance in CLI output. After report-add, the output includes a next_step field. After report-review, each marker includes a set_due_command. The agent follows the chain without needing workflow instructions in a system prompt.

Plugin wrapper over raw CLI. The plugin defines a schema with an action enum of valid operations. The agent can't call a nonexistent subcommand because the schema won't validate it.

Backups for irreplaceable state. Your code is in git, but your bloodwork data is not. A scheduled backup job dumps the SQLite file, compresses it, and pushes to a backup repo or offsite storage. A nightly dump to a private git repo is a fine starting point.

See also: [Best Practices for Private AI Systems](/prompts/best-practices.md) for the full list.
{% /sectionCopy %}

{% sectionCopy eyebrow="security" title="Security" %}
Bloodwork data is sensitive. The good news: in this architecture, it never leaves your hardware unless you explicitly send it somewhere. There's no cloud vendor with a copy of your labs. But you still have attack surfaces worth understanding.

Email ingestion is the biggest one. If your agent monitors an inbox, every email it reads enters the agent's context. A malicious email could contain hidden instructions (prompt injection) attempting to get the agent to take actions you didn't intend. The practical mitigation: filter by sender. Only process emails from your lab's domain or your own forwarding address. Process attachments (the structured PDF), not freeform email bodies. For unknown senders, extract and present the data but don't act on it until you confirm.

Image and message ingestion have the same surface on a smaller scale. If your bot is in a group chat, anyone in the group can send it content. Restrict access to who can message the bot if you're on a platform that supports it.

The data tunnel (if you're receiving phone health data via HTTP) needs a shared secret in the request header. The server rejects requests without it. Cloudflare Tunnel and Tailscale Funnel handle HTTPS automatically.

Local data is protected by whatever disk encryption your OS provides. SQLite files aren't network-accessible. Backups pushed offsite should be encrypted or in a private repo with access controls.

The overall risk profile here is low. Your data lives on your machine, your database has no network interface, and your agent only talks to services you've configured. The main thing to be intentional about is the email and messaging inbound path, because that's where the outside world can put text in front of your agent.

See also: [Security Considerations for Private AI Systems](/prompts/security.md) for the full reference.
{% /sectionCopy %}

{% sectionCopy eyebrow="models" title="Models" tone="subtle" %}
Most of this system is deterministic code: canonicalization, trend detection, threshold comparison, flag generation, schema validation. None of that needs a language model. The model handles the conversational layer (interpreting your questions, rendering responses in natural language), ingestion extraction (reading PDFs, parsing images of lab reports), and summarization (review context, appointment prep).

For ingestion extraction, you want a model with strong vision and structured output. For conversation, almost anything recent works. The coding agent that builds the system itself has different requirements (strong code generation, long context for iterating on a codebase). These don't have to be the same model.

See [Choosing Models for Private AI Systems](/guides/model-selection) for the full breakdown of local vs API, hardware requirements, and cost modeling.
{% /sectionCopy %}

{% sectionCopy eyebrow="getting started" title="Timeline" %}
Start with the minimum useful version: a CLI that can ingest a JSON report and show you the latest values. That's report-add and latest. Get your first real lab report into the system and query it. This alone is useful: you have structured, queryable bloodwork data instead of a PDF in a drawer.

Then extend based on what you actually need: trend tracking after your second draw, personal targets once you've talked to your doctor about optimal ranges, retest scheduling once you have enough markers to lose track of. Wrap the CLI in a plugin when you're ready for conversational access and automated scheduling.

Email ingestion, PDF parsers, medication correlation, and calendar integration are refinements you add after the core loop is solid. Email is worth prioritizing early if your lab already sends results electronically, since it removes the manual step entirely. Don't try to build the whole system before ingesting your first report.
{% /sectionCopy %}

{% sectionCopy eyebrow="personal" title="Personal Use Cases" tone="subtle" %}
Most people's bloodwork history is a stack of PDFs they never look at again. These are the situations where having it in a real system changes what you know about your own health.

- Your LDL has been climbing for three draws but you didn't notice because each PDF went in a drawer. With this system, the trend is visible the moment the third result lands. The agent tells you: LDL is rising, three consecutive draws, up 30% from baseline. You catch it before your doctor does.

- You get bloodwork at two different labs: a comprehensive panel at your primary doctor every six months, and a hormone panel at an endocrinologist between visits. Both feed into the same database. When you ask "how's my testosterone trending?", the answer includes every draw from every source, not just the last lab you happened to visit.

- Six months after your last thyroid panel, a message arrives: TSH and free T4 recheck due next week. The 180-day cadence was set automatically when the last draw was ingested.

- Your doctor put you on vitamin D supplementation three months ago because you were at 18 ng/mL. Your next draw comes in and the agent shows you: vitamin D is up to 42, ferritin is stable, B12 ticked up slightly. The supplement correlation is automatic because the medication tracker and bloodwork tracker share the same database.

- Before your next appointment, you ask the agent to compare your January and June panels. It shows you what moved, by how much, in which direction. You follow up: "which of these are outside my targets?" Then: "what changed since I started the new medication?" Each answer pulls from the same database, same history, no exports or portal logins.

- Your lab emails you results on a Thursday afternoon. By the time you check your phone, the agent has already ingested the report, flagged two markers outside your personal target range, and told you what to discuss with your doctor.
{% /sectionCopy %}

{% sectionCopy eyebrow="business" title="Business Use Cases" %}
Any practice that orders bloodwork regularly is doing some version of this by hand: reviewing PDFs, tracking trends in spreadsheets, reminding patients to come back. The system replaces the manual parts.

- A concierge medicine practice manages 200 patients, each with quarterly bloodwork. Today, results arrive as PDFs that a nurse manually reviews and files. With this system, results flow in automatically and each patient's trends are tracked against their individual targets. The doctor gets a flagged summary before each visit.

- A wellness clinic runs comprehensive panels for new clients, then follow-ups at 90 and 180 days. This system gives each client a private, queryable history accessible through the clinic's messaging channel. The client asks "how are my inflammatory markers?" and gets a real answer drawn from their actual data.

- A sports team's medical staff tracks bloodwork for 30 athletes across a season. They need to catch ferritin drops before they become performance problems, monitor hematocrit for altitude camp planning, and flag anything unusual. The system runs weekly checks against per-athlete targets and alerts the team doctor when something needs attention.

- A functional medicine practitioner coordinates care across multiple labs. This system normalizes marker names across labs and presents a unified timeline. During a consultation, the practitioner asks "show me everything we have on this patient's hormones" and gets results from all three labs on one screen, sorted chronologically.

- A clinical research group tracks biomarker panels for study participants over 12 months. They need structured, exportable data with consistent naming. The system's canonical marker names and SQLite storage mean they can query across all participants and export clean datasets for analysis without a data cleaning step.

{% linkItem href="/services" label="Our services" summary="See how we build private health tracking systems for individuals and practices." /%}
{% linkItem href="/how-it-works" label="How it works" summary="Learn about our process for building custom AI systems on your hardware." /%}
{% /sectionCopy %}

{% cta title="Ready to build your bloodwork tracking system?" body="We help individuals and practices build private, AI-powered health data systems that run entirely on your own hardware." actionHref="/contact" actionLabel="Book a consultation" /%}
