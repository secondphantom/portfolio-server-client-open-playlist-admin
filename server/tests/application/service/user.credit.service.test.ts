import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

import { IUserCreditRepo } from "@/server/application/interfaces/user.credit.repo";
import {
  ServiceUserCreditUpdateDto,
  UserCreditService,
} from "@/server/application/service/user.credit.service";
import { Db, DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { UserCreditRepo } from "@/server/infrastructure/repo/user.credit.repo";
import { IUserRepo } from "@/server/application/interfaces/user.repo";
import { UserRepo } from "@/server/infrastructure/repo/user.repo";

describe("session credit service", () => {
  let userRepo: IUserRepo;
  let userCreditRepo: IUserCreditRepo;
  let userCreditService: UserCreditService;
  let FIRST_USER_ID: number;
  let db: Db;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    userRepo = UserRepo.getInstance(dbClient);
    userCreditRepo = UserCreditRepo.getInstance(dbClient);
    userCreditService = UserCreditService.getInstance({
      userCreditRepo,
      userRepo,
    });

    db = dbClient.getDb();

    const user = await db.query.users.findFirst();
    FIRST_USER_ID = user!.id;
  });

  describe("updateUserCredit", () => {
    test("fail: not found", async () => {
      try {
        await userCreditService.updateUserCredit({
          userId: -1,
          credit: {},
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      const dto = {
        userId: FIRST_USER_ID,
        credit: {
          freeCredits: faker.number.int({ max: 100 }),
          purchasedCredits: faker.number.int({ max: 100 }),
        },
      } satisfies ServiceUserCreditUpdateDto;

      await userCreditService.updateUserCredit(dto);

      const userCredit = await db.query.userCredits.findFirst({
        where: (value, { eq }) => {
          return eq(value.userId, FIRST_USER_ID);
        },
      });

      expect(userCredit?.freeCredits).toEqual(dto.credit.freeCredits);
      expect(userCredit?.purchasedCredits).toEqual(dto.credit.purchasedCredits);
    });
  });
});
