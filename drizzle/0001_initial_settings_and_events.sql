-- Initial wedding settings and events. Dates are placeholders until the real
-- ones are set (docs/SPEC.md section 16). Existing rows are never overwritten.
INSERT INTO "wedding_settings" ("couple_names", "first_names", "timezone", "wedding_date", "rsvp_deadline")
VALUES (
	'Greg Garfinkel & Daniella Etzion',
	ARRAY['Greg', 'Daniella'],
	'America/New_York',
	'2027-08-14T17:00:00-04:00',
	'2027-06-01T23:59:00-04:00'
)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "events" ("slug", "name", "starts_at", "sort_order")
VALUES
	('ceremony', 'Ceremony', '2027-08-14T17:00:00-04:00', 1),
	('reception', 'Reception', '2027-08-14T18:00:00-04:00', 2)
ON CONFLICT DO NOTHING;
