import { ServerError } from "@/server/dto/error";
import { INoticeRepo } from "../interfaces/notice.repo";

export type ServiceNoticeCreateDto = {
  adminId: number;
  title: string;
  content: string;
  isDisplayedOn: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type ServiceNoticeGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  id?: number;
  adminId?: number;
};

export type ServiceNoticeGetByIdDto = {
  id: number;
};

export type ServiceNoticeUpdateByIdDto = {
  id: number;
  adminId?: number;
  title?: string;
  content?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: Date;
  displayEndDate?: Date;
};

export type ServiceNoticeDeleteByIdDto = {
  id: number;
};

type ServiceInputs = {
  noticeRepo: INoticeRepo;
};

export class NoticeService {
  static instance: NoticeService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new NoticeService(inputs);
    return this.instance;
  };

  private noticeRepo: INoticeRepo;

  constructor({ noticeRepo }: ServiceInputs) {
    this.noticeRepo = noticeRepo;
  }

  // POST /notices
  createNotice = async (dto: ServiceNoticeCreateDto) => {
    await this.noticeRepo.create(dto);
  };

  // GET /notices?
  getNoticeListByQuery = async ({
    page,
    order,
    id,
    adminId,
  }: ServiceNoticeGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const notices = await this.noticeRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      id,
      adminId,
    });

    if (notices.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          notices: [],
          pagination,
        },
      });
    }

    return {
      notices,
      pagination,
    };
  };

  // GET /notices/:id
  getNoticeById = async (dto: ServiceNoticeGetByIdDto) => {
    const notice = await this.noticeRepo.getByIdWith(dto.id, {
      admin: {
        id: true,
        profileName: true,
      },
    });
    if (!notice) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return notice;
  };

  // PATCH /notices/:id
  updateNoticeById = async (dto: ServiceNoticeUpdateByIdDto) => {
    const notice = await this.noticeRepo.getById(dto.id, {
      id: true,
    });

    if (!notice) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.noticeRepo.updateById(dto.id, {
      ...dto,
    });
  };

  // DELETE /notice/:id
  deleteNoticeById = async (dto: ServiceNoticeDeleteByIdDto) => {
    await this.noticeRepo.deleteById(dto.id);
  };
}
