import { ServerError } from "@/server/dto/error";
import { IDatabaseBackupScheduleRepo } from "../interfaces/database.backup.schedule.repo";
import { ICronJob } from "../interfaces/cron.jobs";
import { IDatabaseBackupJobRepo } from "../interfaces/database.backup.job.repo";

import { DatabaseBackupServiceUtil } from "./database.backup.service.util";

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

export type ServiceDatabaseBackupScheduleUpdateByIdDto = {
  id: number;
  title?: string;
  interval?: number;
  startAt?: Date;
  isActive?: boolean;
  isLocked?: boolean;
  type?: string;
};

export type ServiceDatabaseBackupScheduleDeleteByIdDto = {
  id: number;
};

export type ServiceDatabaseBackupJobGetListByQueryDto = {
  page?: number;
  order?: "recent" | "old";
};

export type ServiceDatabaseBackupJobGetByIdDto = {
  id: number;
};

export type ServiceDatabaseBackupJobCreateDto = {
  title?: string;
};

export type ServiceDatabaseBackupJobDeleteByIdDto = {
  id: number;
};

type ServiceConstructorInputs = {
  databaseBackupServiceUtil: DatabaseBackupServiceUtil;
  databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  databaseBackupJobRepo: IDatabaseBackupJobRepo;
  cronJob: ICronJob;
};

export class DatabaseBackupService {
  static instance: DatabaseBackupService | undefined;
  static getInstance = (inputs: ServiceConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupService(inputs);
    this.instance.init();
    return this.instance;
  };

  private CRON_JOB_ID_PREFIX = "database-backup-";

  private databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  private cronJob: ICronJob;
  private databaseBackupJobRepo: IDatabaseBackupJobRepo;
  private serviceUtil: DatabaseBackupServiceUtil;

  constructor({
    databaseBackupServiceUtil,
    databaseBackupScheduleRepo,
    databaseBackupJobRepo,
    cronJob,
  }: ServiceConstructorInputs) {
    this.databaseBackupScheduleRepo = databaseBackupScheduleRepo;
    this.databaseBackupJobRepo = databaseBackupJobRepo;
    this.cronJob = cronJob;
    this.serviceUtil = databaseBackupServiceUtil;
  }

  init = async () => {
    await this.initSchedule();
  };

  private initSchedule = async () => {
    console.log("init schedule");

    const schedules = await this.databaseBackupScheduleRepo.getAllListByQuery(
      {
        isActive: true,
        isLocked: false,
      },
      {
        id: true,
        interval: true,
        startAt: true,
      }
    );

    for (const { id, interval, startAt } of schedules) {
      this.cronJob.deleteById(this.CRON_JOB_ID_PREFIX + id);
      this.cronJob.register(
        this.CRON_JOB_ID_PREFIX + id,
        () => this.serviceUtil.backupDatabaseBySchedule(id),
        {
          interval: interval,
          startAt: startAt,
        }
      );
    }
  };

  // POST /cron/database-backup/schedules?
  createSchedule = async (dto: ServiceDatabaseBackupScheduleCreateDto) => {
    await this.databaseBackupScheduleRepo.create(dto);
  };

  // GET /cron/database-backup/schedules/:id
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

  // GET /cron/database-backup/schedules?
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

  // PATCH /cron/database-backup/schedules/:id
  updateScheduleById = async (
    dto: ServiceDatabaseBackupScheduleUpdateByIdDto
  ) => {
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

    const newSchedule = {
      ...schedule,
      ...dto,
    };

    this.cronJob.deleteById(this.CRON_JOB_ID_PREFIX + newSchedule.id);
    if (newSchedule.isActive) {
      this.cronJob.register(
        this.CRON_JOB_ID_PREFIX + dto.id,
        () => this.serviceUtil.backupDatabaseBySchedule(newSchedule.id),
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

  //DELETE /cron/database-backup/schedules/:id
  deleteScheduleById = async (
    dto: ServiceDatabaseBackupScheduleDeleteByIdDto
  ) => {
    const schedule = await this.databaseBackupScheduleRepo.getById(dto.id, {
      id: true,
    });

    if (!schedule) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.databaseBackupScheduleRepo.deleteById(schedule.id);

    this.cronJob.deleteById(this.CRON_JOB_ID_PREFIX + schedule.id);
  };

  //POST /cron/database-backup/jobs?
  createJob = async ({ title }: ServiceDatabaseBackupJobCreateDto) => {
    const job = await this.serviceUtil.createJob(
      title ? title : `manual created`
    );
    this.serviceUtil.backupDatabase(job);
  };

  // GET /cron/database-backup/jobs?
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

  // GET /cron/database-backup/jobs/:id
  getJobById = async (dto: ServiceDatabaseBackupJobGetByIdDto) => {
    const job = await this.databaseBackupJobRepo.getById(dto.id, {
      id: true,
      title: true,
      createdAt: true,
      uuid: true,
      status: true,
      updatedAt: true,
    });

    if (!job) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return job;
  };

  //DELETE /cron/database-backup/jobs/:id
  deleteJobById = async (dto: ServiceDatabaseBackupJobDeleteByIdDto) => {
    const job = await this.databaseBackupJobRepo.getById(dto.id, {
      id: true,
    });

    if (!job) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.databaseBackupJobRepo.deleteById(job.id);
  };
}
