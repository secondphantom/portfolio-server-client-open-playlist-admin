import * as schema from "../../schema/schema";
import {
  DatabaseBackupJobsEntityInsert,
  DatabaseBackupJobsEntitySelect,
  IDatabaseBackupJobRepo,
  QueryDatabaseBackupJobListDto,
} from "@/server/application/interfaces/database.backup.job.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";

export class DatabaseBackupJobRepo implements IDatabaseBackupJobRepo {
  static instance: DatabaseBackupJobRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupJobRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: DatabaseBackupJobsEntityInsert) => {
    await this.db.insert(schema.databaseBackupJobs).values(dto);
  };

  updateById = async (
    id: number,
    value: Partial<DatabaseBackupJobsEntitySelect>
  ) => {
    await this.db
      .update(schema.databaseBackupJobs)
      .set(value)
      .where(eq(schema.databaseBackupJobs.id, id));
  };

  updateByUuid = async (
    uuid: string,
    value: Partial<DatabaseBackupJobsEntitySelect>
  ) => {
    await this.db
      .update(schema.databaseBackupJobs)
      .set(value)
      .where(eq(schema.databaseBackupJobs.uuid, uuid));
  };

  getById = async <T extends keyof DatabaseBackupJobsEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsEntitySelect]?: boolean }
  ) => {
    const databaseBackupJob = await this.db.query.databaseBackupJobs.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as {
            [key in keyof DatabaseBackupJobsEntitySelect]: boolean;
          })
        : undefined,
    });

    return databaseBackupJob;
  };

  getByUuid = async <T extends keyof DatabaseBackupJobsEntitySelect>(
    uuid: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsEntitySelect]?: boolean }
  ) => {
    const databaseBackupJob = await this.db.query.databaseBackupJobs.findFirst({
      where: (value, { eq }) => {
        return eq(value.uuid, uuid);
      },
      columns: columns
        ? (columns as {
            [key in keyof DatabaseBackupJobsEntitySelect]: boolean;
          })
        : undefined,
    });

    return databaseBackupJob;
  };

  getListByQuery = async ({
    page,
    pageSize,
    order,
  }: QueryDatabaseBackupJobListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.databaseBackupJobs.createdAt)];
        case "old":
          return [asc(schema.databaseBackupJobs.createdAt)];
        default:
          return [];
      }
    })(order);
    const databaseBackupJobs = await this.db.query.databaseBackupJobs.findMany({
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      with: {
        admin: {
          columns: {
            id: true,
            profileName: true,
          },
        },
      },
    });

    return databaseBackupJobs;
  };

  deleteById = async (id: number) => {
    await this.db
      .delete(schema.databaseBackupSchedules)
      .where(eq(schema.databaseBackupSchedules.id, id));
  };
}
