---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
authority: temporary
mode: full-sdd
phase: proposal
opened: <YYYY-MM-DD>
affected_prds: []
affected_sdds: []
affected_decisions: []
---

# Proposal: <Change title>

> **Layer:** *what* — intent, scope, and optional **PRD delta**. Copy this template into
> `specs/changes/active/`. Do not edit canonical PRDs until Archive.
>
> **Policy:** `proposal.md` records *what* (including an optional PRD delta). `design.md` records *how*
> (the SDD delta). `tasks.md` records *do* — atomic Apply steps only, with no new requirements.
>
> **Prerequisite:** A signed `clarify.md`. Complete
> [Clarify](../handbook/engineering-workflow.md#1-clarify) before drafting this file.

---

## Intent and scope

*<!-- Why now? What does v1 deliver? Tie it to the feature request. -->*

## Non-goals

*<!-- Explicitly list what is not in this change, including deferred product asks. -->*

## Iteration plan

### v1 (this change)

*<!-- Minimal shippable slice for this change. -->*

### v2 (after user feedback — separate feature request)

*<!-- Bullets only; these items must not appear in the v1 PRD delta, SDD delta, or tasks. -->*

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | | paths |
| ADR alignment | pass / conflict / needs ADR | |
| Compliance | pass / HALT → owner | |
| Blocking questions | none / list | |

## PRD delta

*<!-- Write critical product outcomes as stable-ID requirements using the forms in the Authoring guide. -->*
*<!-- If no binding PRD change: **No PRD change** — governed by: <links> -->*

## Upstream links

| Kind | Link |
| --- | --- |
| Compliance | |
| Commercial | |
| Product context (orientation) | |
| Existing PRDs | |

## Resolved questions

*<!-- Decisions from signed clarify.md. They must match without drift. -->*

| Question | Resolution | Owner | Date |
| --- | --- | --- | --- |
| | | | |

---

*<!-- Add after upstream review: -->*

*Upstream review: <name> — <date>*

*Scope: proposal*

*Teach-back: confirmed*
