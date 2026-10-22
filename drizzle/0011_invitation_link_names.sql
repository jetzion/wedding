-- Give every invitation a link name, /invitation/[link_name]: the name as a
-- slug plus a 6-character random code, as newLinkName() in
-- src/lib/invitation-link.ts makes. Existing names are plain ASCII, so the
-- slug rule here matches linkSlug(). Each code character comes from its own
-- gen_random_uuid(), which is cryptographically random; the WHERE clause ties
-- the subquery to the row so every invitation gets its own code.
ALTER TABLE "households" ADD COLUMN "link_name" text;--> statement-breakpoint
UPDATE "households" SET "link_name" =
	coalesce(nullif(btrim(left(regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g'), 40), '-'), ''), 'invitation')
	|| '-' || (
		SELECT string_agg(substr('abcdefghjkmnpqrstvwxyz23456789', 1 + (get_byte(r.b, 0) * 256 + get_byte(r.b, 1)) % 30, 1), '')
		FROM generate_series(1, 6) AS g(i)
		CROSS JOIN LATERAL (SELECT uuid_send(gen_random_uuid()) AS b, g.i) AS r
		WHERE "households"."id" IS NOT NULL
	);--> statement-breakpoint
ALTER TABLE "households" ALTER COLUMN "link_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_link_name_unique" UNIQUE("link_name");
