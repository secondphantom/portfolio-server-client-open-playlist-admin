import { v4 as uuidv4 } from "uuid";
import { exec, execSync } from "child_process";
import {
  DatabaseBackupJobsEntityInsert,
  IDatabaseBackupJobRepo,
} from "../interfaces/database.backup.job.repo";
import { IDatabaseBackupScheduleRepo } from "../interfaces/database.backup.schedule.repo";
import { IUtils } from "../interfaces/utils";
import path from "path";
import { ENV } from "@/server/env";
import { IDiscordUtil } from "../interfaces/discord.util";

type C_ENV = Pick<
  ENV,
  "DATABASE_BACKUP_FOLDER_PATH" | "DOMAIN_URL" | "DATABASE_URL"
>;

type ServiceConstructorInputs = {
  databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  databaseBackupJobRepo: IDatabaseBackupJobRepo;
  discordUtil: IDiscordUtil;
  utils: IUtils;
  env: C_ENV;
};

export class DatabaseBackupServiceUtil {
  static instance: DatabaseBackupServiceUtil | undefined;
  static getInstance = (inputs: ServiceConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new DatabaseBackupServiceUtil(inputs);
    return this.instance;
  };

  private databaseBackupScheduleRepo: IDatabaseBackupScheduleRepo;
  private databaseBackupJobRepo: IDatabaseBackupJobRepo;
  private utils: IUtils;
  private env: C_ENV;
  private discordUtil: IDiscordUtil;

  constructor({
    databaseBackupScheduleRepo,
    databaseBackupJobRepo,
    utils,
    env,
    discordUtil,
  }: ServiceConstructorInputs) {
    this.databaseBackupScheduleRepo = databaseBackupScheduleRepo;
    this.databaseBackupJobRepo = databaseBackupJobRepo;
    this.utils = utils;
    this.env = env;
    this.discordUtil = discordUtil;
  }

  backupDatabaseBySchedule = async (scheduleId: number) => {
    let job: undefined | Awaited<ReturnType<typeof this.createJob>>;
    try {
      const schedule = await this.databaseBackupScheduleRepo.getById(
        scheduleId,
        {
          isLocked: true,
          isActive: true,
          type: true,
        }
      );

      if (!schedule || schedule.isLocked || !schedule.isActive) {
        return;
      }

      job = await this.createJob(`${schedule.type}-scheduled`);

      await this.databaseBackupScheduleRepo.updateByIdWithLock(scheduleId, {
        isLocked: true,
      });

      await this.dumpToFile(job);
      await this.databaseBackupJobRepo.updateByUuid(job.uuid, {
        status: "success",
      });
    } catch (error) {
      await this.databaseBackupJobRepo.updateByUuid(job!.uuid, {
        status: "fail",
      });
      const currentJob = await this.databaseBackupJobRepo.getByUuid(job!.uuid, {
        id: true,
      });
      await this.discordUtil.notify(
        {
          title: `Fail to run backup job_id:${currentJob?.id}`,
          description: `link: ${this.env.DOMAIN_URL}/cron/database-backup/jobs/${currentJob?.id}`,
        },
        { level: "error" }
      );
    } finally {
      await this.databaseBackupScheduleRepo.updateById(scheduleId, {
        isLocked: false,
      });
    }
  };

  backupDatabase = async (job: {
    title: string;
    createdAt: Date;
    status: string;
    uuid: string;
  }) => {
    try {
      await this.dumpToFile(job);
      await this.databaseBackupJobRepo.updateByUuid(job.uuid, {
        status: "success",
      });
    } catch (error) {
      await this.databaseBackupJobRepo.updateByUuid(job.uuid, {
        status: "fail",
      });
      const currentJob = await this.databaseBackupJobRepo.getByUuid(job.uuid, {
        id: true,
      });
      await this.discordUtil.notify(
        {
          title: `Fail to run backup job_id:${currentJob?.id}`,
          description: `link: ${this.env.DOMAIN_URL}/cron/database-backup/jobs/${currentJob?.id}`,
        },
        { level: "error" }
      );
    }
  };

  createJob = async (title: string) => {
    const now = new Date();
    const job = {
      title,
      createdAt: now,
      status: "running",
      uuid: uuidv4(),
    } satisfies DatabaseBackupJobsEntityInsert;
    await this.databaseBackupJobRepo.create(job);
    return job;
  };

  private dumpToFile = async (job: {
    title: string;
    createdAt: Date;
    uuid: string;
  }) => {
    const fileName = `backup_${this.utils.getTimeStamp(job.createdAt)}_${
      job.uuid
    }.tar.gz`;
    const filePath = path.join(this.env.DATABASE_BACKUP_FOLDER_PATH, fileName);

    await new Promise((resolve, reject) => {
      exec(
        `pg_dump --dbname=${this.env.DATABASE_URL} --format=tar | gzip > ${filePath}`,
        (error, stdout, stderr) => {
          if (error) {
            reject({ error: error, stderr: stderr.trimEnd() });
            return;
          }

          // check if archive is valid and contains data
          const isValidArchive =
            execSync(`gzip -cd ${filePath} | head -c1`).length == 1
              ? true
              : false;
          if (isValidArchive == false) {
            reject({
              error:
                "Backup archive file is invalid or empty; check for errors above",
            });
            return;
          }

          // not all text in stderr will be a critical error, print the error / warning
          if (stderr != "") {
            console.log({ stderr: stderr.trimEnd() });
          }

          // if stderr contains text, let the user know that it was potently just a warning message
          if (stderr != "") {
            console.log(
              `Potential warnings detected; Please ensure the backup file "${path.basename(
                filePath
              )}" contains all needed data`
            );
          }

          resolve(undefined);
        }
      );
    });
  };
}
