import {
  ServiceAnnouncementCreateDto,
  ServiceAnnouncementDeleteByIdDto,
  ServiceAnnouncementGetByIdDto,
  ServiceAnnouncementGetListByQueryDto,
  ServiceAnnouncementUpdateByIdDto,
} from "@/server/application/service/announcement.service";
import {
  RequestAnnouncementCreate,
  RequestAnnouncementDeleteById,
  RequestAnnouncementGetById,
  RequestAnnouncementGetListByQuery,
  RequestAnnouncementUpdateById,
} from "@/server/spec/announcement/announcement.requests";

export interface IAnnouncementRequestValidator {
  createAnnouncement: (
    req: RequestAnnouncementCreate
  ) => ServiceAnnouncementCreateDto;
  getAnnouncementListByQuery: (
    req: RequestAnnouncementGetListByQuery
  ) => ServiceAnnouncementGetListByQueryDto;
  getAnnouncementById: (
    req: RequestAnnouncementGetById
  ) => ServiceAnnouncementGetByIdDto;
  updateAnnouncementById: (
    req: RequestAnnouncementUpdateById
  ) => ServiceAnnouncementUpdateByIdDto;
  deleteAnnouncementById: (
    req: RequestAnnouncementDeleteById
  ) => ServiceAnnouncementDeleteByIdDto;
}
