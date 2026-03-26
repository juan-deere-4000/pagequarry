---
template: guide
slug: /howto/health/body-composition
page_id: howto-health-body-composition
title: "How to Build: DEXA Body Composition Tracking with a Private AI System"
description: "Build a private AI system that ingests DEXA scan reports, tracks lean mass, fat mass, and bone density over time on your own hardware."
---

{% hero eyebrow="guide" title="How to Build: DEXA Body Composition Tracking with a Private AI System" deck="Build a private AI system that ingests DEXA scan reports, tracks lean mass, fat mass, and bone density over time. All data stays on your own hardware." actionHref="/contact" actionLabel="book a consultation" /%}

{% sectionCopy eyebrow="overview" title="What It Is: A Private DXA Scan Database with Longitudinal Tracking" %}
A private system that stores your complete DXA scan history in a local database. Each scan produces a rich dataset: total body fat percentage, lean mass and fat mass by region (arms, legs, trunk), bone mineral density at multiple sites, visceral fat estimates, and derived indices like appendicular lean mass. The system tracks all of these over time, compares scan to scan, flags significant changes, and reminds you when it's time for your next scan.

DXA scans are the most precise way to measure body composition, but most people get a multi-page report, glance at the body fat number, and file it away. The regional breakdowns, bone density T-scores, and visceral fat data go unread. Trends across scans go unnoticed because nobody is comparing old PDFs to new ones. This system makes the full dataset queryable and tracks everything longitudinally, so the picture gets clearer with every scan instead of resetting each time.

You could build this many different ways. What follows is one approach that works, comes from a system that's been running on real scan data, and shares its storage and reporting layer with a broader health tracking stack.
{% /sectionCopy %}

{% sectionCopy eyebrow="usage" title="How You Use It: Ingesting Scans and Asking Questions" tone="subtle" %}
You get a DXA scan at a clinic or imaging center. The report finds its way into the system however is easiest for you. Photograph the printout and send it to your bot on Telegram. Save the PDF from the clinic's patient portal to a Dropbox folder the system watches. Forward the email to your AI's address. Or just message the bot with the highlights: "scan came back, 17.4% body fat, 64.2 kg lean mass." It doesn't matter which path. The data gets in.

Most DXA clinics hand you a printed report or make a PDF available through a portal. Photographing the printout is usually the fastest path for a one-off scan. If your clinic emails reports, setting up a forwarding rule means every future scan flows in without any effort on your part.

Once the data is in, the system compares it to your previous scans automatically. If you've gained lean mass or lost fat since last time, it tells you. If your bone density has shifted, it tells you. If your visceral fat went from moderate to elevated, it tells you. OpenClaw runs a scheduled check against your next-due date and messages you through whatever channel you use. These checks run on your hardware, on your schedule.

You can ask things conversationally too. "How has my lean mass changed this year?" "What's my bone density trend?" "Compare my last two scans." "Am I gaining fat in my trunk or everywhere?" The agent queries your database and answers directly. No dashboards, no portal logins. The data is in your database on your machine, and you can ask whatever you want about it.
{% /sectionCopy %}

{% sectionCopy eyebrow="architecture" title="System Architecture: SQLite, CLI, and OpenClaw Plugin" %}
This system shares the same storage and reporting layer as the bloodwork tracker described in the [bloodwork tracking guide](/howto/health/bloodwork-tracking). If you've already built that, the body composition system is an extension, not a separate build. If you're starting here, the architecture stands on its own. The stack is Node.js, SQLite, and a CLI that the AI agent calls as a tool, but the same patterns work with Python, Go, or whatever you prefer.

**Ingestion**

DXA reports are ingested as structured JSON through the same CLI tool that handles bloodwork and cardiac reports. The report_type field distinguishes them. A DXA report includes fields like report_type ("dxa"), report_date, source_name (the imaging center), and a results array. Each result has a marker name (such as total_body_fat_pct or lumbar_spine_bmd), a numeric value, a unit, and a category (such as body_composition_total, adiposity, or bone_density_spine). A typical scan produces markers for total body fat percentage, total lean mass, total fat mass, visceral fat area, regional lean and fat mass for each limb and trunk, lumbar spine BMD and T-score, and derived indices like ALMI.

How the JSON gets produced depends on the source. Three paths, roughly ordered by automation level:

