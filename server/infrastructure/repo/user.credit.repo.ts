import {
  IUserCreditRepo,
  UserCreditEntitySelect,
} from "@/server/application/interfaces/user.credit.repo";
import * as schema from "../../schema/schema";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { eq } from "drizzle-orm";

export class UserCreditRepo implements IUserCreditRepo {
  static instance: UserCreditRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new UserCreditRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  updateByUserId = async (
    userId: number,
    value: Partial<UserCreditEntitySelect>
  ) => {
    await this.db
      .update(schema.userCredits)
      .set(value)
      .where(eq(schema.userCredits.userId, userId));
  };
}
