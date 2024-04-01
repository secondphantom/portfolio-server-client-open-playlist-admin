import z from "zod";

import { IHealthRequestValidator } from "@/server/controller/health/health.interface";
import { ServerError } from "@/server/dto/error";
import {
  RequestHealthGetById,
  RequestHealthGetListByQuery,
} from "@/server/spec/health/health.requests";
import { zodIntTransform } from "./lib/zod.util";

export class HealthRequestValidator implements IHealthRequestValidator {
  static instance: HealthRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new HealthRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestHealthGetListByQuery = z
    .object({
      page: zodIntTransform.optional(),
      version: zodIntTransform.optional(),
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
    })
    .strict();

  getHealthListByQuery = (req: RequestHealthGetListByQuery) => {
    try {
      const dto = this.requestHealthGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestHealthGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  getHealthById = (req: RequestHealthGetById) => {
    try {
      const dto = this.requestHealthGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
