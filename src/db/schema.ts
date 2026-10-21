import { boolean, check, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Single-row table holding the wedding's main configuration. */
export const weddingSettings = pgTable(
  "wedding_settings",
  {
    id: integer("id").primaryKey().default(1),
    coupleNames: text("couple_names").notNull(),
    firstNames: text("first_names").array().notNull(),
    timezone: text("timezone").notNull(),
    weddingDate: timestamp("wedding_date", { withTimezone: true }).notNull(),
    rsvpDeadline: timestamp("rsvp_deadline", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [check("wedding_settings_single_row", sql`${t.id} = 1`)],
);

/** Wedding-related events guests can attend, such as the ceremony and reception. */
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  venueName: text("venue_name"),
  address: text("address"),
  dressCode: text("dress_code"),
  requiresRsvp: boolean("requires_rsvp").notNull().default(true),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});
