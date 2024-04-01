import { AdminEntitySelect } from "@/server/domain/admin.domain";
import {
  RepoCreateSessionDto,
  SessionEntitySelect,
} from "@/server/domain/session.domain";

export type QuerySessionListDto = {
  adminId: number;
  page: number;
  pageSize: number;
  order: "recent" | "old";
};

export interface ISessionRepo {
  create: (dto: RepoCreateSessionDto) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
  deleteBySessionKey: (sessionKey: string) => Promise<void>;
  deleteByIdAndSessionKey: (dto: {
    sessionKey: string;
    id: number;
  }) => Promise<void>;
  getById: <T extends keyof SessionEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof SessionEntitySelect]?: boolean }
  ) => Promise<Pick<SessionEntitySelect, T> | undefined>;
  getBySessionKey: <T extends keyof SessionEntitySelect>(
    sessionKey: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof SessionEntitySelect]?: boolean }
  ) => Promise<Pick<SessionEntitySelect, T> | undefined>;
  getBySessionKeyWith: <
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
  ) => Promise<
    | (Pick<SessionEntitySelect, T> & {
        admin: Pick<AdminEntitySelect, W1>;
      })
    | undefined
  >;
  getListByQuery: (
    query: QuerySessionListDto
  ) => Promise<Omit<SessionEntitySelect, "sessionKey" | "adminId">[]>;
}
