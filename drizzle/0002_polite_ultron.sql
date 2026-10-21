CREATE TYPE "public"."rsvp_status" AS ENUM('attending', 'declined');--> statement-breakpoint
CREATE TABLE "guest_events" (
	"guest_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	CONSTRAINT "guest_events_guest_id_event_id_pk" PRIMARY KEY("guest_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"first_name" text,
	"last_name" text,
	"is_plus_one" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"dietary_restrictions" text,
	"accessibility_needs" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_named_unless_plus_one" CHECK ("guests"."is_plus_one" OR "guests"."first_name" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code_hash" text NOT NULL,
	"contact_email" text,
	"message" text,
	"confirmation_code" text,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "households_code_hash_unique" UNIQUE("code_hash"),
	CONSTRAINT "households_confirmation_code_unique" UNIQUE("confirmation_code")
);
--> statement-breakpoint
CREATE TABLE "rsvp_responses" (
	"guest_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"status" "rsvp_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rsvp_responses_guest_id_event_id_pk" PRIMARY KEY("guest_id","event_id")
);
--> statement-breakpoint
ALTER TABLE "guest_events" ADD CONSTRAINT "guest_events_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_events" ADD CONSTRAINT "guest_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_guest_id_event_id_guest_events_guest_id_event_id_fk" FOREIGN KEY ("guest_id","event_id") REFERENCES "public"."guest_events"("guest_id","event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "guests_household_idx" ON "guests" USING btree ("household_id");