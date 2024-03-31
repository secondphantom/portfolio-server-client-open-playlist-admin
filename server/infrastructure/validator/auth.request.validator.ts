import z from "zod";

import { IAuthRequestValidator } from "@/server/controller/auth/auth.interface";
import { RequestAuthSignIn } from "@/server/spec/auth/auth.requests";
import { ServerError } from "@/server/dto/error";

export class AuthRequestValidator implements IAuthRequestValidator {
  static instance: AuthRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AuthRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestAuthSignIn = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
    })
    .strict();

  signIn = (req: RequestAuthSignIn) => {
    try {
      const dto = this.requestAuthSignIn.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
