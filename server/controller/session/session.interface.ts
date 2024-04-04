import {
  ServiceSessionDeleByIdDto,
  ServiceSessionGetByIdDto,
  ServiceSessionGetListByQueryDto,
} from "@/server/application/service/session.service";
import {
  RequestSessionGetListByQuery,
  RequestSessionDeleteById,
  RequestSessionGetById,
} from "@/server/spec/session/session.requests";

export interface ISessionRequestValidator {
  getSessionListByQuery: (
    req: RequestSessionGetListByQuery
  ) => ServiceSessionGetListByQueryDto;
  getSessionsById: (req: RequestSessionGetById) => ServiceSessionGetByIdDto;
  deleteSessionById: (
    req: RequestSessionDeleteById
  ) => ServiceSessionDeleByIdDto;
}
