import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { IRoleRepo } from "@/server/application/interfaces/role.repo";
import { RoleService } from "@/server/application/service/role.service";
import { Db, DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { RoleRepo } from "@/server/infrastructure/repo/role.repo";
import { eq } from "drizzle-orm";

describe("role service", () => {
  let roleRepo: IRoleRepo;
  let roleService: RoleService;
  let db: Db;
  let FIRST_ROLE_ID: number;
  let CONFLICT_ID = 100;
  let NON_CONFLICT_ID = 200;
  let DELETE_ROLE_ID = 300;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    roleRepo = RoleRepo.getInstance(dbClient);
    roleService = RoleService.getInstance({
      roleRepo,
    });

    db = dbClient.getDb();
    await db.delete(schema.roles).where(eq(schema.roles.id, CONFLICT_ID));
    await db.delete(schema.roles).where(eq(schema.roles.id, NON_CONFLICT_ID));
    await db.delete(schema.roles).where(eq(schema.roles.id, DELETE_ROLE_ID));
    const role = await db.query.roles.findFirst();
    FIRST_ROLE_ID = role!.id;
    await db
      .update(schema.roles)
      .set({
        name: "",
      })
      .where(eq(schema.roles.id, FIRST_ROLE_ID));
    await db.insert(schema.roles).values({
      id: CONFLICT_ID,
      name: "conflict",
    });
    await db.insert(schema.roles).values({
      id: DELETE_ROLE_ID,
      name: "deleted",
    });
  });

  afterAll(async () => {
    await db.delete(schema.roles).where(eq(schema.roles.id, CONFLICT_ID));
    await db.delete(schema.roles).where(eq(schema.roles.id, NON_CONFLICT_ID));
    await db.delete(schema.roles).where(eq(schema.roles.id, DELETE_ROLE_ID));
  });

  describe("createRole", () => {
    test("fail: conflict", async () => {
      try {
        await roleService.createRole({
          id: CONFLICT_ID,
          name: "conflict",
        });
      } catch (error: any) {
        expect(error.message).toBe("Conflict");
      }
    });
    test("success", async () => {
      await roleService.createRole({
        id: NON_CONFLICT_ID,
        name: "non conflict",
      });
      const role = await roleRepo.getById(NON_CONFLICT_ID);
      expect(role?.name).toEqual("non conflict");
    });
  });

  describe("getRoleListByQuery", () => {
    test("success", async () => {
      const result = await roleService.getRoleListByQuery({});
      for (const role of result.roles) {
        expect(role).toEqual(
          expect.objectContaining({
            ...roleSchemaExpect,
          })
        );
      }
    });
  });

  describe("getRoleById", () => {
    test("fail: not found", async () => {
      try {
        await roleService.getRoleById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const role = await roleService.getRoleById({
        id: FIRST_ROLE_ID,
      });
      expect(role).toEqual(
        expect.objectContaining({
          ...roleSchemaExpect,
        })
      );
    });
  });

  describe("updateRoleById", () => {
    test("fail: not found", async () => {
      try {
        await roleService.updateRoleById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await roleService.updateRoleById({
        id: FIRST_ROLE_ID,
        name: "UPDATED",
      });

      const role = await roleRepo.getById(FIRST_ROLE_ID);

      expect(role?.name).toEqual("UPDATED");
    });
  });

  describe("deleteRoleById", () => {
    test("success", async () => {
      await roleService.deleteRoleById({ id: DELETE_ROLE_ID });

      const role = await roleRepo.getById(DELETE_ROLE_ID);
      expect(role).toEqual(undefined);
    });
  });
});

const roleSchemaExpect = {
  id: expect.any(Number),
  name: expect.any(String),
  createdAt: expect.any(Date),
};
