# Review checklist

Authority: **Engineering guidance**

Apply the portions proportional to the change.

## Contract

- Is the intended outcome stated and testable?
- Are affected PRDs, system qualities, SDDs, and decisions identified?
- Does implementation match the approved contract without undocumented behavior?

## Security and data

- Are user-scoped routes authenticated and ownership-scoped?
- Are admin routes authorized server-side?
- Are client-supplied identifiers treated as input rather than authority?
- Are deletion, cascade, retention, and migration effects deliberate?
- Are secrets, tokens, cookies, and database URLs absent from code and documentation?

## Implementation

- Does code follow existing project and domain boundaries?
- Are API inputs validated and errors intentional?
- Are loading, empty, error, and success states covered for UI work?
- Are accessibility and responsive behavior considered?

## Evidence

- Do tests cover the relevant requirement IDs and failure paths?
- Were the checks required by the verification matrix run?
- Are environment-dependent claims verified rather than guessed?
- Is the documentation-sync result explicit?

## Full SDD

- Are Clarify, Proposal, Design, Tasks, and Verification complete and in order?
- Were canonical documents synchronized before Archive?
- Does the archive contain evidence rather than the only copy of a lasting rule?
