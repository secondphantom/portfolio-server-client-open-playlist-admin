import z from "zod";

import { ISessionRequestValidator } from "@/server/controller/session/session.interface";
import { zodIntTransform } from "./lib/zod.util";
import {
  RequestSessionDeleteById,
  RequestSessionGetById,
  RequestSessionGetListByQuery,
} from "@/server/spec/session/session.requests";
import { ServerError } from "@/server/dto/error";

export class SessionRequestValidator implements ISessionRequestValidator {
  static instance: SessionRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new SessionRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestSessionGetListByQuery = z
    .object({
      auth: z
        .object({
          adminId: z.number(),
          id: z.number(),
        })
        .strict(),
      query: z
        .object({
          page: zodIntTransform.optional(),
          order: z.union([z.literal("recent"), z.literal("old")]).optional(),
        })
        .strict(),
    })
    .strict();

  getSessionListByQuery = (req: RequestSessionGetListByQuery) => {
    try {
      const dto = this.requestSessionGetListByQuery.parse(req);
      return {
        ...dto.query,
        ...dto.auth,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestSessionGetById = z
    .object({
      params: z
        .object({
          id: zodIntTransform,
        })
        .strict(),
    })
    .strict();

  getSessionsById = (req: RequestSessionGetById) => {
    try {
      const dto = this.requestSessionGetById.parse(req);
      return {
        ...dto.params,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestSessionDeleteById = z
    .object({
      auth: z
        .object({
          adminId: z.number(),
        })
        .strict(),
      params: z
        .object({
          id: zodIntTransform,
        })
        .strict(),
    })
    .strict();

  deleteSessionById = (req: RequestSessionDeleteById) => {
    try {
      const dto = this.requestSessionDeleteById.parse(req);
      return {
        ...dto.params,
        ...dto.auth,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
