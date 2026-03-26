---
template: caseStudy
slug: /case-studies/business/construction-project-coordination
page_id: case-studies-business-construction-project-coordination
title: "Construction Project Coordination: Private AI for Permits, Procurement, and Progress"
description: "How a Bangkok construction firm uses a private AI system to track permits, coordinate subcontractors, and manage procurement across active projects."
---

{% hero eyebrow="case study" title="Construction Project Coordination: Private AI for Permits, Procurement, and Progress" deck="A mid-size Bangkok construction firm runs a private AI system that tracks permits, coordinates subcontractors, manages procurement timelines, and generates daily progress reports. Everything runs on their own server. Project data never leaves their network." actionHref="/contact" actionLabel="book a consultation" /%}

{% metrics %}
{% metric label="active projects" value="5 residential and commercial" /%}
{% metric label="daily messages processed" value="120+ across Line and email" /%}
{% metric label="data sources" value="4 (permits, procurement, subcontractors, site reports)" /%}
{% /metrics %}

{% sectionCopy eyebrow="the problem" title="The Problem: Project Data Scattered Across People and Platforms" %}
the firm runs five active projects across Bangkok at any given time. residential builds, commercial fit-outs, renovation contracts. each one generates its own stream of permit applications, subcontractor communications, material orders, and daily site reports.

before the system existed, coordination ran through a combination of Line group chats, email threads, shared spreadsheets, and physical paperwork. the project manager for a condominium renovation might have permit status in an email from the district office, subcontractor schedules in a Line group with 40 participants, procurement timelines in a Google Sheet maintained by the procurement team, and daily progress photos in yet another Line group.

none of it was connected. asking "which projects have permits expiring this month" required calling three people. asking "did the steel delivery for the Sukhumvit site actually arrive" meant scrolling through a group chat. asking "what did the electrical subcontractor confirm about next week" meant finding the right thread in the right app and hoping the message hadn't been buried.

the information existed, but assembling it into a decision took hours of manual work every day. for a firm managing 80 employees and dozens of subcontractor relationships, that overhead compounded fast. the managing director spent mornings chasing updates instead of making decisions.
{% /sectionCopy %}

{% sectionCopy eyebrow="the build" title="What Was Built: A Private Coordination System on the Firm's Own Server" tone="subtle" %}
the system runs on a server in the firm's Bangkok office. it connects to four primary data sources: permit records entered by the admin team, procurement tracking from the purchasing department, subcontractor communications ingested from Line and email, and daily site reports submitted by site supervisors.

permit tracking is structured. when a permit application is filed, the admin team logs it with the project, permit type, submission date, and expected response window. the system monitors aging permits, flags ones approaching deadline, and alerts the project manager when action is needed. if a building permit for a residential project has been pending for 28 days and the typical turnaround is 30, the project manager gets a message before it becomes urgent.

subcontractor communication runs through a monitored channel. when a subcontractor confirms a delivery date over Line, or an electrician sends an updated timeline by email, the system captures the commitment and tracks it against the project schedule. if a confirmed date passes without a corresponding site report entry, the system flags the gap.

procurement works similarly. material orders are logged with expected delivery dates, quantities, and the project they're allocated to. when a steel delivery is confirmed by the supplier, that confirmation is matched against the original order. when prices change or lead times shift, the system surfaces the variance so procurement can act before it cascades into a schedule delay.

daily site reports are submitted by supervisors through a simple form. photos, crew count, work completed, issues encountered. the system compiles these into a daily summary for each project and a consolidated view for the managing director.

the entire system is orchestrated by OpenClaw. each data source has its own plugin. the cron scheduler generates morning briefings, weekly procurement summaries, and permit expiry warnings. the messaging layer delivers everything through the channels the team already uses.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="What It Looks Like Day to Day" %}
the managing director's morning starts with a consolidated briefing. five projects, one message. which sites are on schedule, which have open issues from yesterday, which permits need attention this week, which deliveries are expected today.

