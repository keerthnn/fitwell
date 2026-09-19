# FitWell specifications manifest

## Process and navigation

| Path | Purpose |
| --- | --- |
| `README.md` | Entry point, authority model, and folder map |
| `DEVELOPER_GUIDE.md` | Linear Lightweight/Full SDD workflow |
| `ai-native-development-architecture.md` | Rationale, layered model, and operating modes |
| `traced-knowledge-graph.md` | Node kinds and upstream/verification edges |
| `handbook/` | Documentation policy, authoring, traceability, workflow, review checklist |
| `changes/CLARIFY_AND_PROPOSE.md` | Clarify/Proposal decision discipline |
| `review/` | Upstream review, Testing Trophy, code review, and Verification |

## Product and engineering truth

| Path | Authority |
| --- | --- |
| `product/` | Informational direction and verified capability inventory |
| `prds/domains/`, `prds/system-qualities.md` | Binding observable outcomes |
| `engineering/features/` | Feature SDDs and implementation invariants |
| `engineering/architecture/` | System and trust boundaries |
| `engineering/decisions/` | Accepted durable technical decisions |
| `engineering/api/`, `database/`, `integrations/`, `operations/`, `quality/` | Engineering and operational contracts |
| `meta/domain-dictionary.yaml` | Shared domain vocabulary |

## Change execution

| Path | Purpose |
| --- | --- |
| `changes/active/YYYY-MM-DD-slug/` | One active five-file Full SDD package per change |
| `changes/archive/YYYY/YYYY-MM-DD-slug/` | Historical package after canonical sync |
| `templates/` | Clarify, Proposal, Design, Tasks, Verification, PRD, SDD, ADR templates |
| `.agents/skills/opsx-*` | Executable Full SDD phase guidance |
| `.agents/skills/lightweight-plan-archive/` | Executable Lightweight guidance |
| `.agents/skills/opsx/_manifest.yaml` | Skill-to-policy manifest |

Run `pnpm run specs:check` after process/spec changes.