**Photo or screenshot via messaging.** You photograph the DXA printout and send it to the bot through Telegram, Signal, Discord, or whatever channel you use. The agent reads the image, identifies the data tables (total body composition, regional breakdown, bone density), extracts the values, and validates them against the expected schema. DXA reports tend to be tabular and consistent across clinics, which makes extraction reliable. For a scan with unusual formatting or a handwritten annotation, the agent flags uncertain values and asks you to confirm rather than guessing.

**Email or PDF.** If the clinic emails you a report or you download one from their portal, the PDF reaches the system through a forwarding rule, a watched folder, or a direct email to your bot's address. The agent extracts the tables from the PDF using either a deterministic parser (for clinics you visit repeatedly) or AI-assisted extraction. For a clinic you use once, AI extraction handles it. For your regular clinic, a coding agent can write a one-time parser for that specific PDF layout, which then handles every future report without AI involvement.

**Conversational entry.** You message the bot directly with the numbers: "DXA today, 16.8% body fat, 65.1 kg lean mass, visceral fat 58 cm2." The agent parses the message, structures the data, and ingests it. This works well for partial results or quick updates, especially if you want to log a subset of the scan data without waiting for the full report.

When a DXA report comes in through any of these paths, the agent should present the extracted values for you to review before committing them to the database. A misread decimal on a bone density T-score matters. This confirmation step is worth the small friction.

**Data Model**

The storage layer uses the same three-table structure as bloodwork: reports, results, and targets. If you already have a bloodwork database, DXA data fits into the same tables with report_type "dxa" distinguishing them. SQLite via better-sqlite3 (Node) or sqlite3 (Python). The same reasons apply here: queries, indexes, unique constraints, foreign keys, transactions. A pile of scan PDFs in a folder gives you none of that.

The reports table holds one row per scan visit, with fields including report_date, report_type ("dxa"), source_name (the imaging center), and source_file. Unique on report_date plus report_type.

The results table holds one row per marker per scan, foreign-keyed to reports. This is where the richness of DXA data lives. Categories organize the markers: body_composition_total (total body fat percentage, total lean mass, total fat mass, android/gynoid ratio), body_composition_regional (lean and fat mass for left arm, right arm, left leg, right leg, trunk, which is where symmetry analysis comes from), body_composition_index (derived values like lean mass index, fat mass index, and appendicular lean mass index, which normalize for height and are more useful for comparison than raw mass), adiposity (visceral fat area or volume), bone_density_spine (lumbar spine BMD, T-score, Z-score), bone_density_hip (femoral neck and total hip BMD, T-score, Z-score), bone_density_forearm (one-third radius BMD and scores, if scanned), and fracture_risk (FRAX scores if the clinic provides them).

Each marker has a canonical snake_case name, a display name, a value, a unit, and its category. The marker name is the stable key for longitudinal tracking.

The targets table holds your personal thresholds. Your target body fat might be 15%. Your bone density T-score should stay above -1.0. The default scan cadence might be 180 days. These are separate from any reference ranges printed on the report.

WAL mode for concurrent reads. Foreign keys enforced. Indexes on marker, category, and report date.

**Canonicalization**

DXA reports vary in how they label things. One clinic prints "L-Spine BMD" and another prints "Lumbar Spine Bone Mineral Density." Regional breakdowns might say "Left Arm Lean" or "L. Arm Lean Mass" or "Lean (Left Upper Extremity)." The ingestion layer normalizes these through a static alias table mapping to canonical names like lumbar_spine_bmd, left_arm_lean, total_body_fat_pct.

This is deterministic code, not LLM inference. You don't want a language model deciding whether "L-Spine BMD" and "Lumbar BMD" are the same marker. A lookup table is correct every time, testable, and grows as you encounter new clinics with different naming conventions.

Categories are inferred from the canonical marker name using a hardcoded map. If the marker starts with lumbar_spine, the category is bone_density_spine. If it's left_arm_lean or right_leg_fat, it's body_composition_regional. The agent never has to classify these.

**Analysis and CLI Surface**

The CLI is the same tool used for bloodwork, extended with DXA-relevant views. Every subcommand returns structured JSON. The agent renders natural language responses from that JSON. The CLI doesn't produce conversational text.

