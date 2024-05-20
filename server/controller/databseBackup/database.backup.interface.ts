import {
  ServiceDatabaseBackupJobCreateDto,
  ServiceDatabaseBackupJobGetByIdDto,
  ServiceDatabaseBackupJobGetListByQueryDto,
  ServiceDatabaseBackupScheduleCreateDto,
  ServiceDatabaseBackupScheduleGetByIdDto,
  ServiceDatabaseBackupScheduleGetListByQueryDto,
  ServiceDatabaseBackupScheduleUpdateByIdDto,
} from "@/server/application/service/database.backup.service";
import {
  RequestDatabaseBackupJobCreate,
  RequestDatabaseBackupJobGetById,
  RequestDatabaseBackupJobGetListByQuery,
  RequestDatabaseBackupScheduleCreate,
  RequestDatabaseBackupScheduleGetById,
  RequestDatabaseBackupScheduleGetListByQuery,
  RequestDatabaseBackupScheduleUpdateById,
} from "@/server/spec/databaseBackup/database.backup.requests";

export interface IDatabaseBackupRequestValidator {
  createSchedule: (
    req: RequestDatabaseBackupScheduleCreate
  ) => ServiceDatabaseBackupScheduleCreateDto;
  getScheduleById: (
    req: RequestDatabaseBackupScheduleGetById
  ) => ServiceDatabaseBackupScheduleGetByIdDto;
  getScheduleListByQuery: (
    req: RequestDatabaseBackupScheduleGetListByQuery
  ) => ServiceDatabaseBackupScheduleGetListByQueryDto;
  updateScheduleById: (
    req: RequestDatabaseBackupScheduleUpdateById
  ) => ServiceDatabaseBackupScheduleUpdateByIdDto;
  createJob: (
    req: RequestDatabaseBackupJobCreate
  ) => ServiceDatabaseBackupJobCreateDto;
  getJobListByQuery: (
    req: RequestDatabaseBackupJobGetListByQuery
  ) => ServiceDatabaseBackupJobGetListByQueryDto;
  getJobById: (
    req: RequestDatabaseBackupJobGetById
  ) => ServiceDatabaseBackupJobGetByIdDto;
}
