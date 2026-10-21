# Wedding Website

Public wedding website with RSVP, plus a private admin dashboard. See `docs/SPEC.md` for the specification.

Stack: Next.js, TypeScript, Tailwind CSS, Neon Postgres, Drizzle, Better Auth. Hosted on Vercel.

## Development

```bash
npm install
cp .env.example .env   # then add your OpenRouter API key
vercel link && vercel env pull .env.local   # development database settings
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Credits

Placeholder photos from Unsplash (Unsplash License), until the couple's own photos are added:

- Home: [Blake Wisz](https://unsplash.com/photos/turquoise-ocean-waves-gently-lap-a-white-sand-beach-0r0KWZo50KA), [Derick McKinney](https://unsplash.com/photos/white-sand-beach-under-clear-blue-sky-j2Rv2CZTwaI), [Ryan Geller](https://unsplash.com/photos/aerial-view-of-white-sand-beach-during-daytime--Yo8Y7CqVlk) (Little Pipe Cay, Bahamas), [Annie Gray](https://unsplash.com/photos/wsZoSshuhdQ) (Pensacola Beach, FL)
- Our Story: [Gary Runn](https://unsplash.com/photos/two-brown-wooden-folding-chairs-on-beach-during-daytime-Wx0u8dYX_y0), Destin, FL
- Details: [Arshad Pooloo](https://unsplash.com/photos/wedding-venue-in-beach-GdwWrLHdwpw), Mauritius
- Travel: [Adrian Botica](https://unsplash.com/photos/a-sandy-path-leading-to-the-ocean-with-sea-oats-in-the-foreground-bMCZpADgVJE), Destin, FL
- FAQ: [Debby Hudson](https://unsplash.com/photos/aerial-photography-of-sea-at-daytime-2vB8q-Qdwrg), Pensacola Beach, FL
- RSVP: [Carter Firquain](https://unsplash.com/photos/golden-sunset-illuminates-a-sandy-beach-ocean-and-coastal-town-IXlPJ4ej2U0), Inlet Beach, FL
