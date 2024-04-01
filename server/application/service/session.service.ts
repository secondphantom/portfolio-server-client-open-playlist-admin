import { SessionData } from "@/server/schema/schema";
import { ISessionRepo } from "../interfaces/session.repo";
import { ServerError } from "@/server/dto/error";

export type ServiceSessionGetListByQuery = {
  adminId: number;
  id: number;
  page?: number;
  order?: "recent" | "old";
};

export type ServiceSessionGetById = {
  id: number;
};

export type ServiceSessionDeleById = {
  sessionKey: string;
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
  }: ServiceSessionGetListByQuery) => {
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
          healths: [],
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
  getSessionsById = async (dto: ServiceSessionGetById) => {
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
  deleteSessionById = async ({ sessionKey, id }: ServiceSessionDeleById) => {
    await this.sessionRepo.deleteByIdAndSessionKey({ sessionKey, id });
  };
}
