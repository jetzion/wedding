export type WeddingSettings = {
  coupleNames: string;
  firstNames: string[];
};

/** Wedding settings. Temporary values until the database is added (PLAN.md step 2). */
export async function getWeddingSettings(): Promise<WeddingSettings> {
  return {
    coupleNames: "Greg Garfinkel & Daniella Etzion",
    firstNames: ["Greg", "Daniella"],
  };
}
