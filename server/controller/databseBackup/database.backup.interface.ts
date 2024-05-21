import {
  ServiceDatabaseBackupJobCreateDto,
  ServiceDatabaseBackupJobDeleteByIdDto,
  ServiceDatabaseBackupJobGetByIdDto,
  ServiceDatabaseBackupJobGetListByQueryDto,
  ServiceDatabaseBackupScheduleCreateDto,
  ServiceDatabaseBackupScheduleDeleteByIdDto,
  ServiceDatabaseBackupScheduleGetByIdDto,
  ServiceDatabaseBackupScheduleGetListByQueryDto,
  ServiceDatabaseBackupScheduleUpdateByIdDto,
} from "@/server/application/service/database.backup.service";
import {
  RequestDatabaseBackupJobCreate,
  RequestDatabaseBackupJobDeleteById,
  RequestDatabaseBackupJobGetById,
  RequestDatabaseBackupJobGetListByQuery,
  RequestDatabaseBackupScheduleCreate,
  RequestDatabaseBackupScheduleDeleteById,
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
  deleteScheduleById: (
    req: RequestDatabaseBackupScheduleDeleteById
  ) => ServiceDatabaseBackupScheduleDeleteByIdDto;
  createJob: (
    req: RequestDatabaseBackupJobCreate
  ) => ServiceDatabaseBackupJobCreateDto;
  getJobListByQuery: (
    req: RequestDatabaseBackupJobGetListByQuery
  ) => ServiceDatabaseBackupJobGetListByQueryDto;
  getJobById: (
    req: RequestDatabaseBackupJobGetById
  ) => ServiceDatabaseBackupJobGetByIdDto;
  deleteJobById: (
    req: RequestDatabaseBackupJobDeleteById
  ) => ServiceDatabaseBackupJobDeleteByIdDto;
}
