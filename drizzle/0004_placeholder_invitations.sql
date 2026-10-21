-- Placeholder invitations for trying the RSVP flow on the live site.
-- One household per person, each invited to the ceremony and reception.
-- Remove with a later migration (or the admin dashboard) before real invitations go out.
WITH new_households AS (
	INSERT INTO "households" ("name")
	VALUES ('Jack Etzion'), ('Ori Etzion'), ('Susan Garfinkel')
	RETURNING "id", "name"
),
new_guests AS (
	INSERT INTO "guests" ("household_id", "first_name", "last_name", "sort_order")
	SELECT "id", split_part("name", ' ', 1), split_part("name", ' ', 2), 1
	FROM new_households
	RETURNING "id"
)
INSERT INTO "guest_events" ("guest_id", "event_id")
SELECT new_guests."id", "events"."id"
FROM new_guests
CROSS JOIN "events"
WHERE "events"."slug" IN ('ceremony', 'reception');
