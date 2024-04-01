import {
  ServiceHealthGetByIdDto,
  ServiceHealthGetListByQueryDto,
} from "@/server/application/service/health.service";
import {
  RequestHealthGetById,
  RequestHealthGetListByQuery,
} from "@/server/spec/health/health.requests";

export interface IHealthRequestValidator {
  getHealthListByQuery: (
    req: RequestHealthGetListByQuery
  ) => ServiceHealthGetListByQueryDto;
  getHealthById: (req: RequestHealthGetById) => ServiceHealthGetByIdDto;
}
