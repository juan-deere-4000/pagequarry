---
template: caseStudy
slug: /case-studies/business/dental-practice-intake
page_id: case-studies-business-dental-practice-intake
title: "Dental Practice Intake: Private AI for Patient Processing and Insurance Verification"
description: "How a Bangkok dental practice uses a private AI system to automate patient intake, verify insurance, and route documents on local hardware."
---

{% hero eyebrow="case study" title="Dental Practice Intake: Private AI for Patient Processing and Insurance Verification" deck="A multi-chair dental practice in Bangkok replaced its paper intake workflow with a private AI system running on its own server. Patient forms are parsed, insurance is verified, and documents are routed to the right dentist before the patient sits down. No cloud services touch the data." actionHref="/contact" actionLabel="book a consultation" /%}

{% metrics %}
{% metric label="daily patients" value="80-120 across 5 chairs" /%}
{% metric label="forms processed" value="~500 pages per week" /%}
{% metric label="time saved per patient" value="12 minutes on average" /%}
{% /metrics %}

{% sectionCopy eyebrow="the problem" title="The Problem: A Waiting Room Bottleneck That Scaled with Success" %}
The practice runs five chairs across two floors in central Bangkok, with six dentists rotating through morning and afternoon blocks. On a busy day, over a hundred patients come through the front desk. Each one arrives with some combination of a national ID card, an insurance booklet, a referral letter, previous x-rays on a CD or USB drive, and a medical history form filled out on a clipboard in the lobby.

The front desk staff of three handled all of this manually. They typed patient details into the practice management system, called insurance companies to verify coverage, flagged contraindications from the medical history, and matched each patient to the correct dentist and treatment room. On a good day, intake took about fifteen minutes per patient. On a bad day, with a new patient carrying a thick insurance packet and an incomplete medical history, it could take thirty.

The bottleneck was not the dentists. The chairs ran efficiently once patients were in them. The bottleneck was getting patients from the waiting room into the right chair with verified insurance and a complete file. Two or three slow intakes in a row created a cascade that pushed the entire morning schedule back. The practice had tried hiring a fourth front desk staff member, but the problem was not headcount. It was the number of systems, phone calls, and manual data entry steps between a patient walking in and a dentist seeing a complete chart.

The practice needed a private AI system because the data involved, patient medical histories, national ID numbers, insurance policy details, was exactly the kind of information that could not be sent to a third-party cloud API. PDPA compliance was not optional, and the practice's insurance contracts explicitly prohibited sharing patient data with external processors without consent. Whatever was built had to run on hardware the practice owned.
{% /sectionCopy %}

{% sectionCopy eyebrow="the build" title="What Was Built: Document Intake, Insurance Lookup, and Smart Routing" tone="subtle" %}
The system runs on a server in the practice's back office, behind the same network that serves the practice management software. It connects to three input surfaces: a document scanner at the front desk, an email inbox where patients send forms ahead of their visit, and a tablet in the waiting room where new patients fill out a digital medical history.

When a patient's paperwork arrives through any of those paths, the OpenClaw agent picks it up. Scanned documents are processed through OCR. Emailed PDFs are parsed directly. The digital form submits structured data. All three paths converge into the same pipeline: extract patient identity, match against existing records, parse the medical history for relevant flags, and pull insurance details.

Insurance verification was the single most time-consuming manual step. The old process involved calling the insurer, reading a policy number over the phone, and waiting for confirmation of coverage and remaining benefits. The new system queries insurer portals directly where APIs exist, and for insurers that only offer web portals, it navigates the portal programmatically. The result is a coverage summary: what is covered, what requires pre-authorization, and what the patient's copay will be. This summary is attached to the patient record before the dentist opens the chart.

Medical history parsing flags three things: medication interactions with common dental anesthetics, conditions that affect treatment planning (blood thinners, diabetes, cardiac conditions), and allergies. These flags appear as alerts on the dentist's chart view. The logic is deterministic, matching against a reference table of contraindications maintained by the practice's clinical director. The language model handles extraction from unstructured text, but the flagging rules are explicit code.

Patient routing uses the appointment schedule, the dentist's specialization, the treatment type, and chair availability. When intake is complete, the system assigns a chair and notifies the dental assistant via a message to their work device. The patient's name appears on the chairside display with their file ready.
{% /sectionCopy %}

{% sectionCopy eyebrow="daily use" title="What the Front Desk Actually Sees" %}
The morning starts with a queue. Patients who submitted forms by email or through the practice's Line account the night before already have partial records assembled. The front desk sees a list: name, appointment time, intake status. Green means the record is complete and insurance is verified. Yellow means the system needs a document or could not reach the insurer's portal. Red means a new patient with no prior record.

