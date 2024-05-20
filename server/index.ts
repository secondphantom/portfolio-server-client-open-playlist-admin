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
import { UserRepo } from "./infrastructure/repo/user.repo";
import { EnrollRepo } from "./infrastructure/repo/enroll.repo";
import { UserStatRepo } from "./infrastructure/repo/user.stat.repo";
import { UserStatRequestValidator } from "./infrastructure/validator/user.stat.request.validator";
import { UserStatService } from "./application/service/user.stat.service";
import { UserStatController } from "./controller/stat/user/user.stat.controller";
import { UserCreditRepo } from "./infrastructure/repo/user.credit.repo";
import { UserRequestValidator } from "./infrastructure/validator/user.request.validator";
import { UserCreditRequestValidator } from "./infrastructure/validator/user.credit.request.validator";
import { UserService } from "./application/service/user.service";
import { UserCreditService } from "./application/service/user.credit.service";
import { UserController } from "./controller/user/user.controller";
import { UserCreditController } from "./controller/userCredit/user.credit.controller";
import { CourseRepo } from "./infrastructure/repo/course.repo";
import { CourseRequestValidator } from "./infrastructure/validator/course.request.validator";
import { CourseService } from "./application/service/course.service";
import { CourseController } from "./controller/course/course.controller";
import { ChannelRepo } from "./infrastructure/repo/channel.repo";
import { ChannelRequestValidator } from "./infrastructure/validator/channel.request.validator";
import { ChannelService } from "./application/service/channel.service";
import { ChannelController } from "./controller/channel/channel.controller";
import { AnnouncementRepo } from "./infrastructure/repo/announcement.repo";
import { AnnouncementRequestValidator } from "./infrastructure/validator/announcement.request.validator";
import { AnnouncementService } from "./application/service/announcement.service";
import { AnnouncementController } from "./controller/announcement/announcement.controller";
import { RoleRepo } from "./infrastructure/repo/role.repo";
import { RoleRequestValidator } from "./infrastructure/validator/role.request.validator";
import { RoleService } from "./application/service/role.service";
import { RoleController } from "./controller/role/role.controller";
import { CategoryRepo } from "./infrastructure/repo/category.repo";
import { CategoryRequestValidator } from "./infrastructure/validator/category.request.validator";
import { CategoryService } from "./application/service/category.service";
import { CategoryController } from "./controller/category/category.controller";
import { DatabaseBackupScheduleRepo } from "./infrastructure/repo/database.backup.schedule.repo";
import { DatabaseBackupJobRepo } from "./infrastructure/repo/database.backup.job.repo";
import { DatabaseBackupRequestValidator } from "./infrastructure/validator/database.backup.request.validator";
import { DatabaseBackupServiceUtil } from "./application/service/database.backup.service.util";
import { CronJob } from "./infrastructure/cron/cron.job";
import { DiscordUtil } from "./infrastructure/discord/discord.util";
import { DatabaseBackupService } from "./application/service/database.backup.service";
import { DatabaseBackupController } from "./controller/databseBackup/database.backup.controller";

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
  userStatController: UserStatController;
  userController: UserController;
  userCreditController: UserCreditController;
  courseController: CourseController;
  channelController: ChannelController;
  announcementController: AnnouncementController;
  roleController: RoleController;
  categoryController: CategoryController;
  databaseBackupController: DatabaseBackupController;

  constructor() {
    this.env = {
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
      API_BASE_URL: process.env.API_BASE_URL!,
      YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY!,
      DATABASE_BACKUP_FOLDER_PATH: process.env.DATABASE_BACKUP_FOLDER_PATH!,
      DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL!,
      DOMAIN_URL: process.env.DOMAIN_URL!,
    } satisfies ENV;
    this.dbClient = DrizzleClient.getInstance(this.env);

    const emailUtil = EmailUtil.getInstance();
    const utils = Utils.getInstance();
    const cronJob = CronJob.getInstance();
    const discordUtil = DiscordUtil.getInstance(this.env);

    const adminRepo = AdminRepo.getInstance(this.dbClient);
    const sessionRepo = SessionRepo.getInstance(this.dbClient);
    const healthRepo = HealthRepo.getInstance(this.dbClient);
    const userRepo = UserRepo.getInstance(this.dbClient);
    const enrollRepo = EnrollRepo.getInstance(this.dbClient);
    const userStatRepo = UserStatRepo.getInstance(this.dbClient);
    const userCreditRepo = UserCreditRepo.getInstance(this.dbClient);
    const courseRepo = CourseRepo.getInstance(this.dbClient);
    const channelRepo = ChannelRepo.getInstance(this.dbClient);
    const announcementRepo = AnnouncementRepo.getInstance(this.dbClient);
    const roleRepo = RoleRepo.getInstance(this.dbClient);
    const categoryRepo = CategoryRepo.getInstance(this.dbClient);
    const databaseBackupScheduleRepo = DatabaseBackupScheduleRepo.getInstance(
      this.dbClient
    );
    const databaseBackupJobRepo = DatabaseBackupJobRepo.getInstance(
      this.dbClient
    );

    const authRequestValidator = AuthRequestValidator.getInstance();
    const healthRequestValidator = HealthRequestValidator.getInstance();
    const sessionRequestValidator = SessionRequestValidator.getInstance();
    const adminRequestValidator = AdminRequestValidator.getInstance();
    const userStatRequestValidator = UserStatRequestValidator.getInstance();
    const userRequestValidator = UserRequestValidator.getInstance();
    const userCreditRequestValidator = UserCreditRequestValidator.getInstance();
    const courseRequestValidator = CourseRequestValidator.getInstance();
    const channelRequestValidator = ChannelRequestValidator.getInstance();
    const announcementRequestValidator =
      AnnouncementRequestValidator.getInstance();
    const roleRequestValidator = RoleRequestValidator.getInstance();
    const categoryRequestValidator = CategoryRequestValidator.getInstance();
    const databaseBackupRequestValidator =
      DatabaseBackupRequestValidator.getInstance();

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
    const userStatService = UserStatService.getInstance({
      enrollRepo,
      userRepo,
      userStatRepo,
    });
    const userService = UserService.getInstance({
      userRepo,
    });
    const userCreditService = UserCreditService.getInstance({
      userCreditRepo,
      userRepo,
    });
    const courseService = CourseService.getInstance({
      courseRepo,
    });
    const channelService = ChannelService.getInstance({
      channelRepo,
    });
    const announcementService = AnnouncementService.getInstance({
      announcementRepo,
    });
    const roleService = RoleService.getInstance({
      roleRepo,
    });
    const categoryService = CategoryService.getInstance({
      categoryRepo,
    });
    const databaseBackupServiceUtil = DatabaseBackupServiceUtil.getInstance({
      databaseBackupJobRepo,
      databaseBackupScheduleRepo,
      discordUtil,
      env: this.env,
      utils,
    });
    const databaseBackupService = DatabaseBackupService.getInstance({
      cronJob,
      databaseBackupJobRepo,
      databaseBackupScheduleRepo,
      databaseBackupServiceUtil,
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
    this.userStatController = UserStatController.getInstance({
      userStatRequestValidator,
      userStatService,
    });
    this.userController = UserController.getInstance({
      userRequestValidator,
      userService,
    });
    this.userCreditController = UserCreditController.getInstance({
      userCreditRequestValidator,
      userCreditService,
    });
    this.courseController = CourseController.getInstance({
      courseRequestValidator,
      courseService,
    });
    this.channelController = ChannelController.getInstance({
      channelRequestValidator,
      channelService,
    });
    this.announcementController = AnnouncementController.getInstance({
      announcementRequestValidator,
      announcementService,
    });
    this.roleController = RoleController.getInstance({
      roleRequestValidator,
      roleService,
    });
    this.categoryController = CategoryController.getInstance({
      categoryRequestValidator,
      categoryService,
    });
    this.databaseBackupController = DatabaseBackupController.getInstance({
      databaseBackupRequestValidator,
      databaseBackupService,
    });
  }

  verifyAuth = async (sessionKey: string) => {
    const session = await this.authController.verifySession({
      sessionKey,
    });

    if (session.getResponse().code !== 200) {
      return undefined;
    }
    return session.getResponse().payload.data!;
  };

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
