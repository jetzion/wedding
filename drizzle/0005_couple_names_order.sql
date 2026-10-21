-- List Daniella first in the couple's display name.
UPDATE "wedding_settings"
SET "couple_names" = 'Daniella Etzion & Greg Garfinkel'
WHERE "couple_names" = 'Greg Garfinkel & Daniella Etzion';
