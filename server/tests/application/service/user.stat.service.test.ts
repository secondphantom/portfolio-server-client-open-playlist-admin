import dotenv from "dotenv";
dotenv.config();

import { IEnrollRepo } from "@/server/application/interfaces/enroll.repo";
import { IUserRepo } from "@/server/application/interfaces/user.repo";
import { IUserStatRepo } from "@/server/application/interfaces/user.stat.repo";
import { UserStatService } from "@/server/application/service/user.stat.service";
import {
  UserStatEntityInsert,
  UserStatEntitySelect,
} from "@/server/domain/user.stat.domain";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { EnrollRepo } from "@/server/infrastructure/repo/enroll.repo";
import { UserRepo } from "@/server/infrastructure/repo/user.repo";
import { UserStatRepo } from "@/server/infrastructure/repo/user.stat.repo";

describe("user stat service", () => {
  let userStatRepo: IUserStatRepo;
  let enrollRepo: IEnrollRepo;
  let userRepo: IUserRepo;
  const conflictDto = {
    version: 1,
    eventAt: new Date("2024-03-03"),
  };
  const createNewDto = {
    version: 1,
    eventAt: new Date("2024-04-04"),
  };

  let userStatService: UserStatService;

  const deleteData = async () => {
    await userStatRepo.deleteByVersionAndEventAt({
      version: conflictDto.version,
      eventAt: conflictDto.eventAt,
    });
    await userStatRepo.deleteByVersionAndEventAt({
      version: createNewDto.version,
      eventAt: createNewDto.eventAt,
    });
  };

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });

    userRepo = UserRepo.getInstance(dbClient);
    enrollRepo = EnrollRepo.getInstance(dbClient);
    userStatRepo = UserStatRepo.getInstance(dbClient);
    userStatService = UserStatService.getInstance({
      userStatRepo,
      enrollRepo,
      userRepo,
    });

    await deleteData();
    await userStatRepo.create({
      ...conflictDto,
      data: { total: 0, dau: 0, mau: 0, wau: 0 },
    });
  });

  afterAll(async () => {
    await deleteData();
  });

  describe("createUserStat", () => {
    test("fail: conflict", async () => {
      try {
        await userStatService.crateUserStat(conflictDto);
      } catch (error: any) {
        expect(error.message).toBe("Conflict");
      }
    });
    test("success ", async () => {
      await userStatService.crateUserStat(createNewDto);
    });
  });

  describe("getUserStatListByQuery", () => {
    test("success", async () => {
      const result = await userStatService.getUserStatListByQuery({
        version: 1,
        startDate: new Date(null as any),
        endDate: new Date("2025-01-02"),
      });

      for (const userStat of result.userStats) {
        expect(userStat).toEqual(expect.objectContaining(userStatSchemaExpect));
      }
    });
  });

  describe("getUserStatByVersionAndEventAt", () => {
    test("fail: Not Found", async () => {
      try {
        await userStatService.getUserStatByVersionAndEventAt({
          eventAt: new Date("2025-01-1"),
          version: 1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      const userStat = await userStatService.getUserStatByVersionAndEventAt({
        ...conflictDto,
      });

      expect(userStat).toEqual(expect.objectContaining(userStatSchemaExpect));
    });
  });
});

const userStatSchemaExpect = {
  version: expect.any(Number),
  eventAt: expect.any(Date),
  data: expect.any(Object),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};
