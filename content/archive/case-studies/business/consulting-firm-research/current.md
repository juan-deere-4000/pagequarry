---
template: caseStudy
slug: /case-studies/business/consulting-firm-research
page_id: case-studies-business-consulting-firm-research
title: "Consulting Firm Research: Private AI for Knowledge Management and Report Drafting"
description: "How a Bangkok consulting firm uses a private AI system to search past engagements, draft reports, and manage institutional knowledge on local hardware."
---

{% hero eyebrow="case study" title="Private AI for a Consulting Firm: Research Automation and Institutional Knowledge on Local Hardware" deck="A mid-size management consulting firm in Bangkok deployed a private AI system to search 15 years of engagement history, draft client reports, and keep institutional knowledge accessible across the practice. Everything runs on the firm's own server. Client data never leaves the building." actionHref="/contact" actionLabel="book a consultation" /%}

{% metrics %}
{% metric label="engagement reports indexed" value="2,400+" /%}
{% metric label="research time reduction" value="~65%" /%}
{% metric label="knowledge sources connected" value="4 (reports, proposals, research, email)" /%}
{% /metrics %}

{% sectionCopy eyebrow="the problem" title="The Problem: Fifteen Years of Knowledge Locked in File Servers" %}
the firm had been operating in Bangkok for over fifteen years. forty consultants across six practice areas had produced thousands of deliverables: market assessments, due diligence reports, competitor analyses, operational reviews, strategy decks. the work was good. finding it again was the problem.

engagement files lived in nested folder structures on a shared drive. naming conventions had changed three times over the years. some reports were in Word, others in PDF, a few only existed as email attachments that never made it to the server. when a new engagement came in, the standard process was to ask around: "have we done something like this before?" the answer was usually yes, but finding the actual work meant hours of digging through folders, searching file names, and hoping someone remembered which partner led the similar project in 2019.

the research problem was just as bad. consultants gathered market data, regulatory filings, news articles, and interview notes during engagements. that research disappeared into project folders when the engagement ended. three months later, a different team working on a related sector would start from scratch because no one knew the prior research existed.

the firm had considered cloud-based AI tools. the partners rejected them. client deliverables contain sensitive financial data, strategic plans, and confidential interviews. uploading that corpus to a third-party API was not an option. the knowledge management problem needed a solution that kept everything inside the firm's own infrastructure.
{% /sectionCopy %}

{% sectionCopy eyebrow="the build" title="What Was Built: A Private Knowledge System on the Firm's Own Server" tone="subtle" %}
the system runs on a server in the firm's office. no data leaves the local network. the private AI layer sits on top of the firm's existing file storage and indexes everything into a searchable knowledge base.

the first step was ingestion. a pipeline crawled the shared drive and processed every document it found: Word files, PDFs, PowerPoint decks, Excel models. each document was chunked, embedded, and stored in a local vector database alongside its metadata: engagement name, client sector, practice area, date range, authors. email archives from key engagement accounts were ingested separately. the full corpus came to roughly 2,400 engagement deliverables and several thousand supporting research documents.

on top of the indexed corpus, OpenClaw orchestrates the conversational layer. consultants interact with the system through an internal messaging channel. a query like "what do we know about logistics infrastructure in the EEC" returns relevant passages from prior deliverables, research notes, and email threads, ranked by relevance and tagged with source documents. the consultant sees exactly where each piece of information came from and can pull up the full original document.

report drafting works as a structured workflow. a consultant provides an engagement brief: client sector, scope, key questions. the system searches the knowledge base for relevant prior work, assembles a draft outline with references to existing deliverables, and generates section drafts that draw on the firm's own language and frameworks. the output is a first draft, not a final product. consultants review, revise, and refine. but the starting point is grounded in the firm's actual body of work rather than generic language model output.

the system also maintains a living research library. when consultants gather new market data or regulatory updates during an engagement, that material is tagged and indexed automatically. the knowledge base grows with every project instead of resetting to zero.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="What It Looks Like Day to Day" %}
a principal preparing a proposal for a new engagement types a query into the internal channel: "show me our prior work in Thai healthcare, especially anything involving hospital operations or procurement." within seconds, the system returns a ranked list of relevant deliverables with summaries, dates, and links to the original files. what used to take an afternoon of folder diving takes less than a minute.

