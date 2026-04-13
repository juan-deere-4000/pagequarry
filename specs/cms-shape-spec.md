# High-Level CMS Shape Spec

## Overview

Create a reusable file-based CMS framework that is separate from any one site's brand, content, or visual identity.

The framework should let a user create a site repository that contains their actual website implementation, content, and customizations, while relying on the shared CMS framework for the content pipeline, rendering contracts, and publication model.

This system should be shaped so that a user can:
- clone or fork the CMS framework into a new site repo
- customize the site's styling, blocks, templates, and content inside that repo
- publish and maintain a real site from that repo
- propose generally useful improvements back upstream to the CMS framework when those improvements are broadly reusable

## Product Shape

The CMS should be defined as a framework plus a site implementation model, not as a single hard-coded site.

### CMS Framework Responsibilities

The CMS framework should own:
- the markdown content submission and validation pipeline
- the accepted-content archive and revision history model
- generated state used by the runtime
- quarantine and recovery behavior for invalid or misplaced writes
- the block contract system
- the template contract system
- the parser and frontmatter rules
- publication rules for draft vs published content
- documentation for how a site author extends and customizes the system

### Site Repository Responsibilities

A site repository built on the CMS should own:
- site identity and metadata
- design system and styling
- block presentation and site-specific block additions
- template customization where needed
- actual page content
- deployment configuration for that site
- any site-specific editorial conventions or content structures

## Authoring Model

The system should remain file-based and markdown-driven.

The intended authoring path is:
1. content is created as markdown drafts
2. drafts are validated against block, template, and metadata contracts
3. accepted drafts are published into generated runtime state
4. accepted revisions are archived visibly for history and recovery

The system should continue to make publication explicit rather than allowing arbitrary filesystem edits to become live automatically.

## Extensibility Model

The CMS must make it obvious how a site owner adds or changes presentation capabilities.

### Canonical Blocks

The framework should ship with a small core set of canonical blocks that cover the common baseline use cases.

These canonical blocks should be:
- documented clearly
- stable enough to build real sites on
- implemented in a way that makes future additions straightforward

### Site-level Custom Blocks

A site repo should be able to define additional blocks beyond the canonical set.

This should support the workflow where:
- a site owner needs a capability the framework does not yet provide
- they add the block and styling in their site repo
- they use it in that repo without needing to fork framework internals unnecessarily
- if the block proves broadly useful, they submit it upstream as a candidate canonical block

The same model should apply to template-level additions where practical.

## Example Requirement: Image Support

The framework should be designed so that support for something like images is an obvious extension path, not a confusing special case.

The intended shape is:
- a site owner can add an image-oriented block in their site repo
- that block can include whatever rendering and styling support their site needs
- the content pipeline can validate and accept usage of that block through the documented extension mechanism
- if image support becomes broadly useful, the block can be proposed upstream into the canonical framework block set

The important requirement is not just image support itself, but a clear extension contract that makes this kind of addition understandable and maintainable.

## Separation Requirement

The framework must not be entangled with one specific business, starter brand, or historical content set.

A clean implementation should make the boundary between framework and site obvious.

A user evaluating the CMS should be able to understand:
- what belongs to the reusable CMS
- what belongs to one concrete site implementation
- what they are expected to customize in their own repo
- what kinds of improvements should be contributed upstream

## Contribution Model

The system should support a healthy upstream/downstream workflow.

### Downstream Site Work

A site repo should be the normal place to:
- add site-specific blocks
- add styling variants
- add content types or page structures that are unique to that site
- evolve the design and editorial behavior of that site

### Upstream CMS Contributions

The framework repo should accept contributions for improvements that are broadly reusable, such as:
- new canonical blocks
- better validation rules
- stronger authoring ergonomics
- improved template contracts
- better recovery behavior
- better documentation for extension and customization

## UX Goal

The system should feel like a usable CMS, not like a one-off site codebase that happens to read markdown.

That means a new user should be able to understand:
- how content gets authored
- how content becomes live
- how blocks and templates are defined
- how to customize a site implementation
- how to add new capabilities without breaking the framework

## Acceptance Criteria

This shape is achieved when:
- the reusable CMS layer is clearly distinguishable from site-specific implementation
- a user can create and maintain a site repo without modifying hidden framework internals for normal customization
- block and template extension paths are documented and understandable
- site-specific additions can live downstream first and be upstreamed later if they prove generally useful
- the system is positioned as a reusable CMS framework with site repos built on top of it, rather than as a single hard-coded site
