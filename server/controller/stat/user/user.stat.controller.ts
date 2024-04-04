import { UserStatService } from "@/server/application/service/user.stat.service";
import { IUserStatRequestValidator } from "./user.stat.interface";
import {
  RequestUserStatCreate,
  RequestUserStatGetByVersionAndEventAt,
  RequestUserStateGetListByQuery,
} from "@/server/spec/stat/user/user.stat.requests";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  userStatService: UserStatService;
  userStatRequestValidator: IUserStatRequestValidator;
};

export class UserStatController {
  static instance: UserStatController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserStatController(inputs);
    return this.instance;
  };

  private userStatRequestValidator: IUserStatRequestValidator;
  private userStatService: UserStatService;

  constructor({ userStatRequestValidator, userStatService }: ControllerInputs) {
    this.userStatRequestValidator = userStatRequestValidator;
    this.userStatService = userStatService;
  }

  crateUserStat = async (req: RequestUserStatCreate) => {
    try {
      const dto = this.userStatRequestValidator.crateUserStat(req);
      await this.userStatService.crateUserStat(dto);

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

  getUserStatListByQuery = async (req: RequestUserStateGetListByQuery) => {
    try {
      const dto = this.userStatRequestValidator.getUserStatListByQuery(req);
      const data = await this.userStatService.getUserStatListByQuery(dto);

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

  getUserStatByVersionAndEventAt = async (
    req: RequestUserStatGetByVersionAndEventAt
  ) => {
    try {
      const dto =
        this.userStatRequestValidator.getUserStatByVersionAndEventAt(req);
      const data = await this.userStatService.getUserStatByVersionAndEventAt(
        dto
      );

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
