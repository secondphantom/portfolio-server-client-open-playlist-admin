import { eq } from "drizzle-orm";

import { IAdminRepo } from "@/server/application/interfaces/admin.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { AdminEntitySelect } from "@/server/domain/admin.domain";
import * as schema from "../../schema/schema";

export class AdminRepo implements IAdminRepo {
  static instance: AdminRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new AdminRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getByEmail = async <T extends keyof AdminEntitySelect>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => {
    const admin = await this.db.query.admins.findFirst({
      where: (admin, { eq }) => {
        return eq(admin.email, email);
      },
      columns: columns
        ? (columns as { [key in keyof AdminEntitySelect]: boolean })
        : undefined,
    });

    return admin;
  };

  updateByEmail = async (email: string, value: Partial<AdminEntitySelect>) => {
    await this.db
      .update(schema.admins)
      .set(value)
      .where(eq(schema.admins.email, email));
  };
}
