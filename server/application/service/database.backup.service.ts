import { ServerError } from "@/server/dto/error";
import { IDatabaseBackupScheduleRepo } from "../interfaces/database.backup.schedule.repo";
import { ICronJobs } from "../interfaces/cron.jobs";
import {
  DatabaseBackupJobsInsert,
  IDatabaseBackupJobRepo,
} from "../interfaces/database.backup.job.repo";

import { IUtils } from "../interfaces/utils";
import { DatabaseBackupServiceUtil } from "./database.backup.service.util";
import { ENV } from "@/server/env";

export type ServiceDatabaseBackupScheduleCreateDto = {
  title: string;
  interval: number;
  startAt: Date;
  type: "full";
};

export type ServiceDatabaseBackupScheduleGetByIdDto = {
  id: number;
};

export type ServiceDatabaseBackupScheduleGetListByQueryDto = {
  page?: number;
  order?: "recent" | "old";
  isActive?: boolean;
  isLocked?: boolean;
};

export type ServiceDatabaseBackupScheduleUpdateDto = {
  id: number;
  title?: string;
  interval?: number;
  startAt?: Date;
  isActive?: boolean;
  isLocked?: boolean;
};

export type ServiceDatabaseBackupJobGetListByQueryDto = {
  page?: number;
  order?: "recent" | "old";
};

export type ServiceDatabaseBackupJobGetByIdDto = {
  id: number;
};

type ServiceConstructorInputs = {
  databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  databaseBackupJobRepo: IDatabaseBackupJobRepo;
  discordUtil: IDiscordUtil;
  cronJobs: ICronJobs;
  utils: IUtils;
  env: ENV;
};

export class DatabaseBackupService {
  static instance: DatabaseBackupService | undefined;
  static getInstance = (inputs: ServiceConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupService(inputs);
    return this.instance;
  };

  private databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  private cronJobs: ICronJobs;
  private databaseBackupJobRepo: IDatabaseBackupJobRepo;
  private serviceUtil: DatabaseBackupServiceUtil;

  constructor({
    databaseBackupScheduleRepo,
    databaseBackupJobRepo,
    discordUtil,
    cronJobs,
    utils,
    env,
  }: ServiceConstructorInputs) {
    this.databaseBackupScheduleRepo = databaseBackupScheduleRepo;
    this.databaseBackupJobRepo = databaseBackupJobRepo;
    this.cronJobs = cronJobs;
    this.serviceUtil = DatabaseBackupServiceUtil.getInstance({
      databaseBackupJobRepo,
      databaseBackupScheduleRepo,
      discordUtil,
      utils,
      env,
    });
  }

  // POST /database/backup/schedules?
  createSchedule = async (dto: ServiceDatabaseBackupScheduleCreateDto) => {
    await this.databaseBackupScheduleRepo.create(dto);
  };

  // GET /database/backup/schedules/:id
  getScheduleById = async (dto: ServiceDatabaseBackupScheduleGetByIdDto) => {
    const schedule = await this.databaseBackupScheduleRepo.getById(dto.id, {
      id: true,
      title: true,
      interval: true,
      startAt: true,
      type: true,
      isActive: true,
      isLocked: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!schedule) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return schedule;
  };

  // GET /database/backup/schedules?
  getScheduleListByQuery = async ({
    page,
    order,
    isActive,
    isLocked,
  }: ServiceDatabaseBackupScheduleGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const schedules = await this.databaseBackupScheduleRepo.getListByQuery({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      order: order ? order : "recent",
      isActive,
      isLocked,
    });

    if (schedules.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          schedules: [],
          pagination,
        },
      });
    }

    return {
      schedules,
      pagination,
    };
  };

  // PATCH /database/backup/schedules/:id
  updateScheduleById = async (dto: ServiceDatabaseBackupScheduleUpdateDto) => {
    const schedule = await this.databaseBackupScheduleRepo.getById(dto.id, {
      id: true,
      title: true,
      interval: true,
      startAt: true,
      type: true,
      isActive: true,
      isLocked: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!schedule) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    if (schedule.isLocked) {
      throw new ServerError({
        code: 423,
        message: "Is Locked",
      });
    }

    const newSchedule = {
      ...schedule,
      ...dto,
    };

    await this.cronJobs.deleteById(newSchedule.id);
    if (newSchedule.isActive) {
      await this.cronJobs.register(
        dto.id,
        () => this.serviceUtil.backup(newSchedule.id),
        {
          interval: newSchedule.interval,
          startAt: newSchedule.startAt,
        }
      );
    }

    await this.databaseBackupScheduleRepo.updateById(dto.id, {
      ...dto,
      id: undefined,
    });
  };

  // GET /database/backup/jobs?
  getJobListByQuery = async ({
    page,
    order,
  }: ServiceDatabaseBackupJobGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const jobs = await this.databaseBackupJobRepo.getListByQuery({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      order: order ? order : "recent",
    });

    if (jobs.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          jobs: [],
          pagination,
        },
      });
    }

    return {
      jobs,
      pagination,
    };
  };

  // GET /database/backup/jobs/:id
  getJobById = async (dto: ServiceDatabaseBackupJobGetByIdDto) => {
    const job = await this.databaseBackupJobRepo.getById(dto.id, {
      id: true,
      title: true,
      createdAt: true,
      uuid: true,
      status: true,
    });

    if (!job) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return job;
  };
}
