# FitWell Page Design Specification

**Status:** Design source of truth  
**Coverage:** Every public, member, onboarding, and administrator page in Version 1  
**Companion product specification:** [FitWell V1 Current-State Specification and Delivery Plan](FITWELL_V1_SPEC_PLAN.md)

## 1. Design direction

FitWell should feel focused, energetic, and calm enough to use during a workout. The interface uses strong hierarchy, generous spacing, clear progress cues, and restrained fitness imagery. Pages should help a user make one primary decision at a time.

### 1.1 Experience principles

1. **Training first:** The most likely next workout action is visually dominant.
2. **Useful at a glance:** Status, recent progress, plan prescription, and set completion should be readable without opening secondary UI.
3. **Safe changes:** Destructive and irreversible actions always use confirmation and plain-language consequences.
4. **Mobile ready:** Core workout actions remain reachable with one hand and never sit under the mobile bottom navigation.
5. **Honest states:** Loading, empty, error, saving, disabled, archived, and completed states are designed explicitly.
6. **Consistent surfaces:** Cards summarize or navigate; bordered panels contain forms and detail; dialogs confirm focused decisions.

## 2. Shared visual system

### 2.1 Color roles

| Role | Use |
| --- | --- |
| Primary | Start, save, continue, complete, active navigation, progress. |
| Secondary/tonal | Supporting actions, selected filters, lightweight emphasis. |
| Success | Completed workouts, successful saves, restored items. |
| Warning | In-progress or paused state, rest timer, account-deletion warning. |
| Error | Failed requests, invalid fields, archive/delete/disable confirmation. |
| Neutral surfaces | Page background, cards, outlined content panels, dividers. |

Both light and dark themes use the same semantic roles. Text and controls must meet WCAG AA contrast. Imagery should sit on a neutral or subtly tinted surface rather than compete with text.

### 2.2 Typography

| Style | Use |
| --- | --- |
| Display/H1 | Landing-page promise only. |
| H4/H5 | Page title and major detail title. |
| H6 | Card groups, form steps, section headings. |
| Subtitle | Entity names, workout exercises, important list rows. |
| Body | Descriptions and instructional copy. |
| Caption | Metadata, dates, units, secondary status. |

Page titles use a bold weight. Body text remains sentence case. Avoid all-caps except compact enum/status labels after transforming them into readable words.

### 2.3 Spacing and sizing

- Desktop content maximum: approximately 1,280–1,440 px with 32–40 px page gutters.
- Tablet gutters: 24 px.
- Mobile gutters: 16 px.
- Section spacing: 24–32 px.
- Card/panel padding: 20–32 px desktop, 16–20 px mobile.
- Minimum interactive target: 44 × 44 px.
- Form fields: full width on mobile; related fields may share rows from tablet upward.
- Main mobile content includes bottom padding for the fixed navigation and rest-timer surface.

### 2.4 Shared components

| Component | Design contract |
| --- | --- |
| Page header | Title, one-sentence description, optional primary action; action stacks below title on narrow screens. |
| Section header | Short title and optional navigation/action aligned to the opposite edge. |
| Stat card | Label, large value, optional supporting text/icon; never acts as decoration only. |
| Entity card | Image/thumbnail, name, two or three metadata facts, status, and one clear navigation affordance. |
| Filter toolbar | Search first, then the most useful filters; horizontal desktop, stacked or scrollable mobile. |
| Empty state | Explains why the section is empty and offers a relevant next action when possible. |
| Error state | Plain-language failure message and retry where retry is safe. |
| Loading state | Centered progress indicator with an accessible label; retain surrounding page chrome. |
| Confirmation dialog | Names the entity/action, states the consequence, and uses explicit cancel/confirm labels. |
| Status chip | Compact semantic state such as Draft, In progress, Completed, Built-in, Archived, or Disabled. |
| FitWell image | Fixed aspect ratio, `object-fit: contain`, meaningful alt text, deterministic fallback. |
| Hero surface | The single dominant page region; stronger elevation, semantic/primary accent, and more generous spacing than surrounding cards or panels. Used for active workouts and major detail introductions. |

### 2.5 Workout-specific imagery

Workout Plans retain their workout-specific cover images. A supplied cover image is the first choice; built-in plans then resolve to the matching plan artwork, followed by a representative exercise, a category workout image, and finally the general strength fallback.

