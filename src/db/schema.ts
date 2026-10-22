import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
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

/** Wedding-related events guests can attend, such as the combined ceremony and reception. */
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

/**
 * An invitation group. One person answers for the whole household.
 * Guests find their household by last name (docs/SPEC.md section 16).
 */
export const households = pgTable("households", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /** The invitation's link, /invitation/[linkName]: a readable name plus a random code. */
  linkName: text("link_name").notNull().unique(),
  contactEmail: text("contact_email"),
  message: text("message"),
  confirmationCode: text("confirmation_code").unique(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  ...timestamps,
});

/** An invited adult. A plus-one is a guest row whose name the household fills in. */
export const guests = pgTable(
  "guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    householdId: uuid("household_id")
      .notNull()
      .references(() => households.id, { onDelete: "cascade" }),
    firstName: text("first_name"),
    lastName: text("last_name"),
    isPlusOne: boolean("is_plus_one").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    dietaryRestrictions: text("dietary_restrictions"),
    accessibilityNeeds: text("accessibility_needs"),
    ...timestamps,
  },
  (t) => [
    index("guests_household_idx").on(t.householdId),
    check("guests_named_unless_plus_one", sql`${t.isPlusOne} OR ${t.firstName} IS NOT NULL`),
  ],
);

/** Which guests are invited to which events. Not every guest is invited to every event. */
export const guestEvents = pgTable(
  "guest_events",
  {
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.guestId, t.eventId] })],
);

export const rsvpStatus = pgEnum("rsvp_status", ["attending", "declined"]);

/**
 * A guest's answer for one event. No row means "awaiting response".
 * The composite foreign key makes it impossible to answer for an event
 * the guest is not invited to.
 */
export const rsvpResponses = pgTable(
  "rsvp_responses",
  {
    guestId: uuid("guest_id").notNull(),
    eventId: uuid("event_id").notNull(),
    status: rsvpStatus("status").notNull(),
    ...timestamps,
  },
  (t) => [
    primaryKey({ columns: [t.guestId, t.eventId] }),
    foreignKey({
      columns: [t.guestId, t.eventId],
      foreignColumns: [guestEvents.guestId, guestEvents.eventId],
    }).onDelete("cascade"),
  ],
);

export * from "@/db/auth-schema";
