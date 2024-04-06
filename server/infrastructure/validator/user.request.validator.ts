import z from "zod";

import { IUserRequestValidator } from "@/server/controller/user/user.interface";
import { ServerError } from "@/server/dto/error";
import {
  RequestUserGetById,
  RequestUserUpdateById,
  RequestUserGetListByQuery,
} from "@/server/spec/user/user.requests";
import { zodIntTransform } from "./lib/zod.util";

export class UserRequestValidator implements IUserRequestValidator {
  static instance: UserRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new UserRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestUserGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();

  getUserById = (req: RequestUserGetById) => {
    try {
      const dto = this.requestUserGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestUserUpdateById = z
    .object({
      id: zodIntTransform,
      isEmailVerified: z.boolean().optional(),
      profileImage: z.string().optional(),
      profileName: z.string().optional(),
      roleId: z.number().optional(),
    })
    .strict();
  updateUserById = (req: RequestUserUpdateById) => {
    try {
      const dto = this.requestUserUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestUserGetListByQuery = z
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
  getUserListByQuery = (req: RequestUserGetListByQuery) => {
    try {
      const dto = this.requestUserGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