Subcommands relevant to body composition: report-add ingests a DXA report and returns inserted counts and a summary per marker, including a next_step field pointing to the review command so the agent follows the chain without needing to remember the workflow. latest shows current values for all DXA markers from the most recent scan, with flags against personal targets. marker provides a longitudinal view of a single marker across all scans, useful for tracking body fat percentage or a specific bone density site over time. category returns all markers in a category: pulling body_composition_regional returns the full regional breakdown from the latest scan, while pulling bone_density_hip returns hip BMD, T-score, and Z-score together. flags shows markers outside personal target range, ordered by severity. trend computes direction from the last 2-3 scans per marker using simple linear comparison: rising, falling, stable. report shows a full scan view, or side-by-side comparison of two scans with deltas for every marker. review shows each marker with its value, personal target, trend, and any active medications or interventions that might affect it.

The comparison view is probably the most used surface for body composition. DXA scans happen infrequently enough that the delta between scans is what people care about most. Gained 1.2 kg lean mass, lost 0.8 kg fat mass, trunk lean up, visceral fat down, bone density stable. That's the conversation people want after a scan.

**Scheduling and Alerts**

Personal targets hold a default_cadence_days and next_due date. When a new scan is ingested, the due date advances by the cadence from the scan date. A daily cron job checks due-soon and sends a reminder through your messaging channel when the next scan is approaching.

The due-soon subcommand returns JSON listing what's overdue or coming up. It doesn't send messages. OpenClaw's cron runs it on schedule, and OpenClaw's messaging delivers the result. The tool doesn't know about Telegram or Signal. If you switch channels, nothing changes in the CLI.

Beyond scheduling, a scan-ingestion cron can run a quick flags check after a new report lands and send a summary of what changed. "Your September scan is in. Body fat down 1.1%, lean mass up 0.8 kg, lumbar spine T-score stable at 0.6. Visceral fat dropped from 72 to 58 cm2." This runs automatically once the data is in the database, without the agent needing to be prompted.

**Integration Points**

All capabilities run as tools inside the same OpenClaw instance. The agent combines them in a single conversation turn without custom glue code.

Training correlation: you've been following a strength program for six months. Your DXA scan shows lean mass up 2.4 kg. The agent surfaces this alongside your training volume from the same period because the workout tracker and body composition tracker share the same database. If your leg lean mass increased disproportionately during a squat-focused block, the connection is visible without anyone manually correlating spreadsheets.

Nutrition context: body fat changes don't happen in isolation. The agent can reference your average caloric intake, protein intake, and fasting compliance over the period between scans. If you lost fat mass during a period of consistent caloric deficit and high protein intake, the data tells that story. If you gained fat during a period of frequent free days and low protein, it tells that story too.

Bloodwork linkage: some bloodwork markers are directly relevant to body composition. Testosterone and growth hormone affect lean mass accrual. Vitamin D and calcium relate to bone density. The agent can pull both domains when reviewing a scan: here's your body composition change, and here are the hormonal and micronutrient markers from the same period.

Calendar: when the agent ingests a scan and advances your next-due date, it can create a calendar event for the upcoming scan. Six months from now, "DXA scan due" appears on your calendar without you putting it there.

**Platform Considerations**

DXA reports reach the system as structured JSON through the CLI, independent of any phone health data pipeline. The ingestion paths (photo, email, PDF, messaging) work on any platform.

If you want body composition data alongside other health metrics (sleep, activity, heart rate, weight), you need a data bridge from your phone's health store. On iOS, Health Auto Export pushes HealthKit data to a local server behind a tunnel. On Android, Health Connect with Gadgetbridge or a custom exporter does the equivalent. OpenClaw runs on macOS, Linux, or any system with Node.js: a Mac Mini in a Bangkok apartment, a home server, or a remote VPS. The server and CLI run on your hardware.

Some body composition scales and smart scales push data via their own apps. If that app can export to HealthKit or Health Connect, the data flows into your database through the same pipeline. These are less precise than DXA but useful for tracking trends between scans.
{% /sectionCopy %}

{% sectionCopy eyebrow="implementation" title="Building the System: CLI, OpenClaw Plugin, and Cron Jobs" tone="subtle" %}
**How a Coding Agent Builds This**

