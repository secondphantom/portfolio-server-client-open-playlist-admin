import dotenv from "dotenv";
dotenv.config();

import { IHealthRepo } from "@/server/application/interfaces/health.repo";
import { HealthService } from "@/server/application/service/health.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { HealthRepo } from "@/server/infrastructure/repo/health.repo";
import { number } from "zod";

describe("health service", () => {
  let healthRepo: IHealthRepo;
  let healthService: HealthService;

  beforeAll(() => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    healthRepo = HealthRepo.getInstance(dbClient);
    healthService = HealthService.getInstance({
      healthRepo,
      env: {
        API_BASE_URL: process.env.API_BASE_URL!,
      },
    });
  });

  describe("createHealth", () => {
    test("success", async () => {
      await healthService.createHealth();
    });
  });

  describe("getHealthList", () => {
    test("success", async () => {
      const { healths } = await healthService.getHealthListByQuery({});

      for (const health of healths) {
        expect(health).toEqual(healthSchemaExpect);
      }
    });
  });

  describe("getHealthById", () => {
    test("fail", async () => {
      try {
        await healthService.getHealthById({ id: -1 });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      const health = await healthService.getHealthById({ id: 0 });

      expect(health).toEqual(healthSchemaExpect);
      expect(health.id).toEqual(0);
    });
  });
});

const healthSchemaExpect = expect.objectContaining({
  id: expect.any(Number),
  version: expect.any(Number),
  data: expect.any(Object),
  createdAt: expect.any(Date),
});
