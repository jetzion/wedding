-- Guests RSVP once for a combined ceremony and reception.
-- Deleting the reception event cascades to its invitations and responses.
UPDATE "events"
SET "slug" = 'ceremony-reception', "name" = 'Ceremony & Reception'
WHERE "slug" = 'ceremony';
--> statement-breakpoint
DELETE FROM "events" WHERE "slug" = 'reception';
