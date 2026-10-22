# Build Plan

Working plan for the next steps. The full roadmap is in `docs/SPEC.md` section 13.

## Next steps

Status 2026-10-22: the public site, RSVP by name, personal invitation pages, and the admin dashboard (with an activity log) are live at https://greg-daniella.vercel.app. Wedding Details, Travel, and FAQ are still "Coming soon" pages, and the date, venue, and deadline are placeholders.

Ready to build now:

1. End-to-end test of admin sign-in and change password. Approach used for manual checks so far: a production build on port 3100 with temporary `ADMIN_EMAILS=admin-test@example.com` and a throwaway `ADMIN_SETUP_CODE`, deleting the test account afterwards.

Open questions for Jack:

- The invitation background (`src/assets/invitation-background.jpg`) is shaped for desktop; on phones the card is much taller, so its sides (gold frame, most palms) are cropped. Options: keep, stretch, or supply a phone-shaped version (about 1:2.4) to show on phones.
- `src/assets/page-faq-original.jpg` (13 MB full-size original) was committed in `3c06f2b`, although originals are meant to stay out of git. Untrack it?

Waiting on the couple:

2. Real wedding date, start time, venue, city, dress code, and RSVP deadline, for the home page and the invitation page placeholders.
3. Content for Our Story (about 50 `[bracketed]` placeholders in `src/content/story.ts`), Wedding Details, Travel, and FAQ.
4. Confirm the source and license of the photos for the README credits: RSVP (Maldives seaside resort), the Wedding Details, Travel, and FAQ photos added 2026-10-21, and the invitation's watercolor background added 2026-10-22. The Our Story banner and engagement photos are the couple's own.
5. Remove the placeholder invitations (migrations `0008` and `0009`) and enter the real ones in admin, then share each household's invitation link (on hold: keeping the placeholders for testing for now). Check the spelling "Mark Grafinkel": guests must type their name exactly, and couples sharing a last name are greeted "Susan and Mark Garfinkel" only if the spellings match.
6. Admins: `ADMIN_EMAILS` in production is `jack@etzion.us,daniella@etzion.us` (set and redeployed 2026-10-21); Daniella still needs to sign up at `/admin/setup` (not yet confirmed). Add Greg and the planner once their emails are known.
7. Choose an email provider; send RSVP confirmation emails (and, if wanted, email each household its invitation link).

## Invitation page (done, live since `24435b4`)

A personal invitation for each household at `greg-daniella.vercel.app/invitation/[link name]`, addressed to the invitation's name (for example "The Etzion Family"). It matches the site: beach photo behind a card with a watercolor background (palms, ocean, white sand, gold frame; `invitation-background.jpg`, since `fac5f99`), Cormorant serif headings, gold dividers, sea-blue buttons. Anything the couple has not confirmed is shown as a `[bracketed]` placeholder, as on Our Story.

### Decisions (2026-10-21)

1. **Links are the invitation name plus a short random code**, such as `/invitation/the-etzion-family-k7m2qx`. They stay readable but can't be guessed, which follows the spec's unpredictable-token rule.
2. **Greeting** (changed 2026-10-21 from "invitation name only"): one guest by full name ("Jane Doe"), two by both full names ("John Smith and Jane Doe"), or "John and Jane Smith" when they share a last name, three or more by the invitation name plus "Family" ("The Smiths" becomes "Dear The Smiths Family,"; a name already ending in "Family", such as "The Smith Family", is not repeated); a plus-one slot adds "and Guest" to one or two names. No titles (`src/lib/invitation-greeting.ts`). No RSVP answers, dietary notes, or contact email.
3. **The RSVP button goes to the normal `/rsvp` page**, where guests look themselves up by name. The link never opens a household's answers directly.

### Design (mobile first)

