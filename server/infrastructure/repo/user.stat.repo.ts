import * as schema from "../../schema/schema";
import {
  IUserStatRepo,
  QueryUserStatListDto,
} from "@/server/application/interfaces/user.stat.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import {
  RepoCreateUserStatDto,
  UserStatEntitySelect,
} from "@/server/domain/user.stat.domain";
import { and, eq } from "drizzle-orm";

export class UserStatRepo implements IUserStatRepo {
  static instance: UserStatRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new UserStatRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  getRecentByVersion = async <T extends keyof UserStatEntitySelect>(
    version: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserStatEntitySelect]?: boolean }
  ) => {
    const userStat = await this.db.query.userStats.findFirst({
      where: (value, { eq }) => {
        return eq(value.version, version);
      },
      orderBy: (value, { desc }) => {
        return [desc(value.eventAt)];
      },
      columns: columns
        ? (columns as { [key in keyof UserStatEntitySelect]: boolean })
        : undefined,
    });
    return userStat;
  };

  create = async (dto: RepoCreateUserStatDto) => {
    await this.db.insert(schema.userStats).values(dto);
  };

  getListByQuery = async ({
    startDate: start,
    endDate: end,
    version,
  }: QueryUserStatListDto) => {
    const userStats = await this.db.query.userStats.findMany({
      orderBy: (value, { desc }) => {
        return [desc(value.eventAt)];
      },
      where: (value, { and, eq, gte, lte }) => {
        return and(
          eq(value.version, version),
          gte(value.eventAt, start),
          lte(value.eventAt, end)
        );
      },
    });

    return userStats;
  };

  getByVersionAndEventAt = async <T extends keyof UserStatEntitySelect>(
    {
      version,
      eventAt,
    }: {
      version: number;
      eventAt: Date;
    },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserStatEntitySelect]?: boolean }
  ) => {
    const userStat = await this.db.query.userStats.findFirst({
      where: (value, { eq, and }) => {
        return and(eq(value.version, version), eq(value.eventAt, eventAt));
      },
      columns: columns
        ? (columns as { [key in keyof UserStatEntitySelect]: boolean })
        : undefined,
    });

    return userStat;
  };

  deleteByVersionAndEventAt = async ({
    version,
    eventAt,
  }: {
    version: number;
    eventAt: Date;
  }) => {
    await this.db
      .delete(schema.userStats)
      .where(
        and(
          eq(schema.userStats.version, version),
          eq(schema.userStats.eventAt, eventAt)
        )
      );
  };
}
