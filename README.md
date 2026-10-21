# Wedding Website

Public wedding website with RSVP, plus a private admin dashboard. See `docs/SPEC.md` for the specification.

Stack: Next.js, TypeScript, Tailwind CSS, Neon Postgres, Drizzle, Better Auth. Hosted on Vercel.

## Development

```bash
npm install
cp .env.example .env   # then fill in the OpenRouter key and admin settings
vercel link && vercel env pull .env.local   # development database settings
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright); first run: npx playwright install chromium
```

## Admin access

Admins sign in at `/admin/sign-in`. `/admin` lists every invitation with each person's RSVP status, with search, a status filter, and CSV export. From there admins add, edit, and delete invitations and correct RSVP answers. To create an account, set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAILS`, and `ADMIN_SETUP_CODE`, open `/admin/setup`, and enter the setup code, an email on `ADMIN_EMAILS`, and a password of at least 12 characters. `ADMIN_SETUP_CODE` stays set so more admins can be added later: add their email to `ADMIN_EMAILS`, redeploy, and have them sign up soon. Keep the code private.

## Credits

Placeholder photos, from Unsplash (Unsplash License) unless noted, until the couple's own photos are added:

- Home (rotating): [Blake Wisz](https://unsplash.com/photos/turquoise-ocean-waves-gently-lap-a-white-sand-beach-0r0KWZo50KA), [Derick McKinney](https://unsplash.com/photos/white-sand-beach-under-clear-blue-sky-j2Rv2CZTwaI), [Miltiadis Fragkidis](https://unsplash.com/photos/lush-tropical-island-with-white-sand-beach-and-turquoise-sea-pwiqvi98VGo) (Punta Cana, Dominican Republic), [Annie Gray](https://unsplash.com/photos/wsZoSshuhdQ) (Pensacola Beach, FL)
- Our Story: [Gary Runn](https://unsplash.com/photos/two-brown-wooden-folding-chairs-on-beach-during-daytime-Wx0u8dYX_y0), Destin, FL
- Details: [Arshad Pooloo](https://unsplash.com/photos/wedding-venue-in-beach-GdwWrLHdwpw), Mauritius
- Travel: [Adrian Botica](https://unsplash.com/photos/a-sandy-path-leading-to-the-ocean-with-sea-oats-in-the-foreground-bMCZpADgVJE), Destin, FL
- FAQ: [Debby Hudson](https://unsplash.com/photos/aerial-photography-of-sea-at-daytime-2vB8q-Qdwrg), Pensacola Beach, FL
- RSVP: Maldives seaside resort (source and license to be confirmed)
