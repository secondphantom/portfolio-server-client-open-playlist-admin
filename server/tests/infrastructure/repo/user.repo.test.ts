import * as dateMath from "date-arithmetic";
import dotenv from "dotenv";
dotenv.config();

import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { UserRepo } from "@/server/infrastructure/repo/user.repo";

describe("user repo", () => {
  let userRepo: UserRepo;

  beforeAll(async () => {
    const client = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
    });
    userRepo = UserRepo.getInstance(client);
  });

  test("getTotalUserByPeriod", async () => {
    const lte = new Date();
    const gte = dateMath.add(lte, -30, "day");

    const totalUser = await userRepo.getTotalUserByPeriod({
      gte,
      lte,
    });

    expect(totalUser).toEqual(expect.any(Number));
  });
});
