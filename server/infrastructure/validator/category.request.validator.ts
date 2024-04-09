import z from "zod";

import { ICategoryRequestValidator } from "@/server/controller/category/category.interface";
import {
  RequestCategoryCreate,
  RequestCategoryGetListByQuery,
  RequestCategoryGetById,
  RequestCategoryUpdateById,
  RequestCategoryDeleteById,
} from "@/server/spec/category/category.requests";
import { zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class CategoryRequestValidator implements ICategoryRequestValidator {
  static instance: CategoryRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CategoryRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestCategoryCreate = z
    .object({
      id: z.number(),
      name: z.string(),
      parentId: z.number(),
    })
    .strict();

  createCategory = (req: RequestCategoryCreate) => {
    try {
      const dto = this.requestCategoryCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCategoryGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      id: zodIntTransform.optional(),
      parentId: zodIntTransform.optional(),
    })
    .strict();
  getCategoryListByQuery = (req: RequestCategoryGetListByQuery) => {
    try {
      const dto = this.requestCategoryGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCategoryGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  getCategoryById = (req: RequestCategoryGetById) => {
    try {
      const dto = this.requestCategoryGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCategoryUpdateById = z
    .object({
      id: zodIntTransform,
      name: z.string().optional(),
      parentId: z.number().optional(),
    })
    .strict();
  updateCategoryById = (req: RequestCategoryUpdateById) => {
    try {
      const dto = this.requestCategoryUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestCategoryDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  deleteCategoryById = (req: RequestCategoryDeleteById) => {
    try {
      const dto = this.requestCategoryDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
