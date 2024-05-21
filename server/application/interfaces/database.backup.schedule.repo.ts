import { databaseBackupSchedules } from "@/server/schema/schema";

export type DatabaseBackupScheduleEntitySelect =
  typeof databaseBackupSchedules.$inferSelect;
export type DatabaseBackupScheduleEntityInsert =
  typeof databaseBackupSchedules.$inferInsert;

export type QueryDatabaseBackupScheduleListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
  isActive?: boolean;
  isLocked?: boolean;
};

export type QueryDatabaseBackupScheduleAllListDto = {
  isActive?: boolean;
  isLocked?: boolean;
};

export interface IDatabaseBackupScheduleRepo {
  create: (dto: DatabaseBackupScheduleEntityInsert) => Promise<void>;
  getById: <T extends keyof DatabaseBackupScheduleEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupScheduleEntitySelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupScheduleEntitySelect, T> | undefined>;
  getListByQuery: (
    query: QueryDatabaseBackupScheduleListDto
  ) => Promise<DatabaseBackupScheduleEntitySelect[]>;
  getAllListByQuery: <T extends keyof DatabaseBackupScheduleEntitySelect>(
    query: QueryDatabaseBackupScheduleAllListDto,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupScheduleEntitySelect]?: boolean }
  ) => Promise<DatabaseBackupScheduleEntitySelect[]>;
  deleteById: (id: number) => Promise<void>;
  updateById: (
    id: number,
    value: Partial<DatabaseBackupScheduleEntitySelect>
  ) => Promise<void>;
  updateByIdWithLock: (
    id: number,
    value: Partial<DatabaseBackupScheduleEntitySelect>
  ) => Promise<void>;
}
