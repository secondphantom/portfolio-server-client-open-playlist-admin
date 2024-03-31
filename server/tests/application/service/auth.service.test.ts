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
import { SessionRepo } from "@/server/infrastructure/repo/session.repo";
import { ISessionRepo } from "@/server/application/interfaces/session.repo";

describe("auth service", () => {
  const email = process.env.TEST_EMAIL_DESTINATION!;
  const invalidEmail = "invalid@email.com";
  const TEST_SESSION_ID = "TEST_SESSION_ID";
  let adminRepo: IAdminRepo;
  let sessionRepo: ISessionRepo;
  let emailUtil: IEmailUtil;
  let utils: IUtils;

  let authService: AuthService;

  beforeAll(() => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    adminRepo = AdminRepo.getInstance(dbClient);
    sessionRepo = SessionRepo.getInstance(dbClient);
    emailUtil = EmailUtil.getInstance();
    emailUtil.sendEmail = async () => ({ success: true });
    utils = Utils.getInstance();
    authService = new AuthService({
      adminRepo,
      sessionRepo,
      emailUtil,
      utils,
    });
  });

  describe("signIn", () => {
    test("invalid email", async () => {
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

  describe("verify otp code", () => {
    test("not found email", async () => {
      try {
        await authService.verifyOtp({ email: invalidEmail } as any);
      } catch (error: any) {
        expect(error.message).toBe("Unauthorized");
      }
    });

    test("not valid otp code", async () => {
      try {
        await authService.verifyOtp({
          email: invalidEmail,
          otpCode: "invalid",
        } as any);
      } catch (error: any) {
        expect(error.message).toBe("Unauthorized");
      }
    });

    test("success", async () => {
      await authService.signIn({ email });
      const admin = await adminRepo.getByEmail(email, {
        otpCode: true,
        otpExpirationAt: true,
      });

      const { sessionId } = await authService.verifyOtp({
        email: email,
        otpCode: admin?.otpCode,
        data: {},
      } as any);

      expect(sessionId).toEqual(expect.any(String));
    });
  });

  describe("verify sessionId", () => {
    test("fail", async () => {
      try {
        await authService.verifySession({ sessionId: "invalid" });
      } catch (error: any) {
        expect(error.message).toBe("Unauthorized");
      }
    });

    test("success", async () => {
      const { id, admin } = await authService.verifySession({
        sessionId: TEST_SESSION_ID,
      });

      expect(id).toEqual(TEST_SESSION_ID);
      expect(admin.id).toEqual(0);
    });
  });
});
