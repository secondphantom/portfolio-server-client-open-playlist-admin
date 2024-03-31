import dotenv from "dotenv";
dotenv.config();
import { sql } from "drizzle-orm";

import { DrizzleClient } from "../../../infrastructure/db/drizzle.client";

describe("Connecting db", () => {
  test("connect", async () => {
    const client = new DrizzleClient({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
    });
    const db = client.getDb();
    const result = await db.execute(sql`SELECT table_name
		FROM information_schema.tables
	 WHERE table_schema='public'
		 AND table_type='BASE TABLE'`);
    console.log(result);
  });
});
