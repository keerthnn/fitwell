# Quality documentation

## Purpose

Quality documents define how FitWell specifications become credible evidence. They govern test-layer selection, requirement coverage, manual verification, and completion gates.

- [Testing strategy](testing-strategy.md) owns test purpose, layers, location, and quality rules.
- [Verification matrix](verification-matrix.md) maps change risk to required automated and manual evidence.

Tests do not replace PRDs or SDDs; they verify selected contracts. A passing suite cannot validate an omitted requirement, weak assertion, or untested external state.

The change author supplies evidence. Reviewers assess whether evidence proves the contract and covers likely failure modes. Known gaps are explicit and never hidden by a green build.