When a patient arrives and hands over their ID and insurance booklet, the front desk drops them on the scanner. Within seconds, the system matches the ID to an existing record or creates a new one, extracts the insurance policy number, and starts the verification query. The staff member confirms the match on screen and moves to the next patient. What used to be a fifteen-minute process of typing, calling, and cross-referencing is now a scan, a glance, and a confirmation.

For returning patients, the system is even faster. It pulls the existing record, checks whether insurance has changed since the last visit, and verifies current coverage automatically. The front desk interaction is essentially a check-in tap.

The clinical flags work quietly in the background. A patient on warfarin who filled out their medical history on the tablet gets a flag attached to their chart before the dentist opens it. The dentist does not need to read the full history to catch the one line that matters. The system surfaces it.

When something goes wrong, the system does not guess. An unreadable scan, an insurer portal that is down, a medical history with an ambiguous medication name: these get flagged for human review rather than processed with low confidence. The front desk handles exceptions. The system handles the routine.
{% /sectionCopy %}

{% sectionCopy eyebrow="the result" title="What Changed: The Waiting Room Cleared Out" tone="subtle" %}
The most visible change was the waiting room. Average time from arrival to chair dropped from twenty-two minutes to under ten. The cascade effect of slow intakes disappeared because the system processed documents in parallel while the front desk handled in-person interactions.

Insurance verification, which previously took six to eight minutes per patient and required a phone call, now completes in under a minute for the major Thai insurers. For international insurers with slower portals, it still takes longer, but the query starts automatically when the patient's documents are scanned, not when the front desk gets to them in the queue.

The three front desk staff now handle peak volumes that previously overwhelmed four. They spend less time on data entry and phone calls and more time on the parts of their job that require a person: greeting patients, handling scheduling changes, answering questions. The practice did not reduce headcount. It stopped needing to increase it.

Clinical flag accuracy is tracked monthly. In the first six months, the system flagged 340 medication interactions and allergy alerts. The clinical director reviewed a random sample and found the false positive rate under 2%. The flags the system catches are the same ones a careful reader would catch, but the system catches them on every patient, every time, without fatigue.

Data stays on the practice's server. Patient records, insurance details, medical histories, scanned documents: none of it passes through an external API. The system complies with PDPA requirements by design, not by policy. When the practice's legal counsel reviewed the architecture, the conversation was short. The data does not leave the building. There is nothing to audit externally.
{% /sectionCopy %}

{% sectionCopy eyebrow="the stack" title="Technical Details: OpenClaw, OCR, and Local-First Architecture" %}
The system is built on OpenClaw, running on a single server in the practice's back office. The server connects to the practice's local network and has no inbound internet exposure. Outbound connections are limited to insurer verification portals and the practice's email provider.

Document processing uses a local OCR pipeline for scanned images. Thai and English text are extracted and passed to a structured parser that identifies fields: patient name, date of birth, national ID number, policy number, medication list. The parser combines regex patterns for well-formatted documents with language model extraction for handwritten or inconsistent forms. Parsed fields are stored in SQLite alongside the original scan.

Insurance verification is modular. Each insurer has its own adapter: some use REST APIs, some use headless browser automation against web portals. Adding a new insurer means writing a new adapter, not modifying the core system. Verification results are cached with a configurable TTL so repeat visits within the same coverage period do not re-query.

The medical history flagging system maintains a reference table of approximately 200 dental-relevant contraindications: medications that interact with local anesthetics, conditions that require antibiotic prophylaxis, allergies to latex or specific materials. The table is maintained by the clinical director and versioned in the system. Updates take effect immediately across all new intakes.

OpenClaw's plugin architecture registers each component, the OCR pipeline, the insurance adapters, the flagging engine, the routing logic, as a typed tool. The cron scheduler runs nightly reconciliation: unmatched insurance queries are retried, incomplete records are flagged for morning follow-up, and the next day's appointment list is pre-processed so returning patients are verified before they arrive.

The practice's IT contractor manages the server hardware. The system itself requires no ongoing cloud subscriptions, no per-seat licensing, and no external data processing agreements. When the server needs maintenance, the practice operates on manual intake for the duration and catches up when the system comes back online.

{% linkItem href="/services" label="services" summary="private AI systems for clinics, practices, and professional offices." /%}
{% linkItem href="/how-it-works" label="how it works" summary="deployment model, privacy architecture, and the engagement process." /%}
{% /sectionCopy %}

{% cta title="your practice has the same bottleneck." body="the tools and data are already there. patient forms, insurance portals, medical histories, appointment schedules. what is missing is a system that connects them on hardware you control. the conversation starts with how your practice actually works today." actionHref="/contact" actionLabel="Book a consultation" /%}
