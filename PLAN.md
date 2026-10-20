# Build Plan

Working plan for the next steps. The full roadmap is in `docs/SPEC.md` section 13.

## Done

- [x] Split project instructions (`CLAUDE.md`) from the product spec (`docs/SPEC.md`)
- [x] Choose the free stack: Next.js, Tailwind, Neon Postgres, Drizzle, Better Auth, Vercel Hobby, npm
- [x] Scaffold the Next.js app (lint, typecheck, build passing)
- [x] Create the GitHub repo and push
- [x] Coastal theme: color tokens, fonts, focus states, reduced motion, placeholder homepage

## Phase 1 — Foundation

### 1. Site shell
- [ ] Header with the couple's names
- [ ] Mobile menu
- [ ] Navigation: Home, Our Story, Details, Travel, FAQ, RSVP
- [ ] Footer
- [ ] Placeholder pages for each section

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

- [ ] Wedding date, start time, and venue (needed for step 4)
- [ ] Admin emails (needed for step 3)
- [ ] Plus-one rules (needed for Phase 3)
- [ ] RSVP unit: one response per household, or per guest (needed for Phase 3)
