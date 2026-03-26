---
template: caseStudy
slug: /case-studies/individuals/property-search-pipeline
page_id: case-studies-individuals-property-search-pipeline
title: "Property Search Pipeline: A Private AI System for Apartment Hunting Across Listing Platforms"
description: "How one person uses a private AI system to monitor real estate listings across multiple platforms, filter by personal criteria, and maintain a live shortlist."
---

{% hero eyebrow="case study" title="Property Search Pipeline: A Private AI System for Apartment Hunting Across Listing Platforms" deck="One person's private AI system that monitors listing sites in a foreign city, filters by criteria the platforms themselves can't express, tracks price changes, and maintains a live shortlist. Everything runs on a home server. No spreadsheets, no tab hoarding, no missed listings." actionHref="/contact" actionLabel="book a consultation" /%}

{% metrics %}
{% metric label="listings monitored" value="3,200+ across 3 platforms" /%}
{% metric label="platforms scraped" value="SUUMO, Homes.co.jp, Athome" /%}
{% metric label="active shortlist" value="12 properties, ranked and tracked" /%}
{% /metrics %}

{% sectionCopy eyebrow="the problem" title="The Problem: Apartment Hunting in a Foreign City with Filters That Don't Work" %}
Searching for an apartment in Tokyo from abroad is a particular kind of frustrating. The major listing platforms, SUUMO, Homes.co.jp, Athome, each have thousands of listings in any given ward. Their built-in filters cover the basics: price range, station proximity, square meters, building age. But the actual criteria for a real search are always more specific than what the dropdowns allow.

Walking distance to a specific station, not just "within 10 minutes of any station." South-facing balcony. No first-floor units. Built after 2000 but not a tower mansion. Under a certain price per square meter, not just under a certain total rent. Pet-friendly but only if the building actually enforces it, which you can only tell from the listing description text. These are the filters that matter, and none of them exist on the platforms.

The manual process was: open three sites, run the same broad search on each, scroll through hundreds of results, mentally apply the real criteria, open promising listings in new tabs, copy details into a spreadsheet, and repeat this every few days to catch new listings before they disappeared. A serious search meant spending an hour a day on tab management. Listings that matched perfectly would appear and vanish within a week. Price drops on shortlisted properties went unnoticed until the next manual check, sometimes days later.

A private AI system replaced all of it.
{% /sectionCopy %}

{% sectionCopy eyebrow="the build" title="What Was Built: A Monitoring Pipeline on a Home Server" tone="subtle" %}
The system runs on a home server using OpenClaw as the orchestration layer. Three scrapers, one per platform, run on a cron schedule and pull structured listing data into a local SQLite database. Each scraper handles the platform's specific HTML structure and normalizes the output into a common schema: address, station, walk time, rent, management fees, floor, building age, square meters, layout, orientation, pet policy, and the full description text.

On top of the raw listings, a filter engine applies the real search criteria. These are not keyword matches. The system computes price per square meter, parses walk times from station data, checks floor numbers against minimums, reads description text for pet policy nuance, and cross-references building age. The criteria live in a configuration file and can be changed in a conversation: "drop the max rent to 180,000 and add Meguro as a target ward" is a message, not a code change.

When new listings pass the filter, the agent sends a summary through Telegram with the key details and a link to the original listing page. When a previously seen listing changes price, the system notes the delta and reports it. When a listing disappears from the platform, it is marked inactive in the database but preserved for reference.

The shortlist is a promoted subset of filtered listings. Adding a property to the shortlist is conversational: "shortlist this one, the 1LDK near Nakameguro." Shortlisted properties get more aggressive monitoring: price checks run more frequently, and any change triggers an immediate notification rather than waiting for the daily digest.

OpenClaw ties the pieces together. The scraping crons, the filter engine, the notification layer, and the conversational interface all run as registered tools in one agent instance. There is no web app, no dashboard, no login. The interface is a messaging thread.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="What It Looks Like Day to Day" %}
A morning message arrives with the overnight summary. Three new listings matched criteria in Shibuya and Meguro. One shortlisted property dropped rent by 5,000 yen. Two listings from last week were removed from SUUMO, probably rented.

