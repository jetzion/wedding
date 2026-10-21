# Build Plan

Working plan for the next steps. The full roadmap is in `docs/SPEC.md` section 13.

## Done

- [x] Split project instructions (`CLAUDE.md`) from the product spec (`docs/SPEC.md`)
- [x] Choose the free stack: Next.js, Tailwind, Neon Postgres, Drizzle, Better Auth, Vercel Hobby, npm
- [x] Scaffold the Next.js app (lint, typecheck, build passing)
- [x] Create the GitHub repo and push
- [x] Coastal theme: color tokens, fonts, focus states, reduced motion, placeholder homepage

- [x] Florida white-sand beach theme with photo banners on every page
- [x] Wedding Q&A chat (OpenRouter), answers only from public wedding info

## Phase 1 — Foundation

### 1. Site shell
- [x] Header with the couple's names
- [x] Mobile menu
- [x] Navigation: Home, Our Story, Details, Travel, FAQ, RSVP
- [x] Footer
- [x] Placeholder pages for each section

### 2. Database (Neon + Drizzle)
- [x] Import the GitHub repo into Vercel (user)
- [x] Neon databases: `wedding-db` (Development), `neon-bole-zebra` (Preview + Production)
- [x] Pull the development connection settings locally (`.env.local`)
- [x] Add Drizzle and migrations (migrations run on every build)
- [x] Wedding settings table: names, date, timezone, RSVP deadline
- [ ] Wedding settings: venue and welcome message (add when needed)
- [x] Events table: ceremony and reception (unpublished placeholders)
- [x] Initial settings and events inserted by migration `0001`
- [x] Pages read settings from the database (cached, refresh hourly)

### 3. Admin login (Better Auth)
- [ ] Sign-in page
- [ ] Admin email allowlist, no public sign-up
- [ ] Protect everything under `/admin`

## Phase 2 — Public website

### 4. Homepage
- [ ] Names, date, venue from settings
- [ ] Countdown using the configured timezone
- [ ] Hero section and RSVP button

## Phase 3 — RSVP

- [x] Tables: households, guests (incl. plus-one slots), guest_events, rsvp_responses
- [x] Invitation codes (8 chars, stored hashed), rate-limited lookup and submit
- [x] Server-side validation: guests, event eligibility, plus-one names, deadline
- [x] RSVP form: per-guest per-event answers, dietary, accessibility, email, note
- [x] Review step, confirmation number, editable until the deadline
- [x] Unit tests for codes and validation (Vitest)
- [ ] Confirmation emails (needs email provider)
- [ ] Creating real invitations (needs admin dashboard; dev uses `npm run invite:test`)
- [ ] End-to-end tests with Playwright

## Open decisions

- [ ] Wedding date and start time (placeholder: 2027-08-14 5:00 PM Eastern) and venue (needed for step 4)
- [ ] Admin emails for Greg, Daniella, and the planner (placeholders in .env.example; needed for step 3)
- [x] Plus-one rules: guest names their +1 (docs/SPEC.md section 16)
- [x] RSVP unit: one person answers for the household (docs/SPEC.md section 16)
- [ ] RSVP deadline date (placeholder: 2027-06-01, Eastern)
- [x] Venue timezone: Eastern
- [ ] Email provider for confirmation emails (needed for Phase 4)