The same deterministic image resolution must appear on member plan cards/lists/details, administrator plan lists, and workout summaries. Do not replace a workout image with an abstract category icon when workout-specific artwork is available.

## 3. Application shells

### 3.1 Public shell

Desktop:

- Compact top bar with FitWell wordmark at left.
- Sign in and Get started actions at right.
- Centered content region with no member sidebar.
- Landing page may use a wider hero; auth pages use a focused two-column or centered panel.

Mobile:

- Wordmark and one primary auth action in a compact top bar.
- Auth forms use a single column with full-width controls.
- Decorative imagery may be hidden if it pushes the form below the fold.

### 3.2 Member shell

Desktop:

- Collapsible left sidebar with FitWell brand, primary navigation, Start workout shortcut, theme control, and profile/account access.
- Main content scrolls independently and uses a consistent maximum width.
- Active route has a clear filled/tonal navigation state.

Mobile:

- Compact top app bar where a page needs context or utility actions.
- Fixed bottom navigation for Dashboard, Workouts, Plans, and More.
- More drawer contains Exercises, Analytics, Profile, Settings, theme, and sign-out access.
- Floating rest timer sits above the bottom navigation.

### 3.3 Onboarding shell

- Full-height neutral background with a centered setup panel.
- FitWell brand and setup title above the form.
- No member navigation until onboarding is complete.
- Form may be one long responsive page in Version 1; a progress stepper is optional only if the form is later split.

### 3.4 Administrator shell

Desktop:

- Dark/high-contrast collapsible sidebar labeled FitWell Admin.
- Overview, Users, Exercises, Workout Plans, Workouts, Analytics, Admin access, Audit logs, and Settings navigation.
- Back to FitWell action pinned at sidebar bottom.
- Wide data workspace with page header and list/form panel.

Mobile:

- Admin app bar with menu, title, and theme selector.
- Drawer contains all admin routes and Back to FitWell.
- Tables become stacked data rows/cards; primary and destructive actions remain labeled.

## 4. Page inventory

| Audience | Count | Routes |
| --- | ---: | --- |
| Public | 4 | Landing, sign in, sign up, forgot password. |
| Onboarding/member | 17 | Onboarding, dashboard, exercises, analytics, profile/settings, workouts, plans. |
| Administrator | 14 | Overview, users, exercises, plans, workouts, analytics, access, audit, settings. |
| Total | 35 | All current Pages Router screens excluding framework pages. |

## 5. Public page designs

### PUB-01 — Landing page (`/`)

**Purpose:** Explain the product and move visitors toward account creation or sign-in.

**Desktop composition:**

1. Public navigation with wordmark, Sign in, and Get started.
2. Two-column hero: headline, short value statement, primary Get started and secondary Sign in; workout/product preview card on the right.
3. Three benefit cards: focused workout logging, useful progress, ready-to-train plans.
4. Compact closing call to action.

**Mobile:** Stack hero copy before preview; benefit cards become one column; keep Get started full width.

**States:** If already authenticated, redirect after auth state resolves; show a small loading state instead of flashing visitor CTAs.

### PUB-02 — Sign in (`/auth/sign-in`)

**Purpose:** Return a member to FitWell with minimum friction.

**Composition:**

- Focused auth panel with title, welcome copy, email, password, Forgot password link, and primary Sign in button.
- Google sign-in is separated with a visible divider and secondary button.
- Footer prompt links to Sign up.
- Optional brand/benefit panel appears beside the form on wide screens.

**States:** Field validation, authentication error alert, submitting button label, Firebase-not-configured message, and authenticated redirect loading.

**Accessibility:** Password has a clear label; errors are announced; Enter submits; focus moves to the error summary after a failed request.

### PUB-03 — Sign up (`/auth/sign-up`)

**Purpose:** Create a Firebase account and continue to onboarding.

**Composition:** Match sign-in structure. Include email, password, confirmation/help copy, primary Create account, Google option, and link to Sign in.

**States:** Invalid email, weak password, duplicate email, password mismatch if confirmation is retained, submitting, successful authentication redirect.

**Mobile:** Single-column full-width form; social sign-up remains a secondary action.

