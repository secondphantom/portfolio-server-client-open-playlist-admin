import { IEnrollRepo } from "@/server/application/interfaces/enroll.repo";
import * as schema from "../../schema/schema";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { and, gt, gte, lt, lte, sql } from "drizzle-orm";

export class EnrollRepo implements IEnrollRepo {
  static instance: EnrollRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new EnrollRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getActiveUserByPeriod = async (period: {
    gte?: Date;
    lte?: Date;
    gt?: Date;
    lt?: Date;
  }) => {
    const result: { count: number }[] = await this.db
      .select({
        count: sql<number>`COUNT(DISTINCT user_id)`.mapWith(Number),
      })
      .from(schema.enrolls)
      .where(
        and(
          ...[
            period.gte ? gte(schema.enrolls.updatedAt, period.gte) : undefined,
            period.lte ? lte(schema.enrolls.updatedAt, period.lte) : undefined,
            period.gt ? gt(schema.enrolls.updatedAt, period.gt) : undefined,
            period.lt ? lt(schema.enrolls.updatedAt, period.lt) : undefined,
          ].filter((v) => !!v)
        )
      );

    const activeUser = result[0].count;

    return activeUser;
  };
}
