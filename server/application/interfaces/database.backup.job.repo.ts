import { databaseBackupJobs } from "@/server/schema/schema";

export type DatabaseBackupJobsSelect = typeof databaseBackupJobs.$inferSelect;
export type DatabaseBackupJobsInsert = typeof databaseBackupJobs.$inferInsert;

export type QueryDatabaseBackupJobListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
};

export interface IDatabaseBackupJobRepo {
  create: (dto: DatabaseBackupJobsInsert) => Promise<void>;
  updateById: (
    id: number,
    value: Partial<DatabaseBackupJobsSelect>
  ) => Promise<void>;
  updateByUuid: (
    uuid: string,
    value: Partial<DatabaseBackupJobsSelect>
  ) => Promise<void>;
  getById: <T extends keyof DatabaseBackupJobsSelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsSelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupJobsSelect, T> | undefined>;
  getByUuid: <T extends keyof DatabaseBackupJobsSelect>(
    uuid: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupJobsSelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupJobsSelect, T> | undefined>;
  getListByQuery: (
    query: QueryDatabaseBackupJobListDto
  ) => Promise<DatabaseBackupJobsSelect[]>;
  deleteById: (id: number) => Promise<void>;
}
