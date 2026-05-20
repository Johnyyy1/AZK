import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl =
	process.env.DATABASE_URL ?? "postgres://aquasmart:aquasmart@127.0.0.1:5432/aquasmart";

const globalForDb = globalThis as typeof globalThis & {
	aquaSmartPool?: Pool;
};

const pool =
	globalForDb.aquaSmartPool ??
	new Pool({
		connectionString: databaseUrl,
	});

if (process.env.NODE_ENV !== "production") {
	globalForDb.aquaSmartPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
