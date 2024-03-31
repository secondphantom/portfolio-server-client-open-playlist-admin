import dotenv from "dotenv";
dotenv.config();

import { AdminRepo } from "@/server/infrastructure/repo/admin.repo";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";

describe("admin repo", () => {
  let adminRepo: AdminRepo;
  const email = "test@email.com";

  beforeAll(() => {
    const client = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    adminRepo = AdminRepo.getInstance(client);
    adminRepo.updateByEmail(email, { profileName: "test" });
  });

  test("getByEmail", async () => {
    const admin = await adminRepo.getByEmail(email);

    expect(admin?.email).toEqual(email);
  });

  test("updateByEmail", async () => {
    await adminRepo.updateByEmail(email, { profileName: "updated" });

    const admin = await adminRepo.getByEmail(email);

    expect(admin?.profileName).toEqual("updated");
  });
});
