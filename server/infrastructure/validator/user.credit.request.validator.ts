import z from "zod";

import { ServiceUserCreditUpdateDto } from "@/server/application/service/user.credit.service";
import { IUserCreditRequestValidator } from "@/server/controller/userCredit/user.credit.interface";
import { RequestUserCreditUpdate } from "@/server/spec/userCredit/user.credit.requests";
import { ServerError } from "@/server/dto/error";
import { zodIntTransform } from "./lib/zod.util";

export class UserCreditRequestValidator implements IUserCreditRequestValidator {
  static instance: UserCreditRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new UserCreditRequestValidator();
    return this.instance;
  };

  constructor() {}

  private RequestUserCreditUpdate = z
    .object({
      userId: zodIntTransform,
      credit: z
        .object({
          freeCredits: z.number().optional(),
          purchasedCredits: z.number().optional(),
        })
        .strict(),
    })
    .strict();

  updateUserCredit = (req: RequestUserCreditUpdate) => {
    try {
      const dto = this.RequestUserCreditUpdate.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
