-- List Daniella first in the couple's first names.
UPDATE "wedding_settings"
SET "first_names" = ARRAY['Daniella', 'Greg']
WHERE "first_names" = ARRAY['Greg', 'Daniella'];
