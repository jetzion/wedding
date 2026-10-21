CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"venue_name" text,
	"address" text,
	"dress_code" text,
	"requires_rsvp" boolean DEFAULT true NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "wedding_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"couple_names" text NOT NULL,
	"first_names" text[] NOT NULL,
	"timezone" text NOT NULL,
	"wedding_date" timestamp with time zone NOT NULL,
	"rsvp_deadline" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wedding_settings_single_row" CHECK ("wedding_settings"."id" = 1)
);
