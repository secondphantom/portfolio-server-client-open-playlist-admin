import {
  ServiceSessionDeleById,
  ServiceSessionGetById,
  ServiceSessionGetListByQuery,
} from "@/server/application/service/session.service";
import {
  RequestSessionGetListByQuery,
  RequestSessionDeleteById,
  RequestSessionGetById,
} from "@/server/spec/session/session.requests";

export interface ISessionRequestValidator {
  getSessionListByQuery: (
    req: RequestSessionGetListByQuery
  ) => ServiceSessionGetListByQuery;
  getSessionsById: (req: RequestSessionGetById) => ServiceSessionGetById;
  deleteSessionById: (req: RequestSessionDeleteById) => ServiceSessionDeleById;
}