If you've already built the bloodwork tracking system from the [bloodwork guide](/howto/health/bloodwork-tracking), much of this is already done. The same database, CLI, plugin, and cron infrastructure handles DXA reports. The work is extending the schema for DXA-specific categories, adding marker aliases for body composition terminology, and potentially writing a DXA PDF parser. If you're starting fresh, the build sequence below covers the full system.

Schema and core logic: a coding agent scaffolds the SQLite tables (or extends them if they already exist). The key design decision here is the category taxonomy. Bloodwork has categories like "lipid" and "thyroid." Body composition needs categories like body_composition_regional, bone_density_spine, adiposity, and body_composition_index. Getting the categories right early matters because they drive how the CLI groups data for display. Start with the categories listed in the data model section above. You can always add more, but renaming categories after data is in the database is annoying.

Marker alias table: DXA terminology varies across clinics more than you'd expect. Build the alias table alongside the schema, not as an afterthought. Start with a reasonable set of aliases for common markers (body fat percentage, lean mass, BMD by site, visceral fat) and expand as you encounter new report formats. This is deterministic code: a static map from variant names to canonical keys. Keep it in the codebase, not in the database, so it's versioned and testable.

Tests from the start: write tests for ingestion, canonicalization, and the comparison logic as you build each piece. A coding agent works fast and breaks things fast. For body composition specifically, test the regional symmetry comparison (left arm vs right arm lean mass should produce a meaningful delta, not crash on missing regional data), the bone density threshold classification (T-score above -1.0 is normal, -1.0 to -2.5 is osteopenia, below -2.5 is osteoporosis), and the scan-to-scan delta calculation. Use a temp database per test that's created and destroyed each run.

CLI subcommands: if you're extending an existing CLI, the subcommands already exist. You're adding DXA-specific category names and possibly a dedicated comparison view. If building fresh, implement report-add and latest first. Get one real scan into the database and query it. The rest (marker, category, flags, trend, report, review, targets, due-soon) follow the same pattern as bloodwork and build out incrementally. Each subcommand returns JSON. No conversational output.

OpenClaw plugin: wrap the CLI in an OpenClaw plugin with typed parameter schemas. The plugin defines each tool with a name, description, and parameter validation. The agent can't call a nonexistent action because the schema won't accept it. If you already have a health report plugin, DXA support might require no plugin changes at all, just new categories and markers in the CLI underneath.

Cron jobs: a daily due-soon check surfaces upcoming scan dates. If you want a post-ingestion summary (agent messages you with what changed after a new scan lands), that's a second job triggered by the ingestion event or a polling schedule. Start with one job and make sure the delivery path works end-to-end before adding more.

Version control: Git from the first commit. If the coding agent refactors the alias table and breaks regional marker canonicalization, git diff shows exactly what changed.

DXA PDF parser: once you've settled on a clinic you use regularly, a coding agent writes a deterministic parser for that clinic's PDF format. DXA PDFs tend to be more complex than bloodwork PDFs because they include diagrams, color maps, and multiple data tables on the same page. pdfplumber (Python) is particularly good at extracting tabular data from these. Don't bother writing a parser speculatively. Wait until you've used a clinic twice and confirmed the format is stable.

**Best Practices**

Deterministic logic for everything that isn't conversation. Trend detection, threshold comparison, regional symmetry calculation, T-score classification. All of this is straightforward arithmetic. Lean mass went from 63.8 to 64.2 kg: that's a 0.4 kg increase, and the code computes it. T-score is -0.3: the code says "normal." These are not questions for a language model. The agent's job is asking the right subcommand and presenting the answer clearly.

Shared schema across report types. DXA data, bloodwork, and cardiac data can coexist in the same three tables (reports, results, targets) differentiated by report_type. This is simpler than building separate databases per domain, and it means cross-domain queries work naturally. "Show me my bone density trend alongside my vitamin D levels" is a single query across two report types in the same database.

Embed guidance in CLI output. After report-add, the response includes a next_step field pointing to the review command. After review, each marker includes a set_due_command. The agent follows the chain. Each step's output tells it what to do next, which is more reliable than hoping it remembers a workflow across sessions.

Test the comparison logic. Scan-to-scan comparison is the highest-value feature. Test it thoroughly: what happens when the second scan has markers the first doesn't? When regional data is missing from one scan but present in the other? When units differ between clinics (grams vs kilograms, cm2 vs mL for visceral fat)? Edge cases in comparison logic are where subtle bugs hide.

