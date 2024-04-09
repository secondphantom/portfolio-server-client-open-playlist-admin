import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { ICategoryRepo } from "@/server/application/interfaces/category.repo";
import { CategoryService } from "@/server/application/service/category.service";
import { Db, DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { CategoryRepo } from "@/server/infrastructure/repo/category.repo";
import { eq } from "drizzle-orm";

describe("category service", () => {
  let categoryRepo: ICategoryRepo;
  let categoryService: CategoryService;
  let db: Db;
  let FIRST_CATEGORY_ID: number;
  let CONFLICT_ID = 100;
  let NON_CONFLICT_ID = 200;
  let DELETE_CATEGORY_ID = 300;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    categoryRepo = CategoryRepo.getInstance(dbClient);
    categoryService = CategoryService.getInstance({
      categoryRepo,
    });

    db = dbClient.getDb();
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, CONFLICT_ID));
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, NON_CONFLICT_ID));
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, DELETE_CATEGORY_ID));
    const category = await db.query.categories.findFirst();
    FIRST_CATEGORY_ID = category!.id;
    await db
      .update(schema.categories)
      .set({
        name: "",
      })
      .where(eq(schema.categories.id, FIRST_CATEGORY_ID));
    await db.insert(schema.categories).values({
      id: CONFLICT_ID,
      name: "conflict",
      parentId: 0,
    });
    await db.insert(schema.categories).values({
      id: DELETE_CATEGORY_ID,
      name: "deleted",
      parentId: 0,
    });
  });

  afterAll(async () => {
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, CONFLICT_ID));
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, NON_CONFLICT_ID));
    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, DELETE_CATEGORY_ID));
  });

  describe("createCategory", () => {
    test("fail: conflict", async () => {
      try {
        await categoryService.createCategory({
          id: CONFLICT_ID,
          name: "conflict",
          parentId: 0,
        });
      } catch (error: any) {
        expect(error.message).toBe("Conflict");
      }
    });
    test("success", async () => {
      await categoryService.createCategory({
        id: NON_CONFLICT_ID,
        name: "non conflict",
        parentId: 0,
      });
      const category = await categoryRepo.getById(NON_CONFLICT_ID);
      expect(category?.name).toEqual("non conflict");
    });
  });

  describe("getCategoryListByQuery", () => {
    test("success", async () => {
      const result = await categoryService.getCategoryListByQuery({});
      for (const category of result.categories) {
        expect(category).toEqual(
          expect.objectContaining({
            ...categorySchemaExpect,
          })
        );
      }
    });
  });

  describe("getCategoryById", () => {
    test("fail: not found", async () => {
      try {
        await categoryService.getCategoryById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const category = await categoryService.getCategoryById({
        id: FIRST_CATEGORY_ID,
      });
      expect(category).toEqual(
        expect.objectContaining({
          ...categorySchemaExpect,
        })
      );
    });
  });

  describe("updateCategoryById", () => {
    test("fail: not found", async () => {
      try {
        await categoryService.updateCategoryById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await categoryService.updateCategoryById({
        id: FIRST_CATEGORY_ID,
        name: "UPDATED",
      });

      const category = await categoryRepo.getById(FIRST_CATEGORY_ID);

      expect(category?.name).toEqual("UPDATED");
    });
  });

  describe("deleteCategoryById", () => {
    test("success", async () => {
      await categoryService.deleteCategoryById({ id: DELETE_CATEGORY_ID });

      const category = await categoryRepo.getById(DELETE_CATEGORY_ID);
      expect(category).toEqual(undefined);
    });
  });
});

const categorySchemaExpect = {
  id: expect.any(Number),
  name: expect.any(String),
  parentId: expect.any(Number),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};
