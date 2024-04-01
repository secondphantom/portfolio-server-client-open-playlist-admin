import { HealthService } from "@/server/application/service/health.service";
import { IHealthRequestValidator } from "./health.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestHealthGetById,
  RequestHealthGetListByQuery,
} from "@/server/spec/health/health.requests";

type ControllerInputs = {
  healthService: HealthService;
  healthRequestValidator: IHealthRequestValidator;
};

export class HealthController {
  static instance: HealthController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new HealthController(inputs);
    return this.instance;
  };

  private healthRequestValidator: IHealthRequestValidator;
  private healthService: HealthService;

  constructor({ healthRequestValidator, healthService }: ControllerInputs) {
    this.healthRequestValidator = healthRequestValidator;
    this.healthService = healthService;
  }

  createHealth = async () => {
    try {
      await this.healthService.createHealth();

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success",
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

  getHealthListByQuery = async (req: RequestHealthGetListByQuery) => {
    try {
      const dto = this.healthRequestValidator.getHealthListByQuery(req);
      const data = await this.healthService.getHealthListByQuery(dto);

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

  getHealthById = async (req: RequestHealthGetById) => {
    try {
      const dto = this.healthRequestValidator.getHealthById(req);
      const data = await this.healthService.getHealthById(dto);

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
}
