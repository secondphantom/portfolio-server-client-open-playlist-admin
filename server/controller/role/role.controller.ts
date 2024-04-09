import { RoleService } from "@/server/application/service/role.service";
import { IRoleRequestValidator } from "./role.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestRoleCreate,
  RequestRoleDeleteById,
  RequestRoleGetById,
  RequestRoleGetListByQuery,
  RequestRoleUpdateById,
} from "@/server/spec/role/role.requests";

type ControllerInputs = {
  roleService: RoleService;
  roleRequestValidator: IRoleRequestValidator;
};

export class RoleController {
  static instance: RoleController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new RoleController(inputs);
    return this.instance;
  };

  private roleRequestValidator: IRoleRequestValidator;
  private roleService: RoleService;

  constructor({ roleRequestValidator, roleService }: ControllerInputs) {
    this.roleRequestValidator = roleRequestValidator;
    this.roleService = roleService;
  }

  createRole = async (req: RequestRoleCreate) => {
    try {
      const dto = this.roleRequestValidator.createRole(req);
      await this.roleService.createRole(dto);

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

  getRoleListByQuery = async (req: RequestRoleGetListByQuery) => {
    try {
      const dto = this.roleRequestValidator.getRoleListByQuery(req);
      const data = await this.roleService.getRoleListByQuery(dto);

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

  getRoleById = async (req: RequestRoleGetById) => {
    try {
      const dto = this.roleRequestValidator.getRoleById(req);
      const data = await this.roleService.getRoleById(dto);

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

  updateRoleById = async (req: RequestRoleUpdateById) => {
    try {
      const dto = this.roleRequestValidator.updateRoleById(req);
      await this.roleService.updateRoleById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
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

  deleteRoleById = async (req: RequestRoleDeleteById) => {
    try {
      const dto = this.roleRequestValidator.deleteRoleById(req);
      await this.roleService.deleteRoleById(dto);

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