```
┌─────────────────────────────────────┐
│     (beach photo, full height)      │
│  ┌───────────────────────────────┐  │
│  │      YOU'RE INVITED           │  │  small caps, ink-muted
│  │                               │  │
│  │   Dear The Etzion Family,     │  │  serif, the greeting (see 2.)
│  │                               │  │
│  │   Daniella Etzion             │  │  serif, large (from settings)
│  │         &                     │  │
│  │   Greg Garfinkel              │  │
│  │                               │  │
│  │  request the pleasure of your │  │
│  │  company at their wedding     │  │
│  │           ─◆─                 │  │  gold divider
│  │   [Saturday, Month Day, Year] │  │
│  │   [Ceremony time]             │  │
│  │   [Venue name]                │  │
│  │   [City, Florida]             │  │
│  │   Dress code: [Dress code]    │  │
│  │           ────                │  │
│  │   Kindly reply by [Date]      │  │
│  │   [ RSVP ]  [ Details ]       │  │  primary + secondary buttons
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

- One photo behind the card, like the home page (not a slideshow), with the frosted card (`frostedPanel`) centered on top.
- Couple names come from `wedding_settings`. Date, time, venue, city, dress code and RSVP deadline stay as `[placeholders]` until the couple confirms them; the settings date is still a placeholder, so it is not shown here.
- Buttons: "RSVP" (to `/rsvp`), "Wedding details" (to `/details`), and a "Travel" text link.
- An unknown or removed link shows a generic message ("We couldn't find this invitation. Please check the link, or RSVP by name.") with an RSVP button, and never hints at which invitations exist.
- The page is `noindex`, and its browser tab title is "You're invited", without the household name.

### Build steps

1. [x] **Link names:** `src/lib/invitation-link.ts` (`linkSlug`, `newLinkName`, `normalizeLinkName`) turns a name into a URL-safe form ("The Etzion Family" becomes `the-etzion-family`: lowercase, accents removed, anything else becomes a hyphen), then adds a 6-character random code from an unambiguous 30-letter alphabet (no `0/o`, `1/l`), made with `crypto` (about 700 million combinations, too many to guess). Unit tests, including accents and punctuation (`Alex Rivera (Miami)`).
2. [x] **Database:** a unique, required `link_name` column on `households` (migration `0011`), filled in for existing invitations with a random code from `gen_random_uuid()`. New invitations (admin and `invite:test`) get one from `newLinkName()`; `invite:test` prints the link. A clash, about one in 729 million per name, would fail the insert with a unique-constraint error rather than reuse a link.
3. [x] **Admin** (`src/components/admin/invitation-link.tsx`):
   - New invitations get a link name automatically.
   - The edit page shows the link. Renaming an invitation keeps its link, so links already sent keep working.
   - A "New link" button (with a confirmation) replaces the code, so a leaked link can be revoked.
   - The dashboard shows each invitation's link with a "Copy link" button that copies the full address.
   - Development links: The Etzion Family is `/invitation/the-etzion-family-bhh69v`. Production drew its own random links when migration `0011` ran in the `24435b4` deploy; see them on the live admin dashboard.
4. [x] **Lookup:** server-only `getInvitationByLinkName()` (`src/lib/invitation-lookup.ts`) returns only the invitation name. It ignores case and outer spaces, rejects anything not shaped like a link (`isLinkName()`) before querying, and is not cached, so a replaced or deleted link stops working at once. A wrong or missing code is treated as not found.
5. [x] **Page:** `src/app/invitation/[linkName]/page.tsx`, reading `params` inside `<Suspense>` (Cache Components), plus the not-found card. Checked at phone, tablet, and desktop widths. Unknown links show the not-found card with status 200 (the page streams, so the status is sent before the lookup finishes).
6. [x] **Tests:**
   - Unit tests for the link names and link format (`src/lib/invitation-link.test.ts`); the lookup was checked against the development database.
   - `e2e/invitation-page.spec.ts` creates a fictional household ("The Playwright Household") in the development database and deletes it afterwards.
     - A two-guest household sharing a last name is greeted "Pat and Robin Playwright"; after a third guest is added, by the invitation name plus "Family". The page has the couple and an RSVP button to `/rsvp`.
     - The link works in capitals.
     - The tab title is "You're invited", and the page is `noindex`.
     - A missing or wrong code shows the generic message, and so does a replaced link.
7. [x] **Docs:** SPEC decision entry (section 16, "Personal invitation page"), README ("Invitations" section, admin links, photo credits), CLAUDE.md layout and commands.

## Done

- [x] Split project instructions (`CLAUDE.md`) from the product spec (`docs/SPEC.md`)
- [x] Choose the free stack: Next.js, Tailwind, Neon Postgres, Drizzle, Better Auth, Vercel Hobby, npm
- [x] Scaffold the Next.js app (lint, typecheck, build passing)
- [x] Create the GitHub repo and push
- [x] Coastal theme: color tokens, fonts, focus states, reduced motion, placeholder homepage

- [x] Florida white-sand beach theme with photo banners on every page
- [x] Darker `sand-edge` color for every line and outline (text boxes, dividers, answer buttons); cards outlined in it
- [x] Wedding Q&A chat (OpenRouter), answers only from public wedding info
- [x] RSVP banner replaced with a Maldives beach photo (resized to 2400×1600)
- [x] Neon agent skills added for coding agents (`.agents/skills/`, linked from `.claude/skills/`, pinned in `skills-lock.json`)
- [x] Page banners: photos twice as tall, with their lower half fading behind the page content; titles and text over photos sit on frosted sand panels (home page unchanged)
- [x] New banner photos for Wedding Details, Our Story, Travel, and FAQ (resized to about 2400px wide; full-size originals kept out of git)
- [x] Our Story: title panel moved down so it does not cover the couple's faces (`PageHero lowTitle`); "Meet the Couple" heading kept for screen readers only
- [x] Home hero: four beach photos, all centered (`object-center`)
- [x] RSVP: "Welcome / household name" sits on a frosted panel
- [x] Memory game: 10 wrong guesses allowed (`MAX_MISTAKES`)
- [x] Vercel auto-deploys from GitHub work again (every push since `045e1ec`, 2026-10-21)
- [x] Personal invitation pages at `/invitation/[link name]` with admin copy and replace (`24435b4`; see "Invitation page" below)
- [x] Invitation greetings by household size: one or two guests by name, couples sharing a last name as "John and Jane Smith", three or more as "[invitation name] Family" (`4c80701`)
- [x] Activity log of admin changes and exports at `/admin/activity` (`4c80701`)
- [x] RSVP-flow end-to-end test (`b82cff1`)
- [x] "Chat with us" hidden on admin pages (`ef14e77`)
- [x] "Chat with us" hidden on invitation pages too: on phones the floating button covered the invitation's date line, and the card's full-width text leaves no free corner. Guests get the chat after tapping RSVP or Wedding details
- [x] Invitation card decorated: watercolor stationery background and gold dividers (`54ba19b`, `fac5f99`)
- [x] Our Story: engagement photo 04 is The Proposal photo, cropped to keep faces (`Photo.position`), and left out of the engagement gallery (`47d8f1f`)
- [x] Engagement gallery as an even grid with full rows: tall photos one cell, wide photos two cells alternating sides, a wide last photo full width (`1bedbc0`)

## Phase 1 — Foundation

### 1. Site shell
- [x] Header with the couple's names
- [x] Mobile menu
- [x] Navigation: Home, Our Story, Wedding Details, Travel, FAQ, Game, RSVP
- [x] Footer
- [x] Placeholder pages for each section

### 2. Database (Neon + Drizzle)
- [x] Import the GitHub repo into Vercel (user)
- [x] Neon databases: `wedding-db` (Development), `neon-bole-zebra` (Preview + Production)
- [x] Pull the development connection settings locally (`.env.local`)
- [x] Add Drizzle and migrations (migrations run on every build)
- [x] Wedding settings table: names, date, timezone, RSVP deadline
- [ ] Wedding settings: venue and welcome message (add when needed)
- [x] Events table: one combined "Ceremony & Reception" event (unpublished placeholder; combined in migration `0007`)
- [x] Initial settings and events inserted by migration `0001`
- [x] Pages read settings from the database (cached, refresh hourly)

### 3. Admin login (Better Auth) — done
- [x] Sign-in page (`/admin/sign-in`), email and password, 12-character minimum
- [x] Admin email allowlist, no public sign-up (endpoint disabled); setup page (`/admin/setup`) gated by `ADMIN_SETUP_CODE`
- [x] Change password (`/admin/password`): current password required, signs out other devices; "Show password" checkboxes on sign-in, setup, and change password
- [x] Protect everything under `/admin`: `requireAdmin()` in every admin page and action
- [x] Production: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAILS` set in Vercel
- [x] Production: `ADMIN_SETUP_CODE` set; first admin account (jack@etzion.us) created. The setup code stays for adding admins later
- [x] Session check runs at request time only (`connection()`), so prerendering does not cut off the session query

