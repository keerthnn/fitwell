# Product requirement documents

## Purpose

PRDs define what FitWell must do in observable, stack-independent terms. They are the binding product layer between product direction and engineering design.

## Structure

- [System qualities](system-qualities.md) owns cross-domain security, privacy, data-integrity, accessibility, reliability, and compatibility guarantees.
- [Domain PRDs](domains/README.md) partition user and administrator behavior by product domain.
- [PRD template](../templates/product-requirements-template.md) defines the required document structure.

## Authority

An active PRD has **binding product** authority. Draft domain documents define authoring responsibilities but do not assert implemented behavior until requirements are researched, reviewed, and activated.

PRDs own outcomes; SDDs own stack-specific mechanisms. A requirement should remain meaningful if FitWell changes framework, database, or identity provider.

## Responsibilities

The change author assigns stable IDs, identifies cross-domain qualities, and links implementing SDDs. Reviewers reject ambiguous, untestable, duplicated, or implementation-specific requirements. Keerthan K, the project owner, approves activation and material requirement changes.

## Lifecycle

Add or amend requirements through an approved workflow, preserve retired IDs, synchronize implementing SDDs and tests, and update `last_verified` only after comparing the contract with evidence.
