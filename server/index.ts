import dotenv from "dotenv";
dotenv.config();

import { NextResponse } from "next/server";

import { AuthService } from "./application/service/auth.service";
import { AuthController } from "./controller/auth/auth.controller";
import { ControllerResponse } from "./dto/response";
import { ENV } from "./env";
import { DrizzleClient } from "./infrastructure/db/drizzle.client";
import { EmailUtil } from "./infrastructure/email/email.util";
import { AdminRepo } from "./infrastructure/repo/admin.repo";
import { Utils } from "./infrastructure/utils/utils";
import { AuthRequestValidator } from "./infrastructure/validator/auth.request.validator";

export class RouterIndex {
  static instance: RouterIndex | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new RouterIndex();
    return this.instance;
  };

  private env: ENV;
  private dbClient: DrizzleClient;

  authController: AuthController;

  constructor() {
    this.env = {
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
    } satisfies ENV;
    this.dbClient = DrizzleClient.getInstance(this.env);

    const emailUtil = EmailUtil.getInstance();
    const utils = Utils.getInstance();

    const adminRepo = AdminRepo.getInstance(this.dbClient);

    const authRequestValidator = AuthRequestValidator.getInstance();

    const authService = AuthService.getInstance({
      adminRepo,
      emailUtil,
      utils,
    });

    this.authController = AuthController.getInstance({
      authRequestValidator,
      authService,
    });
  }

  static createJsonResponse = async (
    controllerResponse: ControllerResponse
  ) => {
    const {
      code,
      payload,
      headers: responseHeaders,
    } = controllerResponse.getResponse();
    const headers = new Headers();
    for (const { name, value } of responseHeaders) {
      headers.append(name, value);
    }
    headers.append("Content-type", "application/json");
    const body = payload;

    return new NextResponse(JSON.stringify(body), {
      status: code,
      headers,
    });
  };
}
