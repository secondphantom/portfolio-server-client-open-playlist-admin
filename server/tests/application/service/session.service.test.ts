import dotenv from "dotenv";
dotenv.config();

import { ISessionRepo } from "@/server/application/interfaces/session.repo";
import { SessionService } from "@/server/application/service/session.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { SessionRepo } from "@/server/infrastructure/repo/session.repo";

describe("session service", () => {
  let sessionRepo: ISessionRepo;
  let sessionService: SessionService;
  const TEST_ADMIN_ID = 0;
  const TEST_SESSION_KEY = "TEST_SESSION_KEY";

  beforeAll(() => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });

    sessionRepo = SessionRepo.getInstance(dbClient);
    sessionService = SessionService.getInstance({
      sessionRepo,
    });
  });

  describe("getSessionListByQuery", () => {
    test("success", async () => {
      const result = await sessionService.getSessionListByQuery({
        adminId: TEST_ADMIN_ID,
        id: 1,
      });

      for (const session of result.sessions) {
        expect(session).toEqual(sessionSchemaExpect);
      }
    });
  });
  describe("getSessionsById", () => {
    test("not found", async () => {
      try {
        await sessionService.getSessionsById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const session = await sessionService.getSessionsById({
        id: 1,
      });
      expect(session).toEqual(sessionSchemaExpect);
      expect(session.isCurrent).toEqual(true);
    });
  });
});

const sessionSchemaExpect = expect.objectContaining({
  id: expect.any(Number),
  adminId: expect.any(Number),
  data: expect.any(Object),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  isCurrent: expect.any(Boolean),
});