## Admin dashboard

- [x] Invitation list at `/admin`: totals, each person with their status (attending, declined, awaiting response), dietary and accessibility notes, contact email, confirmation code, note
- [x] Create invitations at `/admin/invitations/new`: name, optional contact email, up to 6 people (first and last name required), optional plus-one; every guest is invited to every event
- [x] Delete invitations: "Delete" on each card opens a confirmation page; guests, event links, and RSVP answers go with it (cascade)
- [x] Edit invitations: name, email, rename people (keeps their RSVP answer), add people, remove people (explicit checkbox), plus-one slot on/off; a stale form changes nothing
- [x] Correct RSVP answers at `/admin/invitations/[id]/rsvp`: attending, declined, or awaiting (clears the answer) per guest and event, plus the plus-one's name; ignores the deadline; leaves the confirmation code and response date alone
- [x] Search (invitation, guest name, email) and filter by status on `/admin` via `?q=&status=`
- [x] CSV export at `/admin/export`: one row per guest; spreadsheet formulas defused
- [x] `/admin/invitations` redirects to `/admin`
- [x] Site nav reads the URL inside `<Suspense>`, so routes with dynamic params build
- [x] Audit records (`audit_log`, migration `0012`): adding, editing, and deleting invitations, new invitation links, RSVP corrections, and CSV exports, each saved in the same database batch as the change it records (the export record is saved before the download). Summaries hold invitation names and counts only. Listed newest first (latest 200) on the Activity page, `/admin/activity`, linked from the dashboard
- [x] "Chat with us" button hidden on admin and invitation pages (`GuestWeddingChat` checks the URL inside `<Suspense>`); `e2e/chat-button.spec.ts` checks guest pages, admin pages, invitation pages, and that it returns after leaving them

