import { loadEnvConfig } from "@next/env";

/** Loads .env.local (the development database). Import before anything that reads it, such as @/db. */
loadEnvConfig(process.cwd());
