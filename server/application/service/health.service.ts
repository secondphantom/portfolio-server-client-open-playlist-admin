import { ENV } from "@/server/env";
import { HealthData } from "@/server/schema/schema";
import { IHealthRepo } from "../interfaces/health.repo";
import { HealthListQueryDto } from "@/server/dto/health.list.query.dto";
import { ServerError } from "@/server/dto/error";

type C_ENV = Pick<ENV, "API_BASE_URL">;

export type ServiceHealthGetListByQueryDto = {
  page?: number;
  version?: number;
  order?: "recent" | "old";
};
export type ServiceHealthGetByIdDto = {
  id: number;
};

type ServiceInputs = {
  healthRepo: IHealthRepo;
  env: C_ENV;
};

export class HealthService {
  static instance: HealthService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new HealthService(inputs);
    return this.instance;
  };

  private healthRepo: IHealthRepo;
  private env: C_ENV;

  constructor({ healthRepo, env }: ServiceInputs) {
    this.healthRepo = healthRepo;
    this.env = env;
  }

  // POST /health
  createHealth = async () => {
    const API_BASE_URL = this.env.API_BASE_URL;

    const apiPaths = [
      {
        method: "GET",
        path: "/api/courses",
      },
      {
        method: "GET",
        path: "/api/courses/3",
      },
      {
        method: "GET",
        path: "/api/channels/UC8butISFwT-Wl7EV0hUK0BQ",
      },
      {
        method: "GET",
        path: "/api/channels/UC8butISFwT-Wl7EV0hUK0BQ/courses",
      },
    ].map(({ path, method }) => ({
      method,
      path: `${API_BASE_URL}${path}`,
    }));

    const apiRequestPromises = apiPaths.map(({ method, path }) => {
      const promise = new Promise<HealthData["apis"][0]>(async (res, rej) => {
        try {
          const startTime = new Date();
          const response = await fetch(path, { method });
          const endTime = new Date();
          res({
            method,
            path,
            status: response.status,
            responseTime: endTime.getTime() - startTime.getTime(),
          });
        } catch (error) {
          rej({
            method,
            path,
            status: 500,
            responseTime: 0,
          });
        }
      });
      return promise;
    });

    const apiRequestResult = await Promise.all(apiRequestPromises);

    await this.healthRepo.create({
      version: 1,
      data: {
        apis: apiRequestResult,
      },
    });
  };

  // GET /health?
  getHealthListByQuery = async (dto: ServiceHealthGetListByQueryDto) => {
    const queryDto = new HealthListQueryDto(dto).getRepoQueryDto();

    const healths = await this.healthRepo.getListByQuery(queryDto);

    const pagination = {
      currentPage: queryDto.page,
      pageSize: queryDto.pageSize,
    };

    if (healths.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          healths: [],
          pagination,
        },
      });
    }

    return {
      healths,
      pagination,
    };
  };

  // GET /health/:id
  getHealthById = async ({ id }: ServiceHealthGetByIdDto) => {
    const health = await this.healthRepo.getById(id);

    if (!health) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return health;
  };
}
