import { SessionData } from "@/server/schema/schema";
import { ISessionRepo } from "../interfaces/session.repo";
import { ServerError } from "@/server/dto/error";

export type ServiceSessionGetListByQueryDto = {
  adminId: number;
  id: number;
  page?: number;
  order?: "recent" | "old";
};

export type ServiceSessionGetByIdDto = {
  id: number;
};

export type ServiceSessionDeleByIdDto = {
  adminId: number;
  id: number;
};

type ServiceInputs = {
  sessionRepo: ISessionRepo;
};

export class SessionService {
  static instance: SessionService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new SessionService(inputs);
    return this.instance;
  };

  private sessionRepo: ISessionRepo;

  constructor({ sessionRepo }: ServiceInputs) {
    this.sessionRepo = sessionRepo;
  }

  // GET /sessions?
  getSessionListByQuery = async ({
    adminId,
    id,
    page,
    order,
  }: ServiceSessionGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const sessions = await this.sessionRepo.getListByQuery({
      adminId,
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    });

    if (sessions.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          sessions: [],
          pagination,
        },
      });
    }

    return {
      sessions: sessions.map((v) => ({
        ...v,
        isCurrent: v.id === id,
      })),
      pagination,
    };
  };

  // GET /sessions/:id
  getSessionsById = async (dto: ServiceSessionGetByIdDto) => {
    const session = await this.sessionRepo.getById(dto.id, {
      id: true,
      data: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!session) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return {
      ...session,
      isCurrent: session.id === dto.id,
    };
  };

  // DELETE /sessions/:id
  deleteSessionById = async ({ adminId, id }: ServiceSessionDeleByIdDto) => {
    await this.sessionRepo.deleteByIdAndAdminId({ adminId, id });
  };
}
