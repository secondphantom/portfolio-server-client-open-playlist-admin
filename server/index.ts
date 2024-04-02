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
import { SessionRepo } from "./infrastructure/repo/session.repo";
import { HealthRepo } from "./infrastructure/repo/health.repo";
import { HealthRequestValidator } from "./infrastructure/validator/health.request.validator";
import { HealthService } from "./application/service/health.service";
import { HealthController } from "./controller/health/health.controller";
import { SessionRequestValidator } from "./infrastructure/validator/session.request.validator";
import { SessionService } from "./application/service/session.service";
import { SessionController } from "./controller/session/session.controller";
import { AdminService } from "./application/service/admin.service";
import { AdminController } from "./controller/admin/admin.controller";
import { AdminRequestValidator } from "./infrastructure/validator/admin.request.validator";

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
  healthController: HealthController;
  sessionController: SessionController;
  adminController: AdminController;

  constructor() {
    this.env = {
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "verbose",
      API_BASE_URL: process.env.API_BASE_URL!,
      YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY!,
    } satisfies ENV;
    this.dbClient = DrizzleClient.getInstance(this.env);

    const emailUtil = EmailUtil.getInstance();
    const utils = Utils.getInstance();

    const adminRepo = AdminRepo.getInstance(this.dbClient);
    const sessionRepo = SessionRepo.getInstance(this.dbClient);
    const healthRepo = HealthRepo.getInstance(this.dbClient);

    const authRequestValidator = AuthRequestValidator.getInstance();
    const healthRequestValidator = HealthRequestValidator.getInstance();
    const sessionRequestValidator = SessionRequestValidator.getInstance();
    const adminRequestValidator = AdminRequestValidator.getInstance();

    const authService = AuthService.getInstance({
      adminRepo,
      sessionRepo,
      emailUtil,
      utils,
    });
    const healthService = HealthService.getInstance({
      env: this.env,
      healthRepo,
    });
    const sessionService = SessionService.getInstance({
      sessionRepo,
    });
    const adminService = AdminService.getInstance({
      adminRepo,
    });

    this.authController = AuthController.getInstance({
      authRequestValidator,
      authService,
    });
    this.healthController = HealthController.getInstance({
      healthRequestValidator,
      healthService,
    });
    this.sessionController = SessionController.getInstance({
      sessionRequestValidator,
      sessionService,
    });
    this.adminController = AdminController.getInstance({
      adminRequestValidator,
      adminService,
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
