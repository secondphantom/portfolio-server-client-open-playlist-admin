import { databaseBackupJobs } from "@/server/schema/schema";

export type DatabaseBackupJobsEntitySelect =
  typeof databaseBackupJobs.$inferSelect;
export type DatabaseBackupJobsEntityInsert =
  typeof databaseBackupJobs.$inferInsert;

export type QueryDatabaseBackupJobListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
};

export interface IDatabaseBackupJobRepo {
  create: (dto: DatabaseBackupJobsEntityInsert) => Promise<void>;
  updateById: (
    id: number,
    value: Partial<DatabaseBackupJobsEntitySelect>
  ) => Promise<void>;
  updateByUuid: (
    uuid: string,
    value: Partial<DatabaseBackupJobsEntitySelect>
  ) => Promise<void>;
  getById: <T extends keyof DatabaseBackupJobsEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsEntitySelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupJobsEntitySelect, T> | undefined>;
  getByUuid: <T extends keyof DatabaseBackupJobsEntitySelect>(
    uuid: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsEntitySelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupJobsEntitySelect, T> | undefined>;
  getListByQuery: (
    query: QueryDatabaseBackupJobListDto
  ) => Promise<DatabaseBackupJobsEntitySelect[]>;
  deleteById: (id: number) => Promise<void>;
}