### PUB-04 — Forgot password (`/auth/forgot-password`)

**Purpose:** Request a password-reset email without exposing account existence.

**Composition:** Narrow centered panel with Back to sign in, title, explanation, email field, and Send reset link button.

**Success state:** Replace or top the form with a calm success alert explaining to check email and spam folders; retain Back to sign in.

**Error state:** Generic retryable message that does not reveal whether an email is registered.

## 6. Onboarding and account page designs

### MEM-01 — Onboarding (`/onboarding`)

**Purpose:** Create the profile required for a useful dashboard.

**Composition:**

1. Setup heading and short reassurance.
2. Identity group: first name, last name, optional gender, optional date of birth.
3. Body metrics group: height, current weight, unit system.
4. Training group: fitness goal, experience, workouts/week, typical duration.
5. Primary Complete setup button; no destructive or skip action in Version 1.

**Desktop:** Centered 760–900 px panel; pairs of related fields share rows.

**Mobile:** One field per row; sticky submit is optional, but must not cover the last field.

**States:** Inline validation, form-level save error, saving label, existing completed profile redirect.

### MEM-02 — Profile (`/profile`)

**Purpose:** Summarize the member's identity and training preferences.

**Composition:** Page header with Edit profile. Main profile panel includes name, goal, experience, units, weekly target, typical duration, and optional body metrics. Use two-column definition rows on desktop and stacked label/value pairs on mobile.

**Empty/incomplete state:** Explain that onboarding is incomplete and offer Complete onboarding.

**Privacy:** Do not over-emphasize body values or display calculated medical classifications.

### MEM-03 — Edit profile (`/profile/edit`)

**Purpose:** Update profile and preferences.

**Composition:** Page header with Back to profile; bordered form panel using the onboarding field groups; Save changes primary action and Cancel secondary action.

**Behavior:** Switching units changes displayed values while retaining canonical metric storage. Preserve user input after server errors.

### MEM-04 — Settings (`/settings`)

**Purpose:** Control appearance, session, and account lifecycle.

**Composition:**

1. Appearance panel with Light, Dark, and System theme selector.
2. Session panel with signed-in email (when available) and Sign out.
3. Danger zone separated by divider and warning surface, explaining local deletion and preserved Firebase identity.
4. Delete application account opens explicit confirmation dialog.

**Mobile:** Panels stack; danger action remains visually secondary until confirmation.

## 7. Member home, discovery, and analytics designs

### MEM-05 — Dashboard (`/dashboard`)

**Purpose:** Answer “What should I do next?” and “How is training going?”

**Desktop composition:**

1. Greeting header with Start workout primary action.
2. Active workout banner when present, with Resume and contextual metadata.
3. Four-card progress row: workouts this week, weekly target/progress, current streak, total training time or completed workouts.
4. Recent workouts section, five items maximum, with View all.
5. Two-column lower area: Saved plans and Frequent exercises.

**Mobile:** Active workout first; stats become a two-column grid; horizontal card rows are allowed only with visible scroll affordance, otherwise stack.

**Empty state:** New members see a strong Start first workout action and a secondary Browse plans path instead of empty metric decoration.

### MEM-06 — Exercise catalogue (`/exercises`)

**Purpose:** Find an exercise and optionally start training from it.

**Composition:** Page header with Start empty workout. Filter toolbar contains search, equipment, muscle group, and movement. Results use an image-led responsive card grid.

**Exercise card:** Illustration, exercise name, primary muscle, equipment, movement/tracking context, and Start workout icon/button. Whole-card navigation should be added only if an exercise detail page exists.

**Desktop:** Four or three cards per row depending on width. **Tablet:** two. **Mobile:** one or compact two-column cards only when labels remain readable.

**States:** Debounced loading, no-results state with Clear filters, catalogue failure with Retry, per-card starting state.

### MEM-07 — Analytics (`/analytics`)

**Purpose:** Show workout progress for a clear date range.

**Composition:**

1. Header with range label/control.
2. Four stat cards: completed workouts, duration, volume, exercises performed.
3. Two-column chart/list row for workout frequency and muscle distribution.
4. Personal bests panel with exercise and best weight.
5. Workout Plan usage panel.

**Current-version note:** Until frequency, personal bests, range controls, and accurate streak are implemented, omit empty placeholders and show only truthful metrics.

