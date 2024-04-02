import dotenv from "dotenv";
dotenv.config();

import { IAdminRepo } from "@/server/application/interfaces/admin.repo";
import {
  AdminService,
  ServiceAdminGetListByQueryDto,
} from "@/server/application/service/admin.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { AdminRepo } from "@/server/infrastructure/repo/admin.repo";

describe("admin service", () => {
  let adminRepo: IAdminRepo;
  let adminService: AdminService;
  let CONFLICT_EMAIL = "conflict@email.com";
  let NON_CONFLICT_EMAIL = "nonConflict@email.com";
  let DELETE_EMAIL = "delete@email.com";
  let DELETE_ID = 0;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });

    adminRepo = AdminRepo.getInstance(dbClient);
    adminService = AdminService.getInstance({
      adminRepo,
    });

    await adminRepo.create({ email: CONFLICT_EMAIL, profileName: "conflict" });
    await adminRepo.create({ email: DELETE_EMAIL, profileName: "delete" });
    const admin = await adminRepo.getByEmail(DELETE_EMAIL, { id: true });

    DELETE_ID = admin!.id;
  });

  afterAll(async () => {
    await adminRepo.deleteByEmail(CONFLICT_EMAIL);
    await adminRepo.deleteByEmail(NON_CONFLICT_EMAIL);
  });

  describe("registerAdmin", () => {
    test("fail conflict", async () => {
      try {
        await adminService.registerAdmin({
          email: CONFLICT_EMAIL,
        });
      } catch (error: any) {
        expect(error.message).toBe("Conflict");
      }
    });
    test("success", async () => {
      await adminService.registerAdmin({
        email: NON_CONFLICT_EMAIL,
      });
    });
  });

  describe("getAdminListByQuery", () => {
    test("fail empty", async () => {
      const dto = { page: 100000 } satisfies ServiceAdminGetListByQueryDto;
      try {
        await adminService.getAdminListByQuery(dto);
      } catch (error: any) {
        expect(error.message).toBe("Empty");
      }
    });
    test("success", async () => {
      const result = await adminService.getAdminListByQuery({});
      for (const admin of result.admins) {
        expect(admin).toEqual(adminSchemaExpect);
      }
    });
  });

  describe("getAdminById", () => {
    test("fail not found", async () => {
      try {
        await adminService.getAdminById({ id: -1 });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const admin = await adminService.getAdminById({ id: 0 });

      expect(admin).toEqual(adminSchemaExpect);
    });
  });

  describe("deleteAdminById", () => {
    test("success", async () => {
      await adminService.deleteAdminById({ id: DELETE_ID });
      const admin = await adminRepo.getById(DELETE_ID);

      expect(admin).toEqual(undefined);
    });
  });
});

const adminSchemaExpect = expect.objectContaining({
  id: expect.any(Number),
  email: expect.any(String),
  roleId: expect.any(Number),
  profileName: expect.any(String),
  profileImage: expect.any(Object),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
});
