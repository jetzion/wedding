import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { weddingSettings } from "@/db/schema";

export type WeddingSettings = {
  coupleNames: string;
  firstNames: string[];
  /** IANA timezone for all wedding dates and the RSVP deadline. */
  timezone: string;
  /** ISO 8601 start of the ceremony. */
  weddingDate: string;
  /** ISO 8601 instant after which RSVPs can no longer be changed. */
  rsvpDeadline: string;
};

export const SETTINGS_TAG = "wedding-settings";

/** Wedding settings from the database, cached and refreshable by tag. */
export async function getWeddingSettings(): Promise<WeddingSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);

  const [row] = await db.select().from(weddingSettings).limit(1);
  return {
    coupleNames: row.coupleNames,
    firstNames: row.firstNames,
    timezone: row.timezone,
    weddingDate: row.weddingDate.toISOString(),
    rsvpDeadline: row.rsvpDeadline.toISOString(),
  };
}