Backups for irreplaceable state. Your scan history is hard to reconstruct. A scheduled backup dumps the SQLite file, compresses it, and pushes to a backup repo. The cadence can be relaxed compared to something that changes daily. Weekly or even monthly is fine for a database that only gets new data every few months.

See also: [Best Practices for Private AI Systems](/prompts/best-practices.md) for the full list.
{% /sectionCopy %}

{% sectionCopy eyebrow="models" title="Models: Vision for Ingestion, Conversation for Queries" %}
Most of this system is deterministic code: canonicalization, trend computation, threshold comparison, flag generation, regional delta calculation, T-score classification. None of that needs a model.

The model handles three things. First, ingestion extraction: reading a photograph of a DXA printout or parsing a PDF that doesn't have a deterministic parser yet. DXA reports are visually dense (tables, body diagrams, color-coded regions), so you want a model with strong vision capabilities and structured output for pulling clean numbers from complex layouts. Second, the conversational layer: interpreting questions like "am I building symmetrically?" and knowing to pull the regional comparison. Third, summarization: producing a scan review that connects body composition changes to training, nutrition, and relevant bloodwork from the same period.

The coding agent that builds the system has different requirements (strong code generation, long context). These don't need to be the same model. See [Choosing Models for Private AI Systems](/guides/model-selection) for the full breakdown.
{% /sectionCopy %}

{% sectionCopy eyebrow="security" title="Security: Keeping Body Composition Data on Your Hardware" tone="subtle" %}
Body composition data is health data, which makes it sensitive, but the attack surface of this system is relatively small compared to something that monitors an email inbox continuously.

Ingestion is the main surface. If you're photographing a printed report and sending it through a private messaging channel, the only person putting data in front of the agent is you. If you set up email forwarding from a clinic, sender filtering limits exposure: only process emails from your clinic's domain. The PDF or image enters the agent's context for extraction, which is the prompt injection surface, but a DXA report from a known clinic is low-risk compared to an open email inbox. If the report looks unusual or comes from an unexpected sender, the agent should present the data for review rather than ingesting automatically.

The database is a local SQLite file with no network interface. Filesystem permissions control access. If your machine has disk encryption (FileVault, LUKS), the data is encrypted at rest without additional setup.

Backups pushed to a remote repo should be in a private repo with access controls. For health data, encrypting the backup before pushing is worth considering, though the risk profile depends on where the backup lives and who might access it.

The overall risk here is low. The system mostly ingests data you send it directly, stores it locally, and runs analysis on your machine. There's no continuous intake from external sources, no API endpoint exposed to the internet, and no multi-user access. Standard machine hygiene covers most of it.

See also: [Security Considerations for Private AI Systems](/prompts/security.md) for the full reference.
{% /sectionCopy %}

{% sectionCopy eyebrow="timeline" title="Timeline: From First Scan to Full Integration" %}
Start with the minimum useful version: a CLI that can ingest a DXA report as JSON and show you the latest values. That's report-add and latest. Get your most recent scan into the system and query it. Even one scan in a structured database is more useful than a PDF in a drawer, because you can ask specific questions about individual markers instead of re-reading the whole report.

The system gets substantially more useful after the second scan. That's when comparison works: deltas, trends, direction. If you started the system with a single historical scan, the next real scan gives you the longitudinal view. Extend from there: personal targets after you decide what you're optimizing for, retest scheduling once you have a cadence in mind, regional analysis once you care about symmetry.

Wrap the CLI in an OpenClaw plugin when you want conversational access and automated scheduling. Add the cron job for scan reminders. Build a PDF parser for your regular clinic after you've been there twice and confirmed the format. Integration with bloodwork, nutrition, and training data comes last but pays off the most, since body composition changes make more sense when you can see what drove them.
{% /sectionCopy %}

{% sectionCopy eyebrow="personal use" title="Personal Use Cases: Tracking Changes Over Time" tone="subtle" %}
Body composition tracking is most valuable when it connects changes to what caused them. A single scan tells you where you are. A series of scans, correlated with what you were doing between them, tells you what works.

- You've been running a caloric surplus with high protein and a strength program for four months. Your DXA scan comes back and the agent compares it to your pre-bulk baseline: lean mass up 2.1 kg, fat mass up 0.9 kg, trunk lean mass increased the most. Your ALMI (appendicular lean mass index) went from 8.4 to 8.7. The surplus is working, and the lean-to-fat gain ratio is solid.

