import z from "zod";

import { IRoleRequestValidator } from "@/server/controller/role/role.interface";
import {
  RequestRoleCreate,
  RequestRoleGetListByQuery,
  RequestRoleGetById,
  RequestRoleUpdateById,
  RequestRoleDeleteById,
} from "@/server/spec/role/role.requests";
import { zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class RoleRequestValidator implements IRoleRequestValidator {
  static instance: RoleRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new RoleRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestRoleCreate = z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .strict();

  createRole = (req: RequestRoleCreate) => {
    try {
      const dto = this.requestRoleCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestRoleGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      id: zodIntTransform.optional(),
    })
    .strict();
  getRoleListByQuery = (req: RequestRoleGetListByQuery) => {
    try {
      const dto = this.requestRoleGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestRoleGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  getRoleById = (req: RequestRoleGetById) => {
    try {
      const dto = this.requestRoleGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestRoleUpdateById = z
    .object({
      id: zodIntTransform,
      name: z.string().optional(),
    })
    .strict();
  updateRoleById = (req: RequestRoleUpdateById) => {
    try {
      const dto = this.requestRoleUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestRoleDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  deleteRoleById = (req: RequestRoleDeleteById) => {
    try {
      const dto = this.requestRoleDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
