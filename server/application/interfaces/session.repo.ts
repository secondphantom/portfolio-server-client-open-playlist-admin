import {
  RepoCreateSessionDto,
  SessionEntitySelect,
} from "@/server/domain/session.domain";

export interface ISessionRepo {
  create: (dto: RepoCreateSessionDto) => Promise<{ id: string } | undefined>;
  deleteById: (id: string) => Promise<void>;
  getById: <T extends keyof SessionEntitySelect>(
    id: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof SessionEntitySelect]?: boolean }
  ) => Promise<Pick<SessionEntitySelect, T> | undefined>;
}
