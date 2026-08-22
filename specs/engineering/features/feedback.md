---
id: sdd-feedback
title: Feedback
status: active
authority: engineering
requirements: [FEEDBACK-001, FEEDBACK-002, FEEDBACK-003, FEEDBACK-004, FEEDBACK-005, FEEDBACK-006, FEEDBACK-007, FEEDBACK-008, FEEDBACK-009, FEEDBACK-010, SEC-002, DATA-002]
decisions: [ADR-0004, ADR-0005, ADR-0006]
code: [src/pages/feedback/, src/components/feedback/, src/pages/api/feedback/, src/pages/api/admin/feedback/, src/lib/api/validators/feedback.ts]
tests: []
last_verified: 2026-08-15
---

# Feedback

## Scope and goals

The feedback feature gives an authenticated member a private conversation with administrators. It covers creation, owner-scoped discovery and reading, member and administrator replies, administrator closure, and the narrow member-delete rule. It is not a public forum, notification system, attachment service, or general support platform.

## User flows

1. A member opens `/feedback`, filters their conversations, or creates one with a category, subject, and initial message.
2. Creation writes the conversation and first `USER` message atomically, then opens the thread.
3. The owner reads messages chronologically and may reply unless the conversation is `CLOSED`; a member reply returns status to `OPEN`.
4. The member may delete the conversation only before any `ADMIN` message exists.
5. An administrator lists all conversations, replies, and may close one. Reply sets `RESPONDED`; close sets `CLOSED`.

## Component responsibilities

- `src/pages/feedback/index.tsx` coordinates member listing, filters, cursor loading, and creation.
- `src/pages/feedback/[id].tsx` coordinates thread reading, replies, and deletion.
- Components under `src/components/feedback/` own focused form, filter, list, thread, and reply presentation.
- Member handlers enforce ownership; administrator handlers enforce database-backed administrator access across owners.

## API and database usage

The member UI uses `/api/feedback/create`, `/list`, `/get-by-id`, `/reply`, and `/delete`; administration uses matching `/api/admin/feedback` routes. `Feedback` is the aggregate root and `FeedbackMessage` rows are children. `lastMessageAt` drives newest-first listing. Administrator replies and closes append audit records.

## Failure handling and security

Handlers reject unsupported methods, invalid authentication, malformed category/subject/content, inaccessible conversations, replies to closed conversations, and deletion after an administrator response. Member reads and writes include authenticated `userId`; inaccessible records appear not found. Administrator routes use `requireAdmin`. Unexpected persistence failures do not expose internals.

## Edge cases and current limits

- Subjects are limited to 120 characters and messages to 4,000 characters.
- Pagination uses bounded cursor queries ordered by `lastMessageAt` and identifier.
- Delete rechecks the absence of administrator messages during deletion to address a reply/delete race.
- Closing is repeat-safe; already closed returns success without another audit record.
- No attachments, notifications, unread state, assignment, or automated tests are implemented.

## Code map

| Concern | Implementation |
| --- | --- |
| Member pages | `src/pages/feedback/index.tsx`, `src/pages/feedback/[id].tsx` |
| Reusable UI | `src/components/feedback/` |
| Member API | `src/pages/api/feedback/` |
| Administrator API | `src/pages/api/admin/feedback/` |
| Validation | `src/lib/api/validators/feedback.ts` |
| Persistence | `prisma/schema.prisma` (`Feedback`, `FeedbackMessage`) |

## Related requirements

This design implements [FEEDBACK-001 through FEEDBACK-010](../../prds/domains/feedback.md) and relies on [SEC-002 and DATA-002](../../prds/system-qualities.md).
