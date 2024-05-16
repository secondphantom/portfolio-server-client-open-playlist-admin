import { databaseBackupSchedules } from "@/server/schema/schema";

export type DatabaseBackupScheduleSelect =
  typeof databaseBackupSchedules.$inferSelect;
export type DatabaseBackupScheduleInsert =
  typeof databaseBackupSchedules.$inferInsert;

export type QueryDatabaseBackupScheduleListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
  isActive?: boolean;
  isLocked?: boolean;
};

export interface IDatabaseBackupScheduleRepo {
  create: (dto: DatabaseBackupScheduleInsert) => Promise<void>;
  getById: <T extends keyof DatabaseBackupScheduleSelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof DatabaseBackupScheduleSelect]?: boolean }
  ) => Promise<Pick<DatabaseBackupScheduleSelect, T> | undefined>;
  getListByQuery: (
    query: QueryDatabaseBackupScheduleListDto
  ) => Promise<DatabaseBackupScheduleSelect[]>;
  deleteById: (id: number) => Promise<void>;
  updateById: (
    id: number,
    value: Partial<DatabaseBackupScheduleSelect>
  ) => Promise<void>;
  updateByIdWithLock: (
    id: number,
    value: Partial<DatabaseBackupScheduleSelect>
  ) => Promise<void>;
}
