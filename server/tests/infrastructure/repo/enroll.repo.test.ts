import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { EnrollRepo } from "@/server/infrastructure/repo/enroll.repo";
import * as dateMath from "date-arithmetic";
import dotenv from "dotenv";
dotenv.config();

describe("enroll repo", () => {
  let enrollRepo: EnrollRepo;

  beforeAll(async () => {
    const client = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
    });
    enrollRepo = EnrollRepo.getInstance(client);
  });

  test("getActiveUserByPeriod", async () => {
    const lte = new Date();
    const gte = dateMath.add(lte, -30, "day");

    const activeUser = await enrollRepo.getActiveUserByPeriod({
      gte,
      lte,
    });

    expect(activeUser).toEqual(expect.any(Number));
  });
});
