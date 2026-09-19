# FitWell traced knowledge graph

This document defines how product intent, binding requirements, engineering decisions, executable
artifacts, and verification evidence connect. Each node owns one kind of truth and links to its
immediate upstream and downstream dependencies.

## Node kinds

| Node | Authority | Owns |
| --- | --- | --- |
| Product brief/catalog/roadmap | Informational | Direction, audiences, verified capability inventory |
| PRD requirement | Binding product | Observable, stack-independent outcome with stable ID |
| System quality | Binding product | Cross-domain security, privacy, integrity, accessibility, reliability |
| SDD/architecture rule | Engineering or binding engineering | Stack-specific boundary, invariant, flow, and failure semantics |
| ADR | Decision | Durable technical choice and rejected alternatives |
| API/data/integration/runbook | Binding engineering or operational | Interface, persistence, external-state, deployment, recovery contract |
| Code/schema/migration | Executable | Exact current implementation |
| Test | Executable evidence | A selected contract or invariant under controlled conditions |
| Verification record | Temporary then historical | Evidence that an approved change was realized |
| Change artifact | Temporary | Approved delta during Full SDD |

## Required edge direction

```text
Product context
  -> PRD requirement / system quality
    -> SDD or architecture rule + ADR where applicable
      -> code / schema / migration / configuration
        -> automated test + manual/operational evidence
          -> verification decision
```

Product context may motivate a requirement but cannot substitute for one. Tests may prove a rule but
cannot create it. Archived change packages explain history but cannot remain the only home of a
current rule.

## Full SDD delta graph

```text
Feature request
  -> clarify.md (decisions and scope lock)
    -> proposal.md (PRD/outcome delta)
      -> design.md (SDD/technical delta and test mapping)
        -> tasks.md (ordered work)
          -> implementation and reviewed tests
            -> verification.md (evidence and deviations)
              -> canonical PRDs/SDDs/ADRs/runbooks/product catalog
```

Each downstream artifact must be derivable from its approved upstream. When evidence changes a
decision, return to the owning upstream artifact and re-approve it instead of patching downstream text.

## Minimum traceability

- PRDs use stable requirement IDs and link implementing SDDs.
- SDDs list relevant requirement and ADR IDs and stable code/test paths.
- Tests include stable requirement IDs in names when they verify binding behavior.
- Verification records map every changed criterion/rule to concrete evidence and disclose gaps.
- Canonical documents record material history without copying temporary change-package prose.

## Gap vocabulary

- **Requirement gap:** desired behavior has no approved PRD contract.
- **Design gap:** a binding requirement has no adequate SDD/architecture rule.
- **Implementation gap:** approved design is absent or incomplete in executable artifacts.
- **Verification gap:** implementation exists without sufficient evidence.
- **Stale edge:** a path, test, requirement, or ADR reference no longer represents reality.

Never invent traceability to make the graph look complete. Resolve the gap through the appropriate
workflow. See [Traceability guide](handbook/traceability-guide.md) for detailed maintenance rules.