## Phase 2 — Public website

### 4. Homepage
- [ ] Names, date, venue from settings (next step 2)
- [x] Countdown under "Our Wedding": days, hours, minutes, seconds to the wedding date in settings (placeholder date until decided)
- [x] Hero section and RSVP button (four beach photos cross-fade every 6 seconds; reduced motion keeps the first)

### 5. Other pages
- [x] Our Story: sections, timeline, proposal photo, engagement gallery, and Q&A built; text is `[placeholder]` until the couple provides it (next step 3)
- [ ] Wedding Details, Travel, FAQ: "Coming soon" pages with banners; content needed (next step 3)
- [x] Game: engagement-photo memory game (10 wrong guesses allowed)
- [x] Personal invitation page at `/invitation/[link name]`; date, venue, and deadline are placeholders (next step 2)

## Phase 3 — RSVP

- [x] Tables: households, guests (incl. plus-one slots), guest_events, rsvp_responses
- [x] Lookup by first + last name with household picker (accepted risk in docs/SPEC.md section 16), rate-limited
- [x] Server-side validation: guests, event eligibility, plus-one names, deadline
- [x] RSVP form: per-guest per-event answers, dietary, accessibility, email, note
- [x] Review step, confirmation number, editable until the deadline
- [x] Unit tests for codes and validation (Vitest)
- [ ] Confirmation emails (needs email provider; next step 7)
- [x] Multi-person test invitation on the live site: "The Rivera Household" (Alex, Sam, Jordan Rivera), migration `0008`; remove before real invitations go out
- [x] Placeholder family invitations: "The Etzion Family" (Jack, Michelle, Ori Etzion) and "The Garfinkel Family" (Susan Garfinkel, Mark Grafinkel), migration `0009`, replacing the one-person placeholders from `0004`; remove before real invitations go out
- [ ] Enter the real invitations in admin (create and edit are ready; next step 5)
- [x] Playwright set up (`npm run test:e2e`): public pages load; home page countdown ticks; every admin page (including Activity and Change password) and the CSV export deny signed-out visitors; invitation page (fictional household, created and deleted by the test)
- [x] End-to-end: RSVP flow (`e2e/rsvp-flow.spec.ts`, fictional "The Rsvptest Household" created and deleted by the test): unknown and plus-one names get the generic message; missing answers are caught and nothing is saved; a full RSVP (attending with a dietary note, declining, named plus-one) is saved with a `GD-` code; coming back shows the code, prefills the answers, and keeps the code after a change
- [ ] End-to-end: admin sign-in and change password (next step 1)

## Open decisions

- [ ] Wedding date and start time (placeholder: 2027-08-14 5:00 PM Eastern) and venue (next step 2)
- [x] Countdown stays visible with the placeholder date until the real date is set (docs/SPEC.md section 16)
- [x] First admin: jack@etzion.us (production `ADMIN_EMAILS`)
- [x] Daniella added as an admin: daniella@etzion.us (production `ADMIN_EMAILS`, 2026-10-21)
- [ ] Admin emails for Greg and the planner (add to `ADMIN_EMAILS`, redeploy, sign up on `/admin/setup`; next step 6)
- [x] Plus-one rules: guest names their +1 (docs/SPEC.md section 16)
- [x] RSVP unit: one person answers for the household (docs/SPEC.md section 16)
- [ ] RSVP deadline date (placeholder: 2027-06-01, Eastern; next step 2)
- [x] Venue timezone: Eastern
- [x] Name order: Daniella first (docs/SPEC.md section 16)
- [x] RSVP events: one combined "Ceremony & Reception" (docs/SPEC.md section 16)
- [ ] Email provider for confirmation emails (next step 7)
- [ ] Spelling of "Mark Grafinkel" in the Garfinkel Family placeholder (guests must type their name exactly; next step 5)