**Mobile:** Stats use two columns; charts/lists stack; values respect metric/imperial preference.

## 8. Workout page designs

### MEM-08 — Workout history (`/workouts`)

**Purpose:** Browse drafts, active sessions, and completed workouts.

**Composition:** Header with Start workout. Search and status filter below. Workout cards/rows include representative image, name, date, status, entry mode, duration, exercise count, and source-plan context.

**Desktop:** Dense but spacious list or two-column cards. **Mobile:** One card per row with the full card as the view action; destructive actions live behind a clearly labeled menu/dialog.

**States:** Loading, filtered no results, first-workout empty state, error, delete-in-progress, pagination/loading-more.

### MEM-09 — Start workout (`/workouts/create`)

**Purpose:** Create a live workout with optional exercises.

**Composition:**

1. Header with secondary Choose a Workout Plan.
2. Session details: name and date.
3. Exercise picker with search/filter results and selected-exercise summary.
4. Sticky or clearly separated review footer stating selected count.
5. Primary Start workout/Start empty workout action.

**Desktop:** Form panel with picker taking the widest area. **Mobile:** Selected items appear before the searchable catalogue so the member can review/remove them quickly.

### MEM-10 — Quick entry (`/workouts/quick-entry`)

**Purpose:** Add a past workout efficiently.

**Composition:** Narrow form with workout name, date, duration, and Create quick entry. Follow creation with the edit page for exercises/sets.

**Design requirement:** Copy must state whether the result is a draft and what action completes it. If the product changes to complete-on-submit, add a review checkbox/summary and explicit Save completed workout label.

### MEM-11 — Live workout (`/workouts/live/[id]`)

**Purpose:** Record sets with minimal distraction during training.

**Desktop composition:**

1. Compact sticky session header: workout name, elapsed/session state, Pause, Complete.
2. Save-status info line (Saved, Saving, Retry needed).
3. Vertical exercise panels with image, exercise metadata, notes, and set editor.
4. Add exercise action between/after panels.
5. Floating global rest timer.

**Mobile:** Session actions remain sticky at top or bottom above navigation; set rows may scroll horizontally only if labels stay pinned, otherwise use a stacked two-row set layout. Complete requires confirmation if incomplete data will be ignored.

**States:** Loading, not found, ownership rejection, saving, save failure, paused redirect, no exercises, cannot-complete error.

### MEM-12 — Workout detail (`/workouts/[id]`)

**Purpose:** Review a workout and choose a follow-up action.

**Composition:**

1. Header with name, date/status, and Edit workout when allowed.
2. Summary strip: entry mode, duration, exercise count, source plan.
3. Contextual action row: Resume for drafts, continue for active, Duplicate for completed, Delete secondary/destructive.
4. Exercise cards with image, equipment/muscle, completed set summary, and notes.
5. Workout notes panel.

**Mobile:** Summary wraps into two columns; actions stack or use one primary plus overflow.

### MEM-13 — Edit workout (`/workouts/[id]/edit`)

**Purpose:** Correct metadata and exercise/set records.

**Composition:** Header and status context; metadata panel for name/date/duration/notes; exercise editor list; Add exercise; Save changes. Deleting the workout is visually separated below the edit form.

**Behavior:** Completed-workout editing rules must be explicit. Unsaved changes should warn before navigation once dirty-state handling exists.

## 9. Workout Plan page designs

### MEM-14 — Workout Plan library (`/workout-plans`)

**Purpose:** Discover built-in programmes and manage private plans.

**Composition:** Header with Create Workout Plan. Search/filter toolbar. Featured built-in plans may lead; private plans follow in a separate section or clear owner chip. Cards show cover, name, difficulty, category, days/week, exercise count, and built-in/private status.

**Mobile:** One card per row with compact metadata chips. Archived plans appear only in a recovery filter/view.

### MEM-15 — Workout Plan detail (`/workout-plans/[id]`)

**Purpose:** Understand a plan before starting or copying it.

**Composition:**

1. Header with plan name and Edit plan only for owner-created plans.
2. Hero panel: cover image, difficulty/category/built-in chips, description, days/week, exercise count, total sets.
3. Primary Start workout and secondary Duplicate plan.
4. Ordered exercise prescription list showing image, muscle/equipment, sets, rep range, and rest.
5. Archive action for owned plans in a separate management area.

