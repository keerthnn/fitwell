# FitWell specification backfill status and maintenance guide

FitWell has completed its initial documentation bootstrap. Evidence, unknowns, and manual-review work
are recorded in [bootstrap-report.md](bootstrap-report.md). This guide covers continuing backfill.

## Baseline present

- Informational product brief, verified feature catalog, and roadmap.
- Domain PRDs plus cross-domain system qualities.
- Feature SDDs, architecture, ADRs, API/data/integration/operations/quality documents.
- Lightweight and Full SDD workflows, templates, review/testing guides, and OPSX skills.
- OPSX skills intentionally stored under `.agents/skills/`.

## Backfill rule

Backfill describes verified current behavior and approved contracts. It does not use an active Full
SDD package unless behavior changes at the same time. Mark unknown facts honestly; do not infer
Firebase, Vercel, or hosted PostgreSQL state from local code.

## Completion order per domain

1. Confirm vocabulary and observable journeys.
2. Review the domain PRD and system-quality dependencies; activate only testable outcomes.
3. Review the implementing SDD/architecture/ADR set and record explicit gaps.
4. Verify API, data, authorization, integration, deployment, and recovery claims against code or an
   authorized external source.
5. Map high-risk rules to tests and manual/operational evidence.
6. Update `last_verified` only for documents compared with evidence.
7. Run `pnpm run specs:check` and resolve structural/link failures.

## Ongoing change workflow

- Lightweight: update canonical documents directly at completion, or record
  `No specification change` with reason.
- Full SDD: preserve temporary deltas in `changes/active/`, synchronize canonicals during
  Verification, and move the unchanged package to `changes/archive/YYYY/` after approval.
- Update product inventory only after user-visible behavior is verified.
- Archived packages never outrank active PRDs, SDDs, ADRs, or runbooks.

Use [bootstrap-report.md](bootstrap-report.md), SDD `last_verified` fields, the
[verification matrix](engineering/quality/verification-matrix.md), and explicit `Gap` entries as the
remaining queue. Prioritize identity, ownership, admin access, destructive data behavior, and recovery.
