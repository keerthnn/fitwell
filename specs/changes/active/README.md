# Active changes

## Purpose

This directory contains Full SDD work that has not completed Verification and Archive. It intentionally contains no Lightweight tasks.

## Creating a package

1. Confirm a Full SDD trigger from the engineering workflow.
2. Create `YYYY-MM-DD-semantic-change-name/` using the opening date.
3. Copy `clarify.md` first.
4. Add Proposal, Design, Tasks, and Verification only as the workflow reaches those phases.
5. Keep the same change ID and title in every artifact.

## Active-state rules

- Do not merge Clarify and Proposal.
- Do not write detailed design before Proposal approval.
- Do not implement before Design and Tasks approval.
- Keep tasks current during Implementation.
- Return to and re-approve an earlier artifact when scope or design changes.
- Do not leave completed packages active.
- Do not use this folder as the canonical source of lasting requirements or architecture.

## Review

An active package should make its current phase, unresolved blockers, next gate, and affected canonical documents obvious. Stale packages are either resumed, explicitly closed with rationale, or archived only after satisfying the normal gate.
