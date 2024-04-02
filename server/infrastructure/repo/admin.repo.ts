import { asc, desc, eq } from "drizzle-orm";

import {
  IAdminRepo,
  QueryAdminListDto,
} from "@/server/application/interfaces/admin.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import {
  AdminEntitySelect,
  RepoCreateAdminDto,
} from "@/server/domain/admin.domain";
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

  create = async (dto: RepoCreateAdminDto) => {
    await this.db.insert(schema.admins).values(dto);
  };

  getListByQuery = async ({
    order,
    page,
    pageSize,
    email,
    roleId,
  }: QueryAdminListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.admins.createdAt)];
        case "old":
          return [asc(schema.admins.createdAt)];
        default:
          return [];
      }
    })(order);

    const healths = await this.db.query.admins.findMany({
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
        roleId: true,
        profileName: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return healths;
  };

  getById = async <T extends keyof AdminEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => {
    const admin = await this.db.query.admins.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof AdminEntitySelect]: boolean })
        : undefined,
    });

    return admin;
  };

  deleteById = async (id: number) => {
    await this.db.delete(schema.admins).where(eq(schema.admins.id, id));
  };

  deleteByEmail = async (email: string) => {
    await this.db.delete(schema.admins).where(eq(schema.admins.email, email));
  };
}
