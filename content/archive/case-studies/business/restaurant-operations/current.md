---
template: caseStudy
slug: /case-studies/business/restaurant-operations
page_id: case-studies-business-restaurant-operations
title: "Restaurant Operations: Private AI for Reservations, Inventory, and Staff Coordination"
description: "How a Bangkok restaurant group uses a private AI system to manage reservations, track inventory, coordinate staff, and monitor reviews across three locations."
---

{% hero eyebrow="case study" title="Restaurant Operations: Private AI for Reservations, Inventory, and Staff Coordination" deck="A Bangkok restaurant group running three locations with 70 staff uses a private AI system to coordinate reservations, manage perishable inventory, schedule shifts, automate supplier ordering, and monitor reviews across five platforms. Everything runs on their own server. No customer data leaves the building." actionHref="/contact" actionLabel="book a consultation" /%}

{% metrics %}
{% metric label="covers per week" value="2,800 across 3 locations" /%}
{% metric label="review platforms monitored" value="5 (Google, TripAdvisor, Facebook, Line OA, Wongnai)" /%}
{% metric label="staff coordinated" value="70 across FOH, BOH, and management" /%}
{% /metrics %}

{% sectionCopy eyebrow="the problem" title="The Problem: Three Restaurants, Fifteen Systems, No Single Source of Truth" %}
the group operates three restaurants in Bangkok: a flagship Thai fine dining room, a casual izakaya, and a brunch cafe. each location had its own reservation book, its own inventory spreadsheets, its own Line group for shift swaps, and its own way of tracking supplier orders. the general manager spent most mornings pulling numbers from five different apps to understand what happened yesterday.

reservations came in through Google, Line OA, phone calls, and walk-ins. double bookings happened weekly because the systems did not talk to each other. when a large party reserved at the flagship through Google and a walk-in group took the same table because the host checked the paper book, the problem was always discovered at the worst possible moment.

inventory tracking was manual. the head chef at each location kept a mental model of what was in the walk-in, updated a shared spreadsheet when they remembered, and called suppliers when something ran low. perishable waste was a known problem but nobody had the data to measure it. ordering happened by Line message to individual suppliers, with no central record of what was ordered, when, or at what price.

staff scheduling lived in a Google Sheet that the operations manager updated weekly. shift swap requests arrived by Line message. no one had a clear view of labor costs by location, overtime exposure, or whether the Sunday brunch had enough runners for a full house.

review monitoring was the general manager's side project. checking Google, TripAdvisor, Facebook, Wongnai, and Line OA across three locations meant opening fifteen browser tabs. most reviews were seen days late. the ones that needed a response often did not get one.

none of these problems were new. each one had been "solved" before with a new app or a new spreadsheet. the issue was that every solution created another silo. the group needed a single private AI system that could see across all three locations and all operational domains at once.
{% /sectionCopy %}

{% sectionCopy eyebrow="the build" title="What Was Built: A Unified Operations Layer on the Group's Own Server" tone="subtle" %}
the system runs on a server in the flagship restaurant's back office. it connects to the group's existing tools rather than replacing them: Google Business profiles for reservations that come through search, Line OA for direct customer messaging, supplier Line contacts for ordering, the POS system's daily sales export, and the staff scheduling sheet. no customer data, sales figures, or employee information passes through any external AI service.

reservation management was the first layer. the system pulls availability from a shared calendar, accepts bookings through Line OA and a simple web form, and holds a unified view of all three locations. when a reservation comes in through any channel, it checks capacity, confirms with the guest through the same channel they used, and updates the central calendar. if a large party books the private room at the flagship, the system adjusts available covers for that evening automatically.

inventory tracking was built on daily counts plus POS sales data. each kitchen enters a count at close. the system compares actual stock against expected stock based on what was sold and flags discrepancies. when an ingredient crosses a reorder threshold, the system drafts a supplier order with quantities calculated from forecasted demand for the next three days (based on reservation count and day-of-week sales history). the chef reviews the draft and approves it. the order goes to the supplier through their existing Line contact, sent by the system.

staff scheduling uses constraint-based logic. the system knows each employee's role, location certification, contract hours, and time-off requests. it generates a weekly draft schedule that covers projected demand, respects labor law rest requirements, and minimizes overtime. managers adjust the draft and publish it. shift swap requests go through the system, which checks coverage before approving.

review monitoring polls all five platforms hourly. new reviews are summarized and delivered to a shared Line group for the management team. the system categorizes each review by location, sentiment, and topic (food, service, ambiance, wait time). reviews that mention a specific complaint are flagged for response. a weekly summary shows review volume, average rating, and trending topics per location.

the entire system is orchestrated by OpenClaw. each operational domain is a plugin with its own CLI and typed schema. cron jobs handle the recurring work: morning briefings, daily inventory reconciliation, weekly schedule drafts, hourly review checks. the management team interacts with the system through Line, asking questions in natural language and receiving answers drawn from the same database the automated reports use.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="What It Looks Like Day to Day" %}
the general manager's morning starts with a message in Line. last night's covers by location, revenue against forecast, any inventory flags, today's reservation count and large party alerts, and a summary of overnight reviews. no spreadsheets opened. no tabs loaded. the information arrives before the first coffee.

