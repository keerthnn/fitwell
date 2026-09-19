---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
authority: temporary
mode: full-sdd
phase: clarify
opened: <YYYY-MM-DD>
affected_prds: []
affected_sdds: []
affected_decisions: []
code: []
---

# Clarify: <Change title>

> **Phase:** Clarify — decision record before delta files. Copy this template at the start of Clarify;
> update it iteratively until the human signs off. Do **not** draft `proposal.md`, `design.md`, or
> `tasks.md` until **Human decisions** below are complete and signed.
>
> **Canonical guide:** [Engineering workflow](../handbook/engineering-workflow.md#1-clarify).

---

## Feature request (input)

*<!-- Paste or link the feature request, issue, brief, or discussion. -->*

## Restatement

*<!-- Agent: one paragraph describing the outcome we intend to bind. Human must approve before lock. -->*

**Human approval:** *<!-- approved / revised on <date> by <name> -->*

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | | paths |
| ADR alignment | pass / conflict / needs ADR | |
| Compliance | pass / HALT → owner | |
| Blast radius (`code` in frontmatter) | | |
| Blocking questions | none / list | |

## Open questions

*<!-- Gaps that block binding specs. Each row needs resolution, deferral with owner + date, or owner escalation. -->*

| Question | Status | Resolution / owner | Date |
| --- | --- | --- | --- |
| | open / deferred / resolved | | |

## Options

*<!-- When a genuine fork exists, list approaches with product impact, engineering cost, and risk. -->*
*<!-- When the path is obvious, write “N/A — single recommended path” and state the recommendation. -->*

| Option | Product impact | Engineering cost | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| | | | | |

**Chosen approach:** *<!-- human fills after engineering + product agree when tradeoffs matter -->*

## v1 scope

*<!-- Smallest shippable slice for this change. -->*

## Non-goals and v2

### Non-goals (not in this change)

*<!-- Explicit scope stops. -->*

### v2 (separate feature request later)

*<!-- Deferred items must not appear in v1 deltas. Write “N/A” if scope was not split. -->*

## PRD change decision

*<!-- Agent recommends; human confirms. -->*

- [ ] **PRD delta required** — new or changed binding outcomes for v1
- [ ] **No PRD change** — governed by: *<!-- links -->*

**Human confirmation:** *<!-- name, date -->*

## Accepted tradeoffs

*<!-- When the request was adjusted, record the options, compromise, and engineering + product agreement. -->*
*<!-- Write “N/A” if v1 ships as originally requested. -->*

| Original ask | What v1 ships instead | Why acceptable | Agreed by | Date |
| --- | --- | --- | --- | --- |
| | | | | |

---

## Human decisions (required before Propose)

Complete every applicable item. **Propose must not start** until all are checked and signed.

- [ ] **Restatement** — outcome matches what the requester asked for, or the adjustment is documented.
- [ ] **Upstream audit** — compliance passes or HALT is escalated; ADR conflicts are resolved or a superseding ADR is planned.
- [ ] **Open questions** — no unresolved blocking questions; deferrals have an owner and date.
- [ ] **Approach** — an option is chosen, or the single recommended path is accepted.
- [ ] **v1 scope** — the shippable slice is approved.
- [ ] **Non-goals / v2** — deferred work is explicit; nothing is smuggled into v1.
- [ ] **PRD change** — PRD delta versus **No PRD change** is confirmed.
- [ ] **Tradeoffs** — engineering + product sign-off exists when the product promise changed.

**Lock it — sign-off**

```text
Clarify approved: <name> — <date>
Propose may begin.
```