**Mobile:** Hero stacks image above copy; actions become full-width; prescription rows use compact image and two-line metadata.

### MEM-16 — Create Workout Plan (`/workout-plans/create`)

**Purpose:** Build a reusable private programme.

**Composition:** Three explicit form steps on one page: Plan basics, Schedule and level, Build the workout. Selected exercises are ordered and each exposes sets, rep range, and rest prescription. Review footer shows configured exercise count and Create Workout Plan.

**Mobile:** Exercise prescription cards stack; move up/down buttons replace drag-only ordering; keep Save action after the full review.

### MEM-17 — Edit Workout Plan (`/workout-plans/[id]/edit`)

**Purpose:** Change an owned private plan without affecting historical workout records.

**Composition:** Same form as create with populated values, Save Workout Plan, Cancel/back, and archive action outside the main form. Built-in plans must never expose this member edit route.

## 10. Administrator page designs

### ADM-01 — Admin overview (`/system-admin`)

**Purpose:** Show system health and direct the administrator to the most common management areas.

**Composition:** Header; four stat cards for active users, workouts, active exercises, built-in plans; quick-management cards linking to Users, Exercises, Plans, and Audit logs. Avoid decorative charts until meaningful data exists.

**Mobile:** Two-column stats, then single-column quick links.

### ADM-02 — Users (`/system-admin/users`)

**Purpose:** Find and inspect local application accounts.

**Composition:** Header; search/status filter toolbar; data list with display name, email, account state, workout count, plan count, and View action. Disabled/deleted rows use status chips but remain readable.

**Desktop:** Table-like aligned rows. **Mobile:** Stacked cards with key counts and View details.

### ADM-03 — User detail (`/system-admin/users/[id]`)

**Purpose:** Review account identity/state and perform lifecycle actions.

**Composition:** Header with display name/email and status. Detail panel for identifiers and dates where available. Activity summary for workout/plan counts. Action panel provides Disable or Restore. Danger zone provides Delete application data with confirmation.

**Safety:** Show why an action is disabled; never expose Firebase credentials or tokens.

### ADM-04 — Exercises (`/system-admin/exercises`)

**Purpose:** Manage the global movement catalogue.

**Composition:** Header with New exercise. Search, active status, equipment, muscle, and movement filters. Rows/cards show thumbnail, name, category, equipment, tracking type, and Active/Archived state; edit is the primary row action.

### ADM-05 — New exercise (`/system-admin/exercises/new`)

**Purpose:** Add a validated catalogue exercise.

**Composition:** Form groups for identity, classification, tracking, muscles, description/instructions, and approved local image paths. Primary Create exercise, secondary Cancel.

**Validation:** Duplicate name/equipment, required enum values, text limits, and asset-path failures should be shown next to their fields.

### ADM-06 — Edit exercise (`/system-admin/exercises/[id]`)

**Purpose:** Update or change availability of a catalogue entry.

**Composition:** Same form as create with Save changes. Archive/Restore action sits in a separate lifecycle panel with impact copy explaining member visibility and historical references.

### ADM-07 — Built-in Workout Plans (`/system-admin/workout-plans`)

**Purpose:** Manage global plans visible to members.

**Composition:** Header with New built-in plan; search/status filters; image-led rows/cards with name, difficulty, category, days/week, exercise count, featured/archived chips, and Edit action.

### ADM-08 — New built-in plan (`/system-admin/workout-plans/new`)

**Purpose:** Publish a structured programme backed by active exercises.

**Composition:** Reuse the member plan builder with an admin context banner, built-in ownership explanation, and Create built-in Workout Plan label. If featured status is supported in UI later, place it in a Publishing group rather than basics.

### ADM-09 — Edit built-in plan (`/system-admin/workout-plans/[id]`)

**Purpose:** Update global plan metadata/prescriptions or archive/restore it.

**Composition:** Populated plan builder, Save changes, and separate availability panel. Warn that new starts use updated prescriptions while historical workouts retain copied data.

### ADM-10 — Workouts (`/system-admin/workouts`)

**Purpose:** Inspect and remove problematic workout records across users.

