import {
  ServiceNoticeCreateDto,
  ServiceNoticeDeleteByIdDto,
  ServiceNoticeGetByIdDto,
  ServiceNoticeGetListByQueryDto,
  ServiceNoticeUpdateByIdDto,
} from "@/server/application/service/notice.service";
import {
  RequestNoticeCrete,
  RequestNoticeDeleteById,
  RequestNoticeGetById,
  RequestNoticeGetListByQuery,
  RequestNoticeUpdateById,
} from "@/server/spec/notice/notice.requests";

export interface INoticeRequestValidator {
  createNotice: (req: RequestNoticeCrete) => ServiceNoticeCreateDto;
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
