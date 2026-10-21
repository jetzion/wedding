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
- [ ] Import the GitHub repo into Vercel (user)
- [ ] Add Neon from Vercel's Storage tab (user)
- [ ] Pull the connection string locally
- [ ] Add Drizzle and migrations
- [ ] Wedding settings table: names, date, time, timezone, venue, welcome message, RSVP deadline
- [ ] Events table: ceremony, reception, and others
- [ ] Seed settings with the couple's names
- [ ] Pages read content from the database, not from code

### 3. Admin login (Better Auth)
- [ ] Sign-in page
- [ ] Admin email allowlist, no public sign-up
- [ ] Protect everything under `/admin`

## Phase 2 — Public website

### 4. Homepage
- [ ] Names, date, venue from settings
- [ ] Countdown using the configured timezone
- [ ] Hero section and RSVP button

## Open decisions

- [ ] Wedding date and start time (placeholder: 2027-08-14 5:00 PM Eastern) and venue (needed for step 4)
- [ ] Admin emails for Greg, Daniella, and the planner (placeholders in .env.example; needed for step 3)
- [x] Plus-one rules: guest names their +1 (docs/SPEC.md section 16)
- [x] RSVP unit: one person answers for the household (docs/SPEC.md section 16)
- [ ] RSVP deadline date (placeholder: 2027-06-01, Eastern)
- [x] Venue timezone: Eastern
- [ ] Email provider for confirmation emails (needed for Phase 4)
