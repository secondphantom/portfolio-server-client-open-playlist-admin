import { and, count, gt, gte, lt, lte } from "drizzle-orm";

import * as schema from "../../schema/schema";
import { IUserRepo } from "@/server/application/interfaces/user.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";

export class UserRepo implements IUserRepo {
  static instance: UserRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new UserRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }
  getTotalUserByPeriod = async (period: {
    gte?: Date;
    lte?: Date;
    gt?: Date;
    lt?: Date;
  }) => {
    const result: { count: number }[] = await this.db
      .select({ count: count() })
      .from(schema.users)
      .where(
        and(
          ...[
            period.gte ? gte(schema.users.createdAt, period.gte) : undefined,
            period.lte ? lte(schema.users.createdAt, period.lte) : undefined,
            period.gt ? gt(schema.users.createdAt, period.gt) : undefined,
            period.lt ? lt(schema.users.createdAt, period.lt) : undefined,
          ].filter((v) => !!v)
        )
      );

    const totalUser = result[0].count;

    return totalUser;
  };
}
