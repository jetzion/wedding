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

Pushes to `main` deploy to production through Vercel's GitHub integration.

## Admin access

Admins sign in at `/admin/sign-in`. `/admin` lists every invitation with each person's RSVP status, with search, a status filter, and CSV export. From there admins add, edit, and delete invitations, copy each invitation's personal link (or replace it with a new one), correct RSVP answers, and change their password at `/admin/password` (which signs out their other devices). To create an account, set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAILS`, and `ADMIN_SETUP_CODE`, open `/admin/setup`, and enter the setup code, an email on `ADMIN_EMAILS`, and a password of at least 12 characters. `ADMIN_SETUP_CODE` stays set so more admins can be added later: add their email to `ADMIN_EMAILS`, redeploy, and have them sign up soon. Keep the code private.

## Invitations

Each invitation has a personal page at `/invitation/[link name]`, such as `/invitation/the-etzion-family-k7m2qx`: the invitation name plus a random code, so links cannot be guessed. The page greets the household by its invitation name and links to the RSVP page; it shows no guest details. Links are created with each invitation, shown on the admin dashboard, and can be replaced from the edit page.

## Credits

Photos are from Unsplash (Unsplash License) unless noted:

- Home (rotating): [Blake Wisz](https://unsplash.com/photos/turquoise-ocean-waves-gently-lap-a-white-sand-beach-0r0KWZo50KA), [Derick McKinney](https://unsplash.com/photos/white-sand-beach-under-clear-blue-sky-j2Rv2CZTwaI), [Miltiadis Fragkidis](https://unsplash.com/photos/lush-tropical-island-with-white-sand-beach-and-turquoise-sea-pwiqvi98VGo) (Punta Cana, Dominican Republic), [Annie Gray](https://unsplash.com/photos/wsZoSshuhdQ) (Pensacola Beach, FL)
- Invitation page: the first home photo (Blake Wisz)
- Our Story: the couple's own photo
- Details, Travel, FAQ: supplied by the couple 2026-10-21 (source and license to be confirmed)
- RSVP: Maldives seaside resort (source and license to be confirmed)
