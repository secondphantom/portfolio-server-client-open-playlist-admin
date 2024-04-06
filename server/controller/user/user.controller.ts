import { UserService } from "@/server/application/service/user.service";
import { IUserRequestValidator } from "./user.interface";
import { ControllerResponse } from "@/server/dto/response";
import {
  RequestUserGetById,
  RequestUserGetListByQuery,
  RequestUserUpdateById,
} from "@/server/spec/user/user.requests";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  userService: UserService;
  userRequestValidator: IUserRequestValidator;
};

export class UserController {
  static instance: UserController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserController(inputs);
    return this.instance;
  };

  private userRequestValidator: IUserRequestValidator;
  private userService: UserService;

  constructor({ userRequestValidator, userService }: ControllerInputs) {
    this.userRequestValidator = userRequestValidator;
    this.userService = userService;
  }

  getUserById = async (req: RequestUserGetById) => {
    try {
      const dto = this.userRequestValidator.getUserById(req);
      const data = await this.userService.getUserById(dto);

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

  updateUserById = async (req: RequestUserUpdateById) => {
    try {
      const dto = this.userRequestValidator.updateUserById(req);
      await this.userService.updateUserById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success updated",
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

  getUserListByQuery = async (req: RequestUserGetListByQuery) => {
    try {
      const dto = this.userRequestValidator.getUserListByQuery(req);
      const data = await this.userService.getUserListByQuery(dto);

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
}
