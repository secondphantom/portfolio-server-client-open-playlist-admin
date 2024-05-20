import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../../.env.development") });

import { DatabaseBackupServiceUtil } from "@/server/application/service/database.backup.service.util";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { DatabaseBackupScheduleRepo } from "@/server/infrastructure/repo/database.backup.schedule.repo";
import { DatabaseBackupJobRepo } from "@/server/infrastructure/repo/database.backup.job.repo";
import { DiscordUtil } from "@/server/infrastructure/discord/discord.util";
import { Utils } from "@/server/infrastructure/utils/utils";
import { DatabaseBackupScheduleEntityInsert } from "@/server/application/interfaces/database.backup.schedule.repo";

describe("Database Backup Service Util", () => {
  let databaseBackupServiceUtil: DatabaseBackupServiceUtil;
  let databaseBackupScheduleRepo: DatabaseBackupScheduleRepo;
  let databaseBackupJobRepo: DatabaseBackupJobRepo;
  const TEST_SCHEDULE = {
    id: 0,
    interval: 0,
    startAt: new Date(),
    title: "",
    type: "full",
    isLocked: false,
    isActive: true,
  } satisfies DatabaseBackupScheduleEntityInsert;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });

    databaseBackupScheduleRepo =
      DatabaseBackupScheduleRepo.getInstance(dbClient);
    databaseBackupJobRepo = DatabaseBackupJobRepo.getInstance(dbClient);
    const discordUtil = DiscordUtil.getInstance({
      DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL!,
    });
    const utils = Utils.getInstance();

    databaseBackupServiceUtil = DatabaseBackupServiceUtil.getInstance({
      databaseBackupJobRepo,
      databaseBackupScheduleRepo,
      discordUtil,
      utils,
      env: {
        DATABASE_BACKUP_FOLDER_PATH: process.env.DATABASE_BACKUP_FOLDER_PATH!,
        DATABASE_URL: process.env.DATABASE_URL!,
        DOMAIN_URL: process.env.DOMAIN_URL!,
      },
    });

    await databaseBackupScheduleRepo.deleteById(TEST_SCHEDULE.id);
    await databaseBackupScheduleRepo.create(TEST_SCHEDULE);
  });

  afterAll(async () => {
    await databaseBackupScheduleRepo.deleteById(TEST_SCHEDULE.id);
  });

  test.skip("dumpToFile", async () => {
    await databaseBackupServiceUtil["dumpToFile"]({
      title: "TEST",
      createdAt: new Date(),
      uuid: "UUID",
    });
  }, 30000);

  describe.skip("backup", () => {
    test("success", async () => {
      await databaseBackupServiceUtil.backupDatabase(TEST_SCHEDULE.id);
    }, 30000);
  });
});
