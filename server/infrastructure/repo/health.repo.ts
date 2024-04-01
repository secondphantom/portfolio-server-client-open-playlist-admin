import * as schema from "../../schema/schema";
import { asc, desc } from "drizzle-orm";

import {
  IHealthRepo,
  QueryHealthListDto,
  RepoCreateHealthDto,
} from "@/server/application/interfaces/health.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { HealthData } from "@/server/schema/schema";

export class HealthRepo implements IHealthRepo {
  static instance: HealthRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new HealthRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: RepoCreateHealthDto) => {
    await this.db.insert(schema.healths).values(dto);
  };

  getById = async (id: number) => {
    const health = await this.db.query.healths.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
    });

    return health;
  };

  getListByQuery = async ({
    page,
    order,
    version,
    pageSize,
  }: QueryHealthListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.healths.createdAt)];
        case "old":
          return [asc(schema.healths.createdAt)];
        default:
          return [];
      }
    })(order);

    const healths = await this.db.query.healths.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[
            version !== undefined ? eq(value.version, version) : undefined,
          ].filter((v) => !!v)
        );
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return healths;
  };
}
