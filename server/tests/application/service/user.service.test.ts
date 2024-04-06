import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";

import { IUserCreditRepo } from "@/server/application/interfaces/user.credit.repo";
import { IUserRepo } from "@/server/application/interfaces/user.repo";
import { UserService } from "@/server/application/service/user.service";
import { Db, DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { UserRepo } from "@/server/infrastructure/repo/user.repo";

describe("session service", () => {
  let userRepo: IUserRepo;
  let userService: UserService;
  let FIRST_USER_ID: number;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    userRepo = UserRepo.getInstance(dbClient);
    userService = UserService.getInstance({
      userRepo,
    });

    const user = await dbClient.getDb().query.users.findFirst();
    FIRST_USER_ID = user!.id;
  });

  describe("getUserById", () => {
    test("fail: not found", async () => {
      try {
        await userService.getUserById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const user = await userService.getUserById({
        id: FIRST_USER_ID,
      });

      expect(user).toEqual(
        expect.objectContaining({
          ...userSchemaExpect,
          credit: creditSchemaExpect,
        })
      );
    });
  });

  describe("getUserListByQuery", () => {
    test("success", async () => {
      const result = await userService.getUserListByQuery({
        order: "old",
      });

      for (const user of result.users) {
        expect(user).toEqual(expect.objectContaining(userSchemaExpect));
      }
    });
  });

  describe("updateUserById", () => {
    test("fail: not found", async () => {
      try {
        await userService.getUserById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const dto = {
        id: FIRST_USER_ID,
        profileName: uuidv4(),
      };

      await userService.updateUserById(dto);

      const user = await userRepo.getById(FIRST_USER_ID)!;

      expect(user?.profileName).toEqual(dto.profileName);
    });
  });
});

const userSchemaExpect = {
  id: expect.any(Number),
  email: expect.any(String),
  isEmailVerified: expect.any(Boolean),
  profileImage: expect.any(Object),
  profileName: expect.any(String),
  roleId: expect.any(Number),
  updatedAt: expect.any(Date),
  createdAt: expect.any(Date),
};

const creditSchemaExpect = {
  freeCredits: expect.any(Number),
  purchasedCredits: expect.any(Number),
  freeCreditUpdatedAt: expect.any(Date),
  purchasedCreditUpdatedAt: expect.any(Date),
};
