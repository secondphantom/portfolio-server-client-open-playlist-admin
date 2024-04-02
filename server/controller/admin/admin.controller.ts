import { AdminService } from "@/server/application/service/admin.service";
import { IAdminRequestValidator } from "./admin.interface";
import {
  RequestAdminCreate,
  RequestAdminDeleteById,
  RequestAdminGetById,
  RequestAdminGetListByQuery,
} from "@/server/spec/admin/admin.requests";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  adminService: AdminService;
  adminRequestValidator: IAdminRequestValidator;
};

export class AdminController {
  static instance: AdminController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AdminController(inputs);
    return this.instance;
  };

  private adminRequestValidator: IAdminRequestValidator;
  private adminService: AdminService;

  constructor({ adminRequestValidator, adminService }: ControllerInputs) {
    this.adminRequestValidator = adminRequestValidator;
    this.adminService = adminService;
  }

  createAdmin = async (req: RequestAdminCreate) => {
    try {
      const dto = this.adminRequestValidator.createAdmin(req);
      await this.adminService.createAdmin(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getAdminListByQuery = async (req: RequestAdminGetListByQuery) => {
    try {
      const dto = this.adminRequestValidator.getAdminListByQuery(req);
      const data = await this.adminService.getAdminListByQuery(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getAdminById = async (req: RequestAdminGetById) => {
    try {
      const dto = this.adminRequestValidator.getAdminById(req);
      const data = await this.adminService.getAdminById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  deleteAdminById = async (req: RequestAdminDeleteById) => {
    try {
      const dto = this.adminRequestValidator.deleteAdminById(req);
      await this.adminService.deleteAdminById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Deleted",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
