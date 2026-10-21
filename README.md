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
```

## Admin access

Admins sign in at `/admin/sign-in`. To create an account, set `BETTER_AUTH_SECRET`, `ADMIN_EMAILS`, and `ADMIN_SETUP_CODE`, open `/admin/setup`, and enter the setup code, an email on `ADMIN_EMAILS`, and a password of at least 12 characters. Remove `ADMIN_SETUP_CODE` (and redeploy) once accounts exist.

## Credits

Placeholder photos from Unsplash (Unsplash License), until the couple's own photos are added:

- Home (rotating): [Blake Wisz](https://unsplash.com/photos/turquoise-ocean-waves-gently-lap-a-white-sand-beach-0r0KWZo50KA), [Derick McKinney](https://unsplash.com/photos/white-sand-beach-under-clear-blue-sky-j2Rv2CZTwaI), [Miltiadis Fragkidis](https://unsplash.com/photos/lush-tropical-island-with-white-sand-beach-and-turquoise-sea-pwiqvi98VGo) (Punta Cana, Dominican Republic), [Annie Gray](https://unsplash.com/photos/wsZoSshuhdQ) (Pensacola Beach, FL)
- Our Story: [Gary Runn](https://unsplash.com/photos/two-brown-wooden-folding-chairs-on-beach-during-daytime-Wx0u8dYX_y0), Destin, FL
- Details: [Arshad Pooloo](https://unsplash.com/photos/wedding-venue-in-beach-GdwWrLHdwpw), Mauritius
- Travel: [Adrian Botica](https://unsplash.com/photos/a-sandy-path-leading-to-the-ocean-with-sea-oats-in-the-foreground-bMCZpADgVJE), Destin, FL
- FAQ: [Debby Hudson](https://unsplash.com/photos/aerial-photography-of-sea-at-daytime-2vB8q-Qdwrg), Pensacola Beach, FL
- RSVP: [Carter Firquain](https://unsplash.com/photos/golden-sunset-illuminates-a-sandy-beach-ocean-and-coastal-town-IXlPJ4ej2U0), Inlet Beach, FL