- Your left leg lean mass is 0.6 kg lower than your right. You didn't notice because you've never compared left-to-right before. The system flags the asymmetry when it ingests the scan. You bring it up with your physical therapist, who adjusts your rehab protocol. By the next scan six months later, the gap has closed to 0.2 kg.

- You've been supplementing vitamin D and doing load-bearing exercise after a scan showed a lumbar spine T-score of -1.1. Your follow-up scan six months later shows it's back to -0.7. The agent presents the improvement alongside your vitamin D bloodwork from the same period, which went from 22 to 48 ng/mL.

- Your visceral fat area was 92 cm2 last September. You changed your eating pattern (stricter fasting, cut alcohol) and it's 64 cm2 in March. The agent shows you the visceral fat trend alongside your fasting compliance data from the period.

- OpenClaw messages you: your next DXA scan is due in two weeks. The 180-day cadence was set when the last scan was ingested. You never added it to a calendar. You book the scan, get the report, photograph it, and send it to the bot. By the time you close the messaging app, the new scan is ingested and the agent is telling you what changed.

- You ask the agent before a doctor's appointment: "summarize my body composition changes over the last year." It pulls three scans and shows you the trajectory: body fat percentage down from 22% to 17%, lean mass up 3.2 kg, bone density stable, visceral fat halved. You walk into the appointment with specifics instead of "I think things are going well."
{% /sectionCopy %}

{% sectionCopy eyebrow="business use" title="Business Use Cases: Clinics, Coaches, and Research Teams" %}
Any practice that orders DXA scans regularly is doing some version of this manually: reviewing printed reports, maybe entering a few numbers into a spreadsheet, and relying on memory for trends across visits.

- A sports nutrition practice uses DXA scans to track body composition changes across training phases for collegiate athletes. Today, the nutritionist manually compares printouts from pre-season and mid-season to assess whether each athlete's bulk or cut is on track. With this system, every scan is ingested automatically and each athlete's lean-to-fat ratio, regional distribution, and visceral fat are tracked longitudinally. Before a check-in, the nutritionist asks "show me this athlete's body composition since August" and gets a comparison spanning three scans in seconds.

- An endocrinology clinic in Bangkok monitors bone density for patients on hormone replacement therapy. They need to track lumbar spine and hip T-scores across annual scans and correlate changes with treatment adjustments. The system flags any patient whose T-score has declined since the last scan, and the clinic's weekly review includes a list of patients with declining bone density alongside their current medication regimen. The doctor sees the change and the possible cause in the same view.

- A weight management program tracks client progress with periodic DXA scans to distinguish fat loss from lean mass loss. Losing weight is easy to measure on a bathroom scale. Losing fat while preserving muscle requires DXA data. The program's coaches get a per-client summary: this client lost 6 kg of fat mass and gained 0.4 kg of lean mass over four months. The conversation shifts from "you lost weight" to "you lost fat and kept muscle," which is more motivating and more honest.

- A research group studying sarcopenia in older adults tracks appendicular lean mass index (ALMI) across annual scans for 200 participants. They need structured, queryable data with consistent marker names, not a filing cabinet of PDFs. The system's canonical naming and SQLite storage mean they can query across all participants ("show me ALMI trends grouped by age cohort") and export clean datasets for statistical analysis without a manual data-cleaning step.

- A physiotherapy clinic uses DXA to assess regional muscle imbalances after injuries. A patient recovering from an ACL repair gets scanned at 3, 6, and 12 months post-surgery. The therapist asks "compare left leg lean mass to right leg across all three scans" and sees the rehabilitation trajectory: the injured leg was 14% below the uninjured leg at 3 months, 8% at 6 months, and 3% at 12 months. That trend line is the evidence that the rehab is working, presented without any manual calculation.

{% linkItem href="/services" label="Our services" summary="See how we build private AI systems for health tracking and business automation." /%}
{% linkItem href="/how-it-works" label="How it works" summary="Learn about our process for designing and deploying private AI solutions." /%}
{% /sectionCopy %}

{% cta title="Ready to build your body composition tracking system?" body="We design private AI systems that keep your health data on your hardware. Let's talk about what you need." actionHref="/contact" actionLabel="Book a consultation" /%}
