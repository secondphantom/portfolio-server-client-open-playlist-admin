import * as schema from "../../schema/schema";
import {
  RoleEntitySelect,
  IRoleRepo,
  QueryRoleListDto,
  RoleEntityInsert,
} from "@/server/application/interfaces/role.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";

export class RoleRepo implements IRoleRepo {
  static instance: RoleRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new RoleRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: RoleEntityInsert) => {
    await this.db.insert(schema.roles).values(dto);
  };

  getListByQuery = async ({ order, page, id, pageSize }: QueryRoleListDto) => {
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
    const roles = await this.db.query.roles.findMany({
      where: (value, { eq, and }) => {
        return and(...[id ? eq(value.id, id) : undefined].filter((v) => !!v));
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return roles;
  };

  getById = async <T extends keyof RoleEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof RoleEntitySelect]?: boolean }
  ) => {
    const role = this.db.query.roles.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof RoleEntitySelect]: boolean })
        : undefined,
    });
    return role;
  };

  updateById = async (id: number, value: Partial<RoleEntitySelect>) => {
    await this.db
      .update(schema.roles)
      .set(value)
      .where(eq(schema.roles.id, id));
  };

  deleteById = async (id: number) => {
    await this.db.delete(schema.roles).where(eq(schema.roles.id, id));
  };
}
