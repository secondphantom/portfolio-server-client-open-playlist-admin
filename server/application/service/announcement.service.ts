import { ServerError } from "@/server/dto/error";
import { IAnnouncementRepo } from "../interfaces/announcement.repo";

export type ServiceAnnouncementCreateDto = {
  adminId: number;
  title: string;
  content: string;
  isDisplayedOn: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type ServiceAnnouncementGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  id?: number;
  adminId?: number;
};

export type ServiceAnnouncementGetByIdDto = {
  id: number;
};

export type ServiceAnnouncementUpdateByIdDto = {
  id: number;
  adminId?: number;
  title?: string;
  content?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type ServiceAnnouncementDeleteByIdDto = {
  id: number;
};

type ServiceInputs = {
  announcementRepo: IAnnouncementRepo;
};

export class AnnouncementService {
  static instance: AnnouncementService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementService(inputs);
    return this.instance;
  };

  private announcementRepo: IAnnouncementRepo;

  constructor({ announcementRepo }: ServiceInputs) {
    this.announcementRepo = announcementRepo;
  }

  // POST /announcements
  createAnnouncement = async (dto: ServiceAnnouncementCreateDto) => {
    await this.announcementRepo.create(dto);
  };

  // GET /announcements?
  getAnnouncementListByQuery = async ({
    page,
    order,
    id,
    adminId,
  }: ServiceAnnouncementGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const announcements = await this.announcementRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      id,
      adminId,
    });

    if (announcements.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          announcements: [],
          pagination,
        },
      });
    }

    return {
      announcements,
      pagination,
    };
  };

  // GET /announcements/:id
  getAnnouncementById = async (dto: ServiceAnnouncementGetByIdDto) => {
    const announcement = await this.announcementRepo.getByIdWith(dto.id, {
      admin: {
        id: true,
        profileName: true,
      },
    });
    if (!announcement) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return announcement;
  };

  // PATCH /announcements/:id
  updateAnnouncementById = async (dto: ServiceAnnouncementUpdateByIdDto) => {
    const announcement = await this.announcementRepo.getById(dto.id, {
      id: true,
    });

    if (!announcement) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.announcementRepo.updateById(dto.id, {
      ...dto,
    });
  };

  // DELETE /announcement/:id
  deleteAnnouncementById = async (dto: ServiceAnnouncementDeleteByIdDto) => {
    await this.announcementRepo.deleteById(dto.id);
  };
}
