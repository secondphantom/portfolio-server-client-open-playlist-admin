import z from "zod";

import {
  ServiceUserStatCreateDto,
  ServiceUserStatGetListByQueryDto,
  ServiceUserStatGetByVersionAndEventAt,
} from "@/server/application/service/user.stat.service";
import { IUserStatRequestValidator } from "@/server/controller/stat/user/user.stat.interface";
import {
  RequestUserStatCreate,
  RequestUserStateGetListByQuery,
  RequestUserStatGetByVersionAndEventAt,
} from "@/server/spec/stat/user/user.stat.requests";
import { ServerError } from "@/server/dto/error";
import { zodDateTransform, zodIntTransform } from "./lib/zod.util";

export class UserStatRequestValidator implements IUserStatRequestValidator {
  static instance: UserStatRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new UserStatRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestUserStatCreate = z
    .object({
      version: z.number().min(1),
      eventAt: zodDateTransform,
    })
    .strict();

  crateUserStat = (req: RequestUserStatCreate) => {
    try {
      const dto = this.requestUserStatCreate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestUserStateGetListByQuery = z
    .object({
      version: zodIntTransform,
      startDate: zodDateTransform,
      endDate: zodDateTransform,
    })
    .strict();

  getUserStatListByQuery = (req: RequestUserStateGetListByQuery) => {
    try {
      const dto = this.requestUserStateGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestUserStatGetByVersionAndEventAt = z
    .object({
      version: zodIntTransform,
      eventAt: zodDateTransform,
    })
    .strict();
  getUserStatByVersionAndEventAt = (
    req: RequestUserStatGetByVersionAndEventAt
  ) => {
    try {
      const dto = this.requestUserStatGetByVersionAndEventAt.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
