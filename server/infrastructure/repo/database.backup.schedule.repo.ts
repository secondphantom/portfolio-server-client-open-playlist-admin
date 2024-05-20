import * as schema from "../../schema/schema";
import {
  DatabaseBackupScheduleEntityInsert,
  DatabaseBackupScheduleEntitySelect,
  IDatabaseBackupScheduleRepo,
  QueryDatabaseBackupScheduleListDto,
} from "@/server/application/interfaces/database.backup.schedule.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";

export class DatabaseBackupScheduleRepo implements IDatabaseBackupScheduleRepo {
  static instance: DatabaseBackupScheduleRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupScheduleRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: DatabaseBackupScheduleEntityInsert) => {
    await this.db.insert(schema.databaseBackupSchedules).values(dto);
  };

  getById = async <T extends keyof DatabaseBackupScheduleEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupScheduleEntitySelect]?: boolean }
  ) => {
    const databaseBackupSchedule =
      await this.db.query.databaseBackupSchedules.findFirst({
        where: (value, { eq }) => {
          return eq(value.id, id);
        },
        columns: columns
          ? (columns as {
              [key in keyof DatabaseBackupScheduleEntitySelect]: boolean;
            })
          : undefined,
      });

    return databaseBackupSchedule;
  };

  getListByQuery = async ({
    page,
    pageSize,
    order,
    isActive,
    isLocked,
  }: QueryDatabaseBackupScheduleListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.databaseBackupSchedules.createdAt)];
        case "old":
          return [asc(schema.databaseBackupSchedules.createdAt)];
        default:
          return [];
      }
    })(order);
    const databaseBackupSchedules =
      await this.db.query.databaseBackupSchedules.findMany({
        where: (value, { eq, and }) => {
          return and(
            ...[
              isActive !== undefined ? eq(value.isActive, isActive) : undefined,
              isLocked !== undefined ? eq(value.isLocked, isLocked) : undefined,
            ].filter((v) => !!v)
          );
        },
        orderBy: orderBy,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

    return databaseBackupSchedules;
  };

  deleteById = async (id: number) => {
    await this.db
      .delete(schema.databaseBackupSchedules)
      .where(eq(schema.databaseBackupSchedules.id, id));
  };

  updateById = async (
    id: number,
    value: Partial<DatabaseBackupScheduleEntitySelect>
  ) => {
    await this.db
      .update(schema.databaseBackupSchedules)
      .set(value)
      .where(eq(schema.databaseBackupSchedules.id, id));
  };

  updateByIdWithLock = async (
    id: number,
    value: Partial<DatabaseBackupScheduleEntitySelect>
  ) => {
    await this.db.transaction(async (tx) => {
      await tx
        .select({
          id: schema.databaseBackupSchedules.id,
        })
        .from(schema.databaseBackupSchedules)
        .where(eq(schema.databaseBackupSchedules.id, id))
        .for("update");
      await tx
        .update(schema.databaseBackupSchedules)
        .set(value)
        .where(eq(schema.databaseBackupSchedules.id, id));
    });
  };
}
