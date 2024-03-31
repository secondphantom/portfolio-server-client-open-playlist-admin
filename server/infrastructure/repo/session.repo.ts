import { ISessionRepo } from "@/server/application/interfaces/session.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import {
  RepoCreateSessionDto,
  SessionEntitySelect,
} from "@/server/domain/session.domain";
import * as schema from "../../schema/schema";
import { eq } from "drizzle-orm";
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
    const session = await this.getById(dto.id, { id: true });

    return session;
  };

  deleteById = async (id: string) => {
    await this.db.delete(schema.sessions).where(eq(schema.sessions.id, id));
  };

  getById = async <T extends keyof AdminEntitySelect>(
    id: string,
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

  getByIdWith = async <
    T extends keyof SessionEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    where: {
      id: string;
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
        return eq(session.id, where.id);
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
}