asking a follow-up is conversational. "what's the permit status on the Rama IX project" returns the full list: approved, pending, and upcoming submissions with dates. "which subcontractors haven't confirmed next week's schedule" returns the names and the last communication date for each. "show me yesterday's site report for Thonglor" pulls the supervisor's entry with photos, crew count, and notes.

project managers use the same system for their individual projects. the mechanical subcontractor sends a Line message confirming pipe delivery for Thursday. the system logs the commitment. if Thursday's site report doesn't mention the delivery, the project manager gets a follow-up prompt on Friday morning.

the procurement team tracks material orders and supplier confirmations in one place. when a supplier emails a revised quote, the system compares it against the original order and flags the delta. the weekly procurement summary shows open orders, confirmed deliveries, and any items at risk of delay across all five projects.

site supervisors submit their daily reports in under ten minutes. the form captures the essentials. the system handles the rest: compiling, comparing against schedule, and surfacing anything that looks off.
{% /sectionCopy %}

{% sectionCopy eyebrow="the result" title="What Changed: Decisions Based on Current Data Instead of Yesterday's Memory" tone="subtle" %}
the practical difference is not a fancier dashboard. it is that the managing director now makes decisions based on current, consolidated data instead of fragmented updates from five different sources.

before the system, the Monday morning meeting was a status update session. each project manager reported verbally, working from memory and notes. the meeting ran 90 minutes and still missed things. after the system, the Monday meeting starts with everyone looking at the same briefing. the conversation moves to decisions and problem-solving because the status is already known.

permit tracking went from reactive to proactive. the firm no longer discovers an expired permit when a site inspector shows up. the system surfaces upcoming expirations with enough lead time to act. in the first three months, two permits that would have lapsed were renewed on time because the system flagged them ten days before expiry.

procurement visibility reduced material delays. when the system tracks every order and every supplier confirmation in one place, the procurement team spots problems earlier. a concrete supplier who consistently delivers three days late is visible in the data. that visibility drives a conversation that would not have happened when delivery tracking lived in scattered Line messages.

the biggest change is that information flows to the people who need it without someone manually assembling and forwarding it. the site supervisor's daily report reaches the project manager, the managing director, and the procurement team in the formats each of them needs, without anyone copying and pasting between apps.
{% /sectionCopy %}

{% sectionCopy eyebrow="the stack" title="Technical Details: OpenClaw, SQLite, and Standard Protocols on Local Hardware" %}
the core is a Node.js backend backed by SQLite. every permit record, procurement order, subcontractor communication, and site report lives in one database on the firm's own server. the system exposes structured queries: permit status by project, procurement aging, subcontractor compliance, daily summaries, and cross-project rollups. OpenClaw's plugin system wraps each query surface with a typed schema so the agent can answer natural language questions against the same data the automated reports use.

data ingestion uses three paths. structured input through web forms for permits and site reports. email monitoring for supplier confirmations and formal correspondence. Line message ingestion for subcontractor communications. each path is independent. adding a new source, like a GPS tracker for equipment, means writing an ingestion handler without redesigning the system.

the private AI boundary is explicit. all project data stays on the firm's server. subcontractor names, permit details, procurement pricing, site photos: none of it passes through external APIs. the language model handles natural language interaction, briefing generation, and anomaly surfacing. the underlying data storage, querying, and comparison logic is deterministic code. the line between what the model does and what the code does is clear throughout the system.

OpenClaw provides the orchestration layer: plugin registration for each data source, cron scheduling for daily briefings and weekly rollups, and multi-channel delivery so the same report can go to Line, email, or a web interface depending on the recipient. cross-source queries work naturally because all data lives in one agent instance. checking a permit status, pulling related procurement orders, and messaging the project manager all happen in one turn.

{% linkItem href="/services" label="services" summary="private AI systems for construction, professional services, healthcare, and individuals." /%}
{% linkItem href="/how-it-works" label="how it works" summary="deployment model, privacy architecture, and the engagement process." /%}
{% /sectionCopy %}

{% cta title="your project data belongs on your server." body="the same architecture that coordinates construction projects powers health tracking for individuals, document review for law firms, and patient intake for clinics. the conversation starts with how your team actually works today." actionHref="/contact" actionLabel="Book a consultation" /%}
