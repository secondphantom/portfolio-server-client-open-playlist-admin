import { DatabaseBackupScheduleEntityInsert } from "@/server/application/interfaces/database.backup.schedule.repo";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { DatabaseBackupScheduleRepo } from "@/server/infrastructure/repo/database.backup.schedule.repo";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../../.env.development") });

describe("Database Backup Schedule Repo", () => {
  let databaseBackupScheduleRepo: DatabaseBackupScheduleRepo;
  const TEST_SCHEDULE = {
    id: 0,
    interval: 0,
    startAt: new Date(),
    title: "",
    type: "full",
  } satisfies DatabaseBackupScheduleEntityInsert;

  beforeAll(async () => {
    const client = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
    });
    databaseBackupScheduleRepo = DatabaseBackupScheduleRepo.getInstance(client);
    await databaseBackupScheduleRepo.deleteById(TEST_SCHEDULE.id);
    await databaseBackupScheduleRepo.create(TEST_SCHEDULE);
  });

  test("updateByIdWithLock", async () => {
    await Promise.allSettled(
      Array.from({ length: 2 }, (_, i) => i).map((index) =>
        databaseBackupScheduleRepo.updateByIdWithLock(TEST_SCHEDULE.id, {
          interval: index + 1,
        })
      )
    );

    const result = await databaseBackupScheduleRepo.getById(TEST_SCHEDULE.id);

    expect(result?.interval).toEqual(2);
  });
});
