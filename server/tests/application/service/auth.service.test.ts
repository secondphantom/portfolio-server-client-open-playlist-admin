import dotenv from "dotenv";
dotenv.config();

import { IAdminRepo } from "@/server/application/interfaces/admin.repo";
import { IEmailUtil } from "@/server/application/interfaces/email.util";
import { IUtils } from "@/server/application/interfaces/utils";
import { AuthService } from "@/server/application/service/auth.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { AdminRepo } from "@/server/infrastructure/repo/admin.repo";
import { EmailUtil } from "@/server/infrastructure/email/email.util";
import { Utils } from "@/server/infrastructure/utils/utils";

describe("auth service", () => {
  const email = "test@email.com";
  const invalidEmail = "invalid@email.com";

  let adminRepo: IAdminRepo;
  let emailUtil: IEmailUtil;
  let utils: IUtils;

  let authService: AuthService;

  beforeAll(() => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    adminRepo = AdminRepo.getInstance(dbClient);
    emailUtil = EmailUtil.getInstance();
    utils = Utils.getInstance();
    authService = new AuthService({
      adminRepo,
      emailUtil,
      utils,
    });
  });

  describe("signIn", () => {
    test.only("invalid email", async () => {
      try {
        await authService.signIn({ email: invalidEmail });
      } catch (error: any) {
        expect(error.message).toBe("Unauthorized");
      }
    });

    test("success", async () => {
      const admin = await adminRepo.getByEmail(email, {
        otpCode: true,
        otpExpirationAt: true,
      });
      await authService.signIn({ email });

      const updatedAdmin = await adminRepo.getByEmail(email, {
        otpCode: true,
        otpExpirationAt: true,
      });

      if (updatedAdmin?.otpCode) {
        expect(admin?.otpCode).not.toEqual(updatedAdmin?.otpCode);
        expect(
          updatedAdmin?.otpExpirationAt.getTime() > new Date().getTime()
        ).toEqual(true);
      }
    });
  });
});
