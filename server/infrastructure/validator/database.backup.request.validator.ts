import z from "zod";

import { IDatabaseBackupRequestValidator } from "@/server/controller/databseBackup/database.backup.interface";
import { ServerError } from "@/server/dto/error";
import {
  RequestDatabaseBackupScheduleCreate,
  RequestDatabaseBackupScheduleGetById,
  RequestDatabaseBackupScheduleGetListByQuery,
  RequestDatabaseBackupScheduleUpdateById,
  RequestDatabaseBackupJobCreate,
  RequestDatabaseBackupJobGetListByQuery,
  RequestDatabaseBackupJobGetById,
  RequestDatabaseBackupScheduleDeleteById,
} from "@/server/spec/databaseBackup/database.backup.requests";
import {
  zodBooleanTransform,
  zodDateTransform,
  zodIntTransform,
} from "./lib/zod.util";

export class DatabaseBackupRequestValidator
  implements IDatabaseBackupRequestValidator
{
  static instance: DatabaseBackupRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestDatabaseBackupScheduleCreate = z
    .object({
      title: z.string(),
      interval: z.number(),
      startAt: zodDateTransform,
      type: z.literal("full"),
    })
    .strict();

  createSchedule = (req: RequestDatabaseBackupScheduleCreate) => {
    try {
      const dto = this.requestDatabaseBackupScheduleCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupScheduleGetById = z
    .object({ id: zodIntTransform })
    .strict();

  getScheduleById = (req: RequestDatabaseBackupScheduleGetById) => {
    try {
      const dto = this.requestDatabaseBackupScheduleGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupScheduleGetListByQuery = z
    .object({
      page: zodIntTransform.optional(),
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      isActive: zodBooleanTransform.optional(),
      isLocked: zodBooleanTransform.optional(),
    })
    .strict();

  getScheduleListByQuery = (
    req: RequestDatabaseBackupScheduleGetListByQuery
  ) => {
    try {
      const dto = this.requestDatabaseBackupScheduleGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupScheduleUpdateById = z
    .object({
      id: zodIntTransform,
      title: z.string().optional(),
      interval: z.number().optional(),
      startAt: zodDateTransform.optional(),
      isActive: z.boolean().optional(),
      isLocked: z.boolean().optional(),
    })
    .strict();

  updateScheduleById = (req: RequestDatabaseBackupScheduleUpdateById) => {
    try {
      const dto = this.requestDatabaseBackupScheduleUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupScheduleDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  deleteScheduleById = (req: RequestDatabaseBackupScheduleDeleteById) => {
    try {
      const dto = this.requestDatabaseBackupScheduleDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupJobCreate = z
    .object({
      title: z.string().optional(),
    })
    .strict();

  createJob = (req: RequestDatabaseBackupJobCreate) => {
    try {
      const dto = this.requestDatabaseBackupJobCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupJobGetListByQuery = z
    .object({
      page: zodIntTransform.optional(),
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
    })
    .strict();

  getJobListByQuery = (req: RequestDatabaseBackupJobGetListByQuery) => {
    try {
      const dto = this.requestDatabaseBackupJobGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestDatabaseBackupJobGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  getJobById = (req: RequestDatabaseBackupJobGetById) => {
    try {
      const dto = this.requestDatabaseBackupJobGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
