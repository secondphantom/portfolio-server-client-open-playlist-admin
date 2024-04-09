import {
  ServiceRoleCreateDto,
  ServiceRoleDeleteByIdDto,
  ServiceRoleGetByIdDto,
  ServiceRoleGetListByQueryDto,
  ServiceRoleUpdateByIdDto,
} from "@/server/application/service/role.service";
import {
  RequestRoleCreate,
  RequestRoleDeleteById,
  RequestRoleGetById,
  RequestRoleGetListByQuery,
  RequestRoleUpdateById,
} from "@/server/spec/role/role.requests";

export interface IRoleRequestValidator {
  createRole: (req: RequestRoleCreate) => ServiceRoleCreateDto;
  getRoleListByQuery: (
    req: RequestRoleGetListByQuery
  ) => ServiceRoleGetListByQueryDto;
  getRoleById: (req: RequestRoleGetById) => ServiceRoleGetByIdDto;
  updateRoleById: (req: RequestRoleUpdateById) => ServiceRoleUpdateByIdDto;
  deleteRoleById: (req: RequestRoleDeleteById) => ServiceRoleDeleteByIdDto;
}
