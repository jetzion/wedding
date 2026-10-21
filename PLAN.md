# Build Plan

Working plan for the next steps. The full roadmap is in `docs/SPEC.md` section 13.

## Next steps

In order:

1. Remove the placeholder invitations (migrations `0008` and `0009`) and enter the real ones in admin (on hold: keeping them for testing for now).
2. Real wedding date, venue, and RSVP deadline (open decisions below), then the homepage details and countdown.
3. Add Daniella, Greg, and the planner as admins once their emails are known.
4. Choose an email provider; send RSVP confirmation emails.
5. End-to-end tests with Playwright: RSVP flow and admin sign-in (signed-out access is covered).

## Done

- [x] Split project instructions (`CLAUDE.md`) from the product spec (`docs/SPEC.md`)
- [x] Choose the free stack: Next.js, Tailwind, Neon Postgres, Drizzle, Better Auth, Vercel Hobby, npm
- [x] Scaffold the Next.js app (lint, typecheck, build passing)
- [x] Create the GitHub repo and push
- [x] Coastal theme: color tokens, fonts, focus states, reduced motion, placeholder homepage

- [x] Florida white-sand beach theme with photo banners on every page
- [x] Darker `sand-edge` color for every line and outline (text boxes, dividers, answer buttons); cards outlined in it
- [x] Wedding Q&A chat (OpenRouter), answers only from public wedding info

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
- [ ] Audit records for deletions and RSVP corrections (docs/SPEC.md section 6)
- [ ] Optional: hide the "Chat with us" button on admin pages

## Phase 2 — Public website

### 4. Homepage
- [ ] Names, date, venue from settings
- [ ] Countdown using the configured timezone
- [x] Hero section and RSVP button (four beach photos cross-fade every 6 seconds; reduced motion keeps the first)

## Phase 3 — RSVP

- [x] Tables: households, guests (incl. plus-one slots), guest_events, rsvp_responses
- [x] Lookup by first + last name with household picker (accepted risk in docs/SPEC.md section 16), rate-limited
- [x] Server-side validation: guests, event eligibility, plus-one names, deadline
- [x] RSVP form: per-guest per-event answers, dietary, accessibility, email, note
- [x] Review step, confirmation number, editable until the deadline
- [x] Unit tests for codes and validation (Vitest)
- [ ] Confirmation emails (needs email provider)
- [x] Multi-person test invitation on the live site: "The Rivera Household" (Alex, Sam, Jordan Rivera), migration `0008`; remove before real invitations go out
- [x] Placeholder family invitations: "The Etzion Family" (Jack, Michelle, Ori Etzion) and "The Garfinkel Family" (Susan Garfinkel, Mark Grafinkel), migration `0009`, replacing the one-person placeholders from `0004`; remove before real invitations go out
- [ ] Enter the real invitations in admin (create and edit are ready)
- [x] Playwright set up (`npm run test:e2e`): public pages load; every admin page and the CSV export deny signed-out visitors
- [ ] End-to-end: RSVP flow with a fictional test household; admin sign-in

## Open decisions

- [ ] Wedding date and start time (placeholder: 2027-08-14 5:00 PM Eastern) and venue (needed for step 4)
- [x] First admin: jack@etzion.us (production `ADMIN_EMAILS`)
- [ ] Admin emails for Daniella, Greg, and the planner (add to `ADMIN_EMAILS`, redeploy, sign up on `/admin/setup`)
- [x] Plus-one rules: guest names their +1 (docs/SPEC.md section 16)
- [x] RSVP unit: one person answers for the household (docs/SPEC.md section 16)
- [ ] RSVP deadline date (placeholder: 2027-06-01, Eastern)
- [x] Venue timezone: Eastern
- [x] Name order: Daniella first (docs/SPEC.md section 16)
- [x] RSVP events: one combined "Ceremony & Reception" (docs/SPEC.md section 16)
- [ ] Email provider for confirmation emails (needed for Phase 4)
- [ ] Spelling of "Mark Grafinkel" in the Garfinkel Family placeholder (guests must type their name exactly)
