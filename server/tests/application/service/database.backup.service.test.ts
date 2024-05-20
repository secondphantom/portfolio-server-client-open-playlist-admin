import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../../.env.development") });

import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import {
  DatabaseBackupScheduleEntityInsert,
  IDatabaseBackupScheduleRepo,
} from "@/server/application/interfaces/database.backup.schedule.repo";
import {
  DatabaseBackupJobsEntityInsert,
  IDatabaseBackupJobRepo,
} from "@/server/application/interfaces/database.backup.job.repo";
import { DatabaseBackupService } from "@/server/application/service/database.backup.service";
import { DatabaseBackupServiceUtil } from "@/server/application/service/database.backup.service.util";
import { DatabaseBackupScheduleRepo } from "@/server/infrastructure/repo/database.backup.schedule.repo";
import { DatabaseBackupJobRepo } from "@/server/infrastructure/repo/database.backup.job.repo";
import { CronJob } from "@/server/infrastructure/cron/cron.job";

describe("database backup service", () => {
  let databaseBackupScheduleRepo: DatabaseBackupScheduleRepo;
  let databaseBackupJobRepo: DatabaseBackupJobRepo;
  let databaseBackupService: DatabaseBackupService;
  let databaseBackupServiceUtil: DatabaseBackupServiceUtil;
  const TEST_SCHEDULE = {
    title: "",
    interval: 0,
    startAt: new Date(),
    type: "full",
    id: 0,
    isActive: true,
    isLocked: false,
  } satisfies DatabaseBackupScheduleEntityInsert;

  const TEST_JOB = {
    title: "",
    uuid: "uuid",
    status: "running",
    id: 0,
  } satisfies DatabaseBackupJobsEntityInsert;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });

    databaseBackupScheduleRepo =
      DatabaseBackupScheduleRepo.getInstance(dbClient);
    databaseBackupJobRepo = DatabaseBackupJobRepo.getInstance(dbClient);

    databaseBackupService = DatabaseBackupService.getInstance({
      cronJob: CronJob.getInstance(),
      databaseBackupJobRepo,
      databaseBackupScheduleRepo,
      databaseBackupServiceUtil,
    });

    await Promise.all([
      databaseBackupScheduleRepo.deleteById(TEST_SCHEDULE.id),
      databaseBackupJobRepo.deleteById(TEST_JOB.id),
    ]);

    await Promise.all([
      databaseBackupScheduleRepo.create(TEST_SCHEDULE),
      databaseBackupJobRepo.create(TEST_JOB),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      databaseBackupScheduleRepo.deleteById(TEST_SCHEDULE.id),
      databaseBackupJobRepo.deleteById(TEST_JOB.id),
    ]);
  });

  describe("getScheduleById", () => {
    test("fail: not found", async () => {
      try {
        await databaseBackupService.getScheduleById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const result = await databaseBackupService.getScheduleById({
        id: TEST_SCHEDULE.id,
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...databaseBackupScheduleSchemaExpect,
        })
      );
    });
  });

  describe("getScheduleListByQuery", () => {
    test("success", async () => {
      const result = await databaseBackupService.getScheduleListByQuery({});

      for (const course of result.schedules) {
        expect(course).toEqual(
          expect.objectContaining({
            ...databaseBackupScheduleSchemaExpect,
          })
        );
      }
    });
  });

  describe("updateScheduleById", () => {
    test("fail: not found", async () => {
      try {
        await databaseBackupService.updateScheduleById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
  });

  describe("getJobListByQuery", () => {
    test("success", async () => {
      const result = await databaseBackupService.getJobListByQuery({});

      for (const course of result.jobs) {
        expect(course).toEqual(
          expect.objectContaining({
            ...databaseBackupJobsSchemaExpect,
          })
        );
      }
    });
  });

  describe("getJobById", () => {
    test("fail: not found", async () => {
      try {
        await databaseBackupService.getJobById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const result = await databaseBackupService.getJobById({
        id: TEST_JOB.id,
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...databaseBackupJobsSchemaExpect,
        })
      );
    });
  });
});

const databaseBackupScheduleSchemaExpect = {
  id: expect.any(Number),
  title: expect.any(String),
  interval: expect.any(Number),
  startAt: expect.any(Date),
  type: expect.any(String),
  isActive: expect.any(Boolean),
  isLocked: expect.any(Boolean),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};

const databaseBackupJobsSchemaExpect = {
  id: expect.any(Number),
  uuid: expect.any(String),
  title: expect.any(String),
  status: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};