the flagship's head chef checks the system's suggested supplier orders before the lunch rush. the system has already calculated that tonight's tasting menu reservations will require more sea bass than current stock supports, factoring in the two portions sold at lunch and the six-top booked for dinner. the chef adjusts the quantity, approves the order, and the message goes to the supplier's Line account.

an operations manager needs to know labor cost per cover at the izakaya this month. they ask through Line. the system pulls POS revenue, scheduled hours, and actual clock-in data to return a number with a comparison against the previous month. no report to run, no export to download.

a negative review appears on Google for the brunch cafe mentioning a 40-minute wait. the system flags it in the management Line group within the hour, tagged as a service issue. the cafe manager drafts a response. the system logs the response time for the weekly review report.

when a server at the izakaya calls in sick on a Friday evening, the shift swap goes through the system. it checks which staff at other locations are qualified for izakaya service, not already scheduled, and within their weekly hour limit. it suggests two options. the manager picks one and the reassigned server gets a Line notification with the shift details.
{% /sectionCopy %}

{% sectionCopy eyebrow="the result" title="What Changed: Operational Visibility Without New Apps or Vendor Lock-in" tone="subtle" %}
the group did not adopt a restaurant management platform. they did not sign a per-seat SaaS contract. they built a private system on their own hardware that connects the tools they already use and keeps their data under their own roof.

reservation conflicts dropped because every channel writes to the same calendar. the flagship went from two or three double-bookings per week to effectively zero. guest confirmations go out automatically through the channel the guest used to book, which reduced no-shows because the confirmation felt like a conversation, not a system email.

perishable waste decreased because ordering is now driven by forecasted demand rather than the chef's best guess on a busy morning. the system's three-day demand forecast, based on reservations and historical sales patterns, turned ordering from reactive into predictive. the group started measuring waste for the first time because the data existed to do so.

labor scheduling became defensible. when the operations manager presents the weekly schedule, it is backed by projected covers, historical staffing ratios, and overtime calculations. disputes about shift fairness decreased because the logic is transparent and consistent across locations.

review response time improved from days to hours. the weekly summary gave the ownership group a view of guest sentiment they had never had: not anecdotal, not sampled, but comprehensive across every platform and every location. trending complaints became visible early enough to address before they became patterns.

the system runs on OpenClaw on the group's own server. no per-seat fees, no vendor lock-in, no customer data flowing to a third party's cloud. when they open a fourth location in Bangkok, they add a location to the config. the system scales with the business because the architecture was built for the group, not rented from a platform.
{% /sectionCopy %}

{% sectionCopy eyebrow="the stack" title="Technical Details: Node.js, SQLite, OpenClaw, and Existing Tools" %}
the core is a Node.js backend backed by SQLite. reservations, inventory counts, supplier orders, staff schedules, and review data all live in one database on the group's server. the backend exposes CLI subcommands that return structured JSON: availability, stock levels, order history, schedule drafts, review summaries, and labor metrics. the agent calls these through OpenClaw's plugin system and renders results in natural language through Line.

data flows through five paths. reservations arrive via Google Business API polling and Line OA webhook. POS sales data is exported nightly as CSV and ingested automatically. inventory counts come through a simple web form the kitchen staff use on a tablet at close. supplier orders go out as Line messages through the system's Line OA integration. reviews are polled hourly from Google, TripAdvisor, Facebook, Wongnai, and Line OA public pages using API access where available and structured scraping where not.

the demand forecasting model is not a neural network. it is a weighted average of same-day-of-week sales over the past eight weeks, adjusted by current reservation count relative to historical reservation-to-walk-in ratios. it is simple, transparent, and accurate enough to drive ordering decisions that a chef can override. the system never places an order autonomously. it drafts. humans approve.

review categorization uses the language model for sentiment and topic extraction. the boundary between deterministic logic and LLM inference is explicit: reservation math, inventory arithmetic, and scheduling constraints are all code. the LLM handles natural language interaction, review summarization, and the morning briefing narrative.

OpenClaw provides the orchestration layer: plugin registration for each operational domain, cron scheduling for automated reports and polling, and Line messaging so the management team interacts with one system through one channel. cross-domain queries work naturally because all data lives in the same database. "what's our labor cost per cover at locations where Google reviews mention wait times this month" is a question the system can answer because reservations, POS data, staff schedules, and reviews are all accessible in the same turn.

{% linkItem href="/services" label="services" summary="consulting, build, and deployment for private AI systems across industries." /%}
{% linkItem href="/how-it-works" label="how it works" summary="deployment model, privacy architecture, and the engagement process." /%}
{% /sectionCopy %}

{% cta title="this is one configuration of one system." body="the same architecture that coordinates restaurant operations powers health tracking for individuals, document review for law firms, and project coordination for construction companies. the conversation starts with your specific situation." actionHref="/contact" actionLabel="Book a consultation" /%}