Asking "show me everything under 160,000 near Naka-Meguro with a south-facing balcony" queries the local database, not the listing sites. The answer comes back in seconds with structured results, because the data is already ingested and indexed.

Adjusting the search is a message. "Add Setagaya, minimum 35sqm, exclude anything on the first floor." The filter config updates and the next scrape pass applies the new rules. No re-registration on three different platforms, no re-saving three different searches.

When a promising listing appears, the conversation continues naturally. "What's the price per square meter on this one compared to the Ebisu listing from last week?" The system has both in the database and does the comparison. "How long has the Sangenjaya place been listed?" It checks the first-seen date and reports the age.

Before contacting an agent about a property, asking "summarize everything I know about the shortlist" produces a briefing: each property with its key stats, how long it has been listed, any price changes, and notes from previous conversations. The preparation that would have taken thirty minutes of spreadsheet review takes one message.
{% /sectionCopy %}

{% sectionCopy eyebrow="the result" title="What Changed: Coverage Without the Overhead" tone="subtle" %}
The practical difference is coverage. Before, monitoring three platforms manually meant checking one thoroughly and skimming the other two. Listings that matched perfectly would sit on Athome for four days unnoticed because the manual routine started with SUUMO. The system eliminated that gap entirely. Every listing on every platform is evaluated against the same criteria on the same schedule.

The second change is speed. A new listing that passes the filter criteria triggers a notification within hours of appearing on the platform. In a competitive rental market, the difference between seeing a listing on day one versus day four is often the difference between getting a viewing and finding it already taken.

The shortlist replaced the spreadsheet. Instead of a static table that decayed every time a price changed or a listing was removed, the shortlist is a live dataset that updates itself. Price history is tracked automatically. Removed listings are flagged, not silently lost. The current state of the search is always accurate without any manual maintenance.

The private AI architecture means the search criteria, the shortlist, the conversation history, and every stored listing live on a local server. Nothing is shared with a third-party platform or analytics service. The listing data is public, but the search intent, the decision-making process, and the personal criteria are entirely private.
{% /sectionCopy %}

{% sectionCopy eyebrow="the stack" title="Technical Details: Scrapers, SQLite, OpenClaw, and Conversational Filters" %}
The scrapers are written in Python using standard HTTP libraries and HTML parsers. Each platform has its own scraper module that handles pagination, session management, and rate limiting. The output is normalized into a common JSON schema before insertion into SQLite. Deduplication uses a composite key of platform, listing ID, and snapshot date to track changes over time without losing history.

The filter engine is deterministic code, not LLM inference. Price per square meter is arithmetic. Station walk time is parsed from structured data. Floor number, building age, orientation, and layout are extracted from normalized fields. Description text analysis for nuanced criteria (pet policy details, renovation status, specific building features) uses pattern matching first and falls back to the language model only when the text is ambiguous. The boundary between computation and inference is explicit: the LLM never decides whether a listing passes the filter. It helps interpret listing descriptions when the structured data is insufficient.

OpenClaw provides the orchestration layer: cron scheduling for scraper runs and monitoring passes, plugin registration for the filter engine and shortlist manager, multi-channel messaging for notifications through Telegram, and conversational access to the full database through natural language queries. Adding a new platform means writing a scraper module that outputs the common schema. The filter engine, shortlist logic, and notification pipeline work without modification.

The system runs on a single home server. No cloud services, no API subscriptions beyond the listing platforms themselves (which are public websites). The entire pipeline, database, conversation history, and shortlist state live on local hardware.

{% linkItem href="/how-it-works" label="How the platform works" summary="Deployment model, privacy architecture, and the engagement process." /%}
{% linkItem href="/services" label="Services" summary="The same system configured for businesses, practices, and other individuals." /%}
{% /sectionCopy %}

{% cta title="This is one search, on one person's server." body="The same architecture that monitors Tokyo rental listings can track commercial real estate, auction listings, or inventory across any set of platforms. The system adapts to the criteria, not the other way around. The conversation starts with your specific situation." actionHref="/contact" actionLabel="Book a consultation" /%}
