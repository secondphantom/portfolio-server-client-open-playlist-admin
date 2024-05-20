import { DatabaseBackupService } from "@/server/application/service/database.backup.service";
import { IDatabaseBackupRequestValidator } from "./database.backup.interface";
import {
  RequestDatabaseBackupJobCreate,
  RequestDatabaseBackupJobGetById,
  RequestDatabaseBackupJobGetListByQuery,
  RequestDatabaseBackupScheduleCreate,
  RequestDatabaseBackupScheduleGetById,
  RequestDatabaseBackupScheduleGetListByQuery,
  RequestDatabaseBackupScheduleUpdateById,
} from "@/server/spec/databaseBackup/database.backup.requests";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  databaseBackupService: DatabaseBackupService;
  databaseBackupRequestValidator: IDatabaseBackupRequestValidator;
};

export class DatabaseBackupController {
  static instance: DatabaseBackupController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupController(inputs);
    return this.instance;
  };

  private databaseBackupRequestValidator: IDatabaseBackupRequestValidator;
  private databaseBackupService: DatabaseBackupService;

  constructor({
    databaseBackupRequestValidator,
    databaseBackupService,
  }: ControllerInputs) {
    this.databaseBackupRequestValidator = databaseBackupRequestValidator;
    this.databaseBackupService = databaseBackupService;
  }

  createSchedule = async (req: RequestDatabaseBackupScheduleCreate) => {
    try {
      const dto = this.databaseBackupRequestValidator.createSchedule(req);
      await this.databaseBackupService.createSchedule(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getScheduleById = async (req: RequestDatabaseBackupScheduleGetById) => {
    try {
      const dto = this.databaseBackupRequestValidator.getScheduleById(req);
      const data = await this.databaseBackupService.getScheduleById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getScheduleListByQuery = async (
    req: RequestDatabaseBackupScheduleGetListByQuery
  ) => {
    try {
      const dto =
        this.databaseBackupRequestValidator.getScheduleListByQuery(req);
      const data = await this.databaseBackupService.getScheduleListByQuery(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateScheduleById = async (req: RequestDatabaseBackupScheduleUpdateById) => {
    try {
      const dto = this.databaseBackupRequestValidator.updateScheduleById(req);
      await this.databaseBackupService.updateScheduleById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  createJob = async (req: RequestDatabaseBackupJobCreate) => {
    try {
      const dto = this.databaseBackupRequestValidator.createJob(req);
      await this.databaseBackupService.createJob(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getJobListByQuery = async (req: RequestDatabaseBackupJobGetListByQuery) => {
    try {
      const dto = this.databaseBackupRequestValidator.getJobListByQuery(req);
      const data = await this.databaseBackupService.getJobListByQuery(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getJobById = async (req: RequestDatabaseBackupJobGetById) => {
    try {
      const dto = this.databaseBackupRequestValidator.getJobById(req);
      const data = await this.databaseBackupService.getJobById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
