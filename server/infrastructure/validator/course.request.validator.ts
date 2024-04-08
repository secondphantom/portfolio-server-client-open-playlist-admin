import z from "zod";

import {
  ServiceCourseGetListByQueryDto,
  ServiceCourseGetByIdDto,
  ServiceCourseUpdateByIdDto,
} from "@/server/application/service/course.service";
import { ICourseRequestValidator } from "@/server/controller/course/course.interface";
import {
  RequestCourseGetListByQuery,
  RequestCourseGetById,
  RequestCourseUpdateById,
} from "@/server/spec/course/course.requests";
import { zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class CourseRequestValidator implements ICourseRequestValidator {
  static instance: CourseRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestCourseGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      id: zodIntTransform.optional(),
      videoId: z.string().min(1).optional(),
      channelId: z.string().min(1).optional(),
    })
    .strict();

  getCourseListByQuery = (req: RequestCourseGetListByQuery) => {
    try {
      const dto = this.requestCourseGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCourseGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  getCourseById = (req: RequestCourseGetById) => {
    try {
      const dto = this.requestCourseGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCourseUpdateById = z
    .object({
      id: zodIntTransform,
      version: z.number().optional(),
      categoryId: z.number().optional(),
      language: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      summary: z.string().optional(),
      chapters: z
        .array(
          z
            .object({
              title: z.string(),
              time: z.number(),
            })
            .strict()
        )
        .optional(),
      enrollCount: z.number().optional(),
      generatedAi: z.boolean().optional(),
    })
    .strict();

  updateCourseById = (req: RequestCourseUpdateById) => {
    try {
      const dto = this.requestCourseUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
