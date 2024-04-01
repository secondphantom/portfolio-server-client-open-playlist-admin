import {
  ISessionRepo,
  QuerySessionListDto,
} from "@/server/application/interfaces/session.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import {
  RepoCreateSessionDto,
  SessionEntitySelect,
} from "@/server/domain/session.domain";
import * as schema from "../../schema/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { AdminEntitySelect } from "@/server/domain/admin.domain";

export class SessionRepo implements ISessionRepo {
  static instance: SessionRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new SessionRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: RepoCreateSessionDto) => {
    await this.db.insert(schema.sessions).values(dto);
  };

  deleteById = async (id: number) => {
    await this.db.delete(schema.sessions).where(eq(schema.sessions.id, id));
  };

  deleteBySessionKey = async (sessionKey: string) => {
    await this.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.sessionKey, sessionKey));
  };

  deleteByIdAndAdminId = async ({
    adminId,
    id,
  }: {
    adminId: number;
    id: number;
  }) => {
    await this.db
      .delete(schema.sessions)
      .where(
        and(eq(schema.sessions.adminId, adminId), eq(schema.sessions.id, id))
      );
  };

  getById = async <T extends keyof AdminEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => {
    const session = await this.db.query.sessions.findFirst({
      where: (session, { eq }) => {
        return eq(session.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof AdminEntitySelect]: boolean })
        : undefined,
    });
    return session;
  };

  getBySessionKey = async <T extends keyof AdminEntitySelect>(
    sessionKey: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => {
    const session = await this.db.query.sessions.findFirst({
      where: (session, { eq }) => {
        return eq(session.sessionKey, sessionKey);
      },
      columns: columns
        ? (columns as { [key in keyof AdminEntitySelect]: boolean })
        : undefined,
    });
    return session;
  };

  getBySessionKeyWith = async <
    T extends keyof SessionEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    where: {
      sessionKey: string;
    },
    columns?: {
      session?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof SessionEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => {
    const session = await this.db.query.sessions.findFirst({
      where: (session, { eq }) => {
        return eq(session.sessionKey, where.sessionKey);
      },
      columns: columns?.session,
      with: {
        admin: columns?.admin
          ? {
              columns: columns?.admin,
            }
          : undefined,
      },
    });

    return session as any;
  };

  getListByQuery = async ({
    page,
    pageSize,
    adminId,
    order,
  }: QuerySessionListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.sessions.createdAt)];
        case "old":
          return [asc(schema.sessions.createdAt)];
        default:
          return [];
      }
    })(order);

    const sessions = await this.db.query.sessions.findMany({
      where: (value, { eq }) => {
        return eq(value.adminId, adminId);
      },
      columns: {
        id: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return sessions;
  };
}
