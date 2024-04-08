import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { ICourseRepo } from "@/server/application/interfaces/course.repo";
import { CourseService } from "@/server/application/service/course.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { CourseRepo } from "@/server/infrastructure/repo/course.repo";
import { eq } from "drizzle-orm";

describe("course service", () => {
  let courseRepo: ICourseRepo;
  let courseService: CourseService;
  let FIRST_COURSE_ID: number;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    courseRepo = CourseRepo.getInstance(dbClient);
    courseService = CourseService.getInstance({
      courseRepo,
    });

    const course = await dbClient.getDb().query.courses.findFirst();
    FIRST_COURSE_ID = course!.id;
    await dbClient
      .getDb()
      .update(schema.courses)
      .set({
        title: "",
      })
      .where(eq(schema.courses.id, FIRST_COURSE_ID));
  });

  describe("getCourseListByQuery", () => {
    test("success", async () => {
      const result = await courseService.getCourseListByQuery({});

      for (const course of result.courses) {
        expect(course).toEqual(
          expect.objectContaining({
            ...courseSchemaExpect,
            channel: channelSchemaExpect,
          })
        );
      }
    });
  });

  describe("getCourseById", () => {
    test("fail: not found", async () => {
      try {
        await courseService.getCourseById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const course = await courseService.getCourseById({
        id: FIRST_COURSE_ID,
      });
      expect(course).toEqual(
        expect.objectContaining({
          ...courseSchemaExpect,
          channel: channelSchemaExpect,
        })
      );
    });
  });

  describe("updateCourseById", () => {
    test("fail: not found", async () => {
      try {
        await courseService.updateCourseById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await courseService.updateCourseById({
        id: FIRST_COURSE_ID,
        title: "UPDATED",
      });

      const course = await courseRepo.getById(FIRST_COURSE_ID);

      expect(course?.title).toEqual("UPDATED");
    });
  });
});

const courseSchemaExpect = {
  id: expect.any(Number),
  version: expect.any(Number),
  videoId: expect.any(String),
  channelId: expect.any(String),
  categoryId: expect.any(Number),
  language: expect.any(String),
  title: expect.any(String),
  titleTsvector: expect.any(String),
  description: expect.any(String),
  summary: expect.any(Object),
  chapters: expect.any(Object),
  enrollCount: expect.any(Number),
  generatedAi: expect.any(Boolean),
  duration: expect.any(Number),
  extra: expect.any(Object),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  publishedAt: expect.any(Date),
};

const channelSchemaExpect = {
  name: expect.any(String),
  channelId: expect.any(String),
};
