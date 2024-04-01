import { SessionService } from "@/server/application/service/session.service";
import { ISessionRequestValidator } from "./session.interface";
import {
  RequestSessionDeleteById,
  RequestSessionGetById,
  RequestSessionGetListByQuery,
} from "@/server/spec/session/session.requests";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  sessionService: SessionService;
  sessionRequestValidator: ISessionRequestValidator;
};

export class SessionController {
  static instance: SessionController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new SessionController(inputs);
    return this.instance;
  };

  private sessionRequestValidator: ISessionRequestValidator;
  private sessionService: SessionService;

  constructor({ sessionRequestValidator, sessionService }: ControllerInputs) {
    this.sessionRequestValidator = sessionRequestValidator;
    this.sessionService = sessionService;
  }

  getSessionListByQuery = async (req: RequestSessionGetListByQuery) => {
    try {
      const dto = this.sessionRequestValidator.getSessionListByQuery(req);
      const data = await this.sessionService.getSessionListByQuery(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: data,
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

  getSessionsById = async (req: RequestSessionGetById) => {
    try {
      const dto = this.sessionRequestValidator.getSessionsById(req);
      const data = await this.sessionService.getSessionsById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data: data,
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

  deleteSessionById = async (req: RequestSessionDeleteById) => {
    try {
      const dto = this.sessionRequestValidator.deleteSessionById(req);
      await this.sessionService.deleteSessionById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Delete",
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
