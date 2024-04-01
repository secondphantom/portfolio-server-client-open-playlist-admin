import dotenv from "dotenv";
dotenv.config();

import { RepoCreateSessionDto } from "@/server/domain/session.domain";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { SessionRepo } from "@/server/infrastructure/repo/session.repo";

describe("session repo", () => {
  let sessionRepo: SessionRepo;
  const TEST_SESSION_ID = "TEST_SESSION_ID";

  beforeAll(async () => {
    const client = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    sessionRepo = SessionRepo.getInstance(client);
    await sessionRepo.deleteBySessionKey(TEST_SESSION_ID);
  });

  test("create", async () => {
    const dto = {
      adminId: 0,
      data: {} as any,
      sessionKey: TEST_SESSION_ID,
    } satisfies RepoCreateSessionDto;

    await sessionRepo.create(dto);
    const session = await sessionRepo.getBySessionKey(TEST_SESSION_ID);

    expect(session?.sessionKey).toEqual(dto.sessionKey);
  });

  test("getBySessionKey", async () => {
    const session = await sessionRepo.getBySessionKey(TEST_SESSION_ID);

    expect(session?.sessionKey).toEqual(TEST_SESSION_ID);
  });
});
