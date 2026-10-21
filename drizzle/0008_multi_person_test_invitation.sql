-- Fictional test invitation with several people, for trying the RSVP flow on the live site.
-- Each person is invited to every event. Remove before real invitations go out.
WITH new_household AS (
	INSERT INTO "households" ("name")
	VALUES ('The Rivera Household')
	RETURNING "id"
),
new_guests AS (
	INSERT INTO "guests" ("household_id", "first_name", "last_name", "sort_order")
	SELECT new_household."id", people."first_name", 'Rivera', people."sort_order"
	FROM new_household
	CROSS JOIN (VALUES ('Alex', 1), ('Sam', 2), ('Jordan', 3)) AS people ("first_name", "sort_order")
	RETURNING "id"
)
INSERT INTO "guest_events" ("guest_id", "event_id")
SELECT new_guests."id", "events"."id"
FROM new_guests
CROSS JOIN "events";
