import {
  ServiceNoticeCreateDto,
  ServiceNoticeDeleteByIdDto,
  ServiceNoticeGetByIdDto,
  ServiceNoticeGetListByQueryDto,
  ServiceNoticeUpdateByIdDto,
} from "@/server/application/service/notice.service";
import {
  RequestNoticeCreate,
  RequestNoticeDeleteById,
  RequestNoticeGetById,
  RequestNoticeGetListByQuery,
  RequestNoticeUpdateById,
} from "@/server/spec/notice/notice.requests";

export interface INoticeRequestValidator {
  createNotice: (req: RequestNoticeCreate) => ServiceNoticeCreateDto;
  getNoticeListByQuery: (
    req: RequestNoticeGetListByQuery
  ) => ServiceNoticeGetListByQueryDto;
  getNoticeById: (req: RequestNoticeGetById) => ServiceNoticeGetByIdDto;
  updateNoticeById: (
    req: RequestNoticeUpdateById
  ) => ServiceNoticeUpdateByIdDto;
  deleteNoticeById: (
    req: RequestNoticeDeleteById
  ) => ServiceNoticeDeleteByIdDto;
}
