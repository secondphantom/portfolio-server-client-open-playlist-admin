import { Client, Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../../schema/schema";
import { ENV } from "@/server/env";

type C_ENV = Pick<ENV, "DATABASE_URL" | "LOG_LEVEL">;

export type Db = NodePgDatabase<typeof schema>;
export class DrizzleClient {
  static instance: DrizzleClient | undefined;
  static getInstance = (env: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new DrizzleClient(env);
    return this.instance;
  };

  private db: Db;

  constructor(private env: C_ENV) {
    const pool = new Pool({
      connectionString: this.env.DATABASE_URL,
    });
    // const client = new Client({
    //   connectionString: this.env.DATABASE_URL,
    // });

    this.db = drizzle(pool, {
      schema,
      logger: this.env.LOG_LEVEL === "verbose" ? true : false,
    });
  }

  getDb = () => this.db;
}
