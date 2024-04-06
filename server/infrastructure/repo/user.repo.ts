import { and, asc, count, desc, eq, gt, gte, lt, lte } from "drizzle-orm";

import * as schema from "../../schema/schema";
import {
  IUserRepo,
  QueryUserListDto,
  UserEntitySelect,
} from "@/server/application/interfaces/user.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { UserCreditEntitySelect } from "@/server/application/interfaces/user.credit.repo";

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

  getUserById = async <T extends keyof UserEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => {
    const user = this.db.query.users.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof UserEntitySelect]: boolean })
        : undefined,
    });
    return user;
  };

  getUserByIdWith = async <
    T extends keyof UserEntitySelect,
    W1 extends keyof UserCreditEntitySelect
  >(
    id: number,
    columns?: {
      user?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof UserEntitySelect]?: boolean };
      credit?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof UserCreditEntitySelect]?: boolean };
    }
  ) => {
    const user = this.db.query.users.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns?.user,
      with: {
        credit: columns?.credit
          ? {
              columns: columns?.credit,
            }
          : undefined,
      },
    });

    return user as any;
  };

  updateUserById = async (id: number, value: Partial<UserEntitySelect>) => {
    await this.db
      .update(schema.users)
      .set(value)
      .where(eq(schema.users.id, id));
  };

  getListByQuery = async ({
    order,
    page,
    pageSize,
    email,
    roleId,
  }: QueryUserListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.users.createdAt)];
        case "old":
          return [asc(schema.users.createdAt)];
        default:
          return [];
      }
    })(order);

    const users = await this.db.query.users.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[
            email !== undefined ? eq(value.email, email) : undefined,
            roleId !== undefined ? eq(value.roleId, roleId) : undefined,
          ].filter((v) => !!v)
        );
      },
      columns: {
        id: true,
        email: true,
        isEmailVerified: true,
        profileImage: true,
        profileName: true,
        roleId: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return users;
  };
}