a junior consultant starting research on a market entry analysis asks the system what the firm already knows about the target sector. the response includes passages from three prior engagements, two internal research memos, and a relevant email thread from a partner who worked with a similar client two years ago. the consultant starts from existing knowledge instead of a blank page.

during report drafting, a consultant feeds the engagement brief into OpenClaw's workflow. the system searches for structurally similar past deliverables, identifies the firm's standard analytical frameworks for that type of engagement, and produces a first draft with inline citations to source material. the consultant spends time refining arguments and adding new analysis rather than writing boilerplate sections from scratch.

partners use the system before client meetings. "summarize our engagement history with this client" produces a briefing that covers past deliverables, key findings, and any follow-up recommendations that were made. the partner walks into the meeting with full context rather than relying on memory or a hastily assembled summary from an associate.

the system handles Thai and English documents equally. the firm's bilingual client base means deliverables exist in both languages, and the knowledge base treats them as a single searchable corpus.
{% /sectionCopy %}

{% sectionCopy eyebrow="the result" title="What Changed: Institutional Memory That Actually Works" tone="subtle" %}
the most immediate change was speed. research that previously took a full day of searching and reading now takes minutes. the firm estimates that consultants spend roughly 65% less time on the "finding what we already know" phase of new engagements.

the quality effect was harder to measure but obvious to the partners. proposals started referencing specific prior work more consistently. reports built on the firm's existing analytical frameworks instead of reinventing them. junior consultants produced stronger first drafts because they had access to the same institutional knowledge that senior partners carried in their heads.

knowledge retention improved structurally. when a senior consultant left the firm, their engagement history and research remained fully searchable. the private AI system turned individual expertise into organizational memory without requiring anyone to write handover documents or update a wiki.

the Bangkok office runs the system on its own hardware. the cost is the server and the engagement to configure and deploy it. there is no per-query fee, no usage-based pricing, no external dependency that could change terms or raise rates. the firm owns its knowledge infrastructure the same way it owns its office furniture.

client confidentiality, the original blocker, is a non-issue. nothing leaves the server. the firm can demonstrate to clients exactly where their data lives and who has access to it. for engagements with strict data handling requirements, this is a competitive advantage rather than just a compliance checkbox.
{% /sectionCopy %}

{% sectionCopy eyebrow="the stack" title="Technical Details: Local Inference, Vector Search, and OpenClaw Orchestration" %}
the system runs on a server in the firm's office. document processing uses a pipeline of deterministic extraction (Apache Tika for document parsing, standard chunking for text segmentation) followed by local embedding for vector search. the vector database stores document chunks alongside structured metadata: engagement ID, practice area, document type, date, author.

search combines vector similarity with metadata filtering. a query like "due diligence reports in energy sector from 2022 to 2024" uses both semantic search against the document content and structured filters against the metadata fields. results include relevance scores and direct links to source documents on the shared drive.

report drafting uses a structured pipeline rather than open-ended generation. the system identifies relevant prior deliverables, extracts the firm's analytical patterns for that engagement type, and generates section drafts that follow those patterns. every claim in the draft is grounded in a cited source document. consultants can trace any generated paragraph back to the original material it drew from.

OpenClaw provides the orchestration layer: plugin registration for the search and drafting tools, cron scheduling for periodic re-indexing as new documents arrive on the shared drive, and messaging integration so consultants interact through the firm's existing communication channels. the same agent instance handles ad hoc queries, structured report workflows, and automated indexing. adding a new data source, like a subscribed research database or a CRM export, means writing an ingestion handler and registering it as a plugin.

the system does not require internet access to operate. all inference, search, and document processing happens on local hardware. the firm's IT team manages the server the same way they manage any other internal system.

{% linkItem href="/services" label="services" summary="private AI systems for consulting firms, law practices, and professional services." /%}
{% linkItem href="/how-it-works" label="how it works" summary="deployment model, privacy architecture, and the engagement process." /%}
{% /sectionCopy %}

{% cta title="your firm's knowledge is already there. it just needs a way to find itself." body="the same architecture that powers knowledge management for consulting firms handles document review for law practices, patient coordination for clinics, and operations tracking for construction companies. the conversation starts with your specific situation." actionHref="/contact" actionLabel="Book a consultation" /%}
