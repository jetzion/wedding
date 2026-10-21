-- Replace the one-person placeholder invitations from 0004 with two family invitations.
-- Deleting a household cascades to its guests, invitations, and responses.
DELETE FROM "households" WHERE "name" IN ('Jack Etzion', 'Ori Etzion', 'Susan Garfinkel');
--> statement-breakpoint
WITH new_households AS (
	INSERT INTO "households" ("name")
	VALUES ('The Etzion Family'), ('The Garfinkel Family')
	RETURNING "id", "name"
),
new_guests AS (
	INSERT INTO "guests" ("household_id", "first_name", "last_name", "sort_order")
	SELECT new_households."id", people."first_name", people."last_name", people."sort_order"
	FROM new_households
	JOIN (VALUES
		('The Etzion Family', 'Jack', 'Etzion', 1),
		('The Etzion Family', 'Michelle', 'Etzion', 2),
		('The Etzion Family', 'Ori', 'Etzion', 3),
		('The Garfinkel Family', 'Susan', 'Garfinkel', 1),
		('The Garfinkel Family', 'Mark', 'Grafinkel', 2)
	) AS people ("household", "first_name", "last_name", "sort_order")
		ON people."household" = new_households."name"
	RETURNING "id"
)
INSERT INTO "guest_events" ("guest_id", "event_id")
SELECT new_guests."id", "events"."id"
FROM new_guests
CROSS JOIN "events";
