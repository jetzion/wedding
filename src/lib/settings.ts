export type WeddingSettings = {
  coupleNames: string;
};

/** Wedding settings. Temporary values until the database is added (PLAN.md step 2). */
export async function getWeddingSettings(): Promise<WeddingSettings> {
  return {
    coupleNames: "Greg Garfinkel & Daniella Etzion",
  };
}
