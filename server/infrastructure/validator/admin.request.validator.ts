import z from "zod";

import { IAdminRequestValidator } from "@/server/controller/admin/admin.interface";
import {
  RequestAdminCreate,
  RequestAdminDeleteById,
  RequestAdminGetById,
  RequestAdminGetListByQuery,
} from "@/server/spec/admin/admin.requests";
import { ServerError } from "@/server/dto/error";
import { zodIntTransform } from "./lib/zod.util";

export class AdminRequestValidator implements IAdminRequestValidator {
  static instance: AdminRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AdminRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestAdminCreate = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
      profileName: z.string().optional(),
    })
    .strict();

  createAdmin = (req: RequestAdminCreate) => {
    try {
      const dto = this.requestAdminCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAdminGetListByQuery = z
    .object({
      page: zodIntTransform.optional(),
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      roleId: zodIntTransform.optional(),
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email.")
        .optional(),
    })
    .strict();

  getAdminListByQuery = (req: RequestAdminGetListByQuery) => {
    try {
      const dto = this.requestAdminGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAdminGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  getAdminById = (req: RequestAdminGetById) => {
    try {
      const dto = this.requestAdminGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAdminDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  deleteAdminById = (req: RequestAdminDeleteById) => {
    try {
      const dto = this.requestAdminDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
