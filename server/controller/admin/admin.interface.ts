import {
  ServiceAdminCreateDto,
  ServiceAdminDeleteByIdDto,
  ServiceAdminGetByIdDto,
  ServiceAdminGetListByQueryDto,
} from "@/server/application/service/admin.service";
import {
  RequestAdminCreate,
  RequestAdminDeleteById,
  RequestAdminGetById,
  RequestAdminGetListByQuery,
} from "@/server/spec/admin/admin.requests";

export interface IAdminRequestValidator {
  createAdmin: (req: RequestAdminCreate) => ServiceAdminCreateDto;
  getAdminListByQuery: (
    req: RequestAdminGetListByQuery
  ) => ServiceAdminGetListByQueryDto;
  getAdminById: (req: RequestAdminGetById) => ServiceAdminGetByIdDto;
  deleteAdminById: (req: RequestAdminDeleteById) => ServiceAdminDeleteByIdDto;
}