**Composition:** Header; search, status, entry-mode, and user filters; rows with workout name, member, status, exercise count, and date. View detail is preferred; Delete remains a labeled destructive action with confirmation.

**Mobile:** Member email and workout name occupy separate lines; deletion cannot be icon-only.

### ADM-11 — Analytics (`/system-admin/analytics`)

**Purpose:** Show a small, truthful system activity summary.

**Composition:** Header with clear range label; stat cards for completed workouts, active users, and duration. Add trends only when historical series and range controls exist.

### ADM-12 — Admin access (`/system-admin/admin-access`)

**Purpose:** Grant or revoke administrative permission safely.

**Composition:** Header and strong security explanation. Grant panel accepts a validated user identifier and explains the effect. Current-admin list shows name, email, account state, grant metadata if available, and Remove access.

**Safety:** Last-active-admin removal is disabled/rejected with clear copy; removing yourself requires explicit confirmation.

### ADM-13 — Audit logs (`/system-admin/audit-logs`)

**Purpose:** Review sensitive administrative changes.

**Composition:** Header; filters for action, entity, administrator, and date when implemented; reverse-chronological rows with readable action label, target entity/ID, actor, and timestamp. Expandable metadata is allowed only after sensitive-field filtering.

**Mobile:** Timeline-like stacked rows; timestamp and actor remain visible without expansion.

### ADM-14 — Admin settings (`/system-admin/settings`)

**Purpose:** Explain environment-level configuration until editable settings exist.

**Composition:** Header; informational panel stating that authentication, database, seeds, and admin bootstrap are environment-managed. Include no controls that imply persistence. Link to internal setup documentation where appropriate.

## 11. Cross-page state design

### 11.1 Loading

- Keep page title/shell visible.
- Use one main loading indicator per page, not one spinner per empty card.
- For mutations, disable only conflicting actions and change the button label to an active verb such as Saving… or Starting….

### 11.2 Empty

| Context | Message intent | Primary action |
| --- | --- | --- |
| No workouts ever | Encourage first useful action. | Start workout. |
| Workout filters empty | Explain filters caused it. | Clear filters. |
| No private plans | Explain built-in plans remain available. | Create Workout Plan. |
| No analytics data | Explain metrics appear after completion. | Start workout. |
| No admin results | State no records match. | Clear filters, not create unless appropriate. |

### 11.3 Error

- Page-read failure: error panel with Retry.
- Mutation failure: alert close to the initiating control and preserved input.
- Validation failure: field message plus form-level summary for long forms.
- Authorization failure: route away from protected UI after showing a short, non-sensitive explanation.
- Not found: distinguish unavailable/archived from wrong-owner only where doing so does not leak private data.

### 11.4 Confirmation language

| Action | Confirm label | Required consequence copy |
| --- | --- | --- |
| Delete workout | Delete workout | Permanently removes this workout and its sets. |
| Archive plan/exercise | Archive | Hides it from normal member discovery; historical records remain. |
| Disable user | Disable account | Blocks local application access without deleting Firebase identity. |
| Delete account data | Delete application account | Removes owned local data and leaves a disabled tombstone; Firebase identity remains. |
| Remove admin | Remove access | Removes administrator capabilities immediately. |

## 12. Responsive acceptance matrix

Every page must be checked at these representative widths:

| Viewport | Expected behavior |
| --- | --- |
| 360 px phone | No horizontal page overflow; forms single column; fixed navigation/timer do not cover actions. |
| 768 px tablet | Two-column cards/forms where readable; drawers and filters remain usable. |
| 1,024 px small desktop | Desktop shell active; content does not collide with sidebar. |
| 1,440 px desktop | Content respects maximum width and does not become excessively sparse. |

Also verify light/dark theme, 200% browser zoom, keyboard-only navigation, long names/emails, empty data, and server-error states.

## 13. Design completion checklist

A page design is ready for implementation when:

- its purpose and primary action are unambiguous;
- every API state has a visible UI state;
- desktop and mobile composition are specified;
- ownership/role restrictions are reflected without relying on hidden controls alone;
- destructive actions use confirmation and consequence copy;
- labels include units and readable status terms;
- keyboard focus order and minimum target size are supported;
- it reuses the shared shell/components unless a documented need requires a new pattern.
