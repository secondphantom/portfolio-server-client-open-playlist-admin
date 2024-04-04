import {
  RepoCreateUserStatDto,
  UserStatEntitySelect,
} from "@/server/domain/user.stat.domain";

export type QueryUserStatListDto = {
  startDate: Date;
  endDate: Date;
  version: number;
};

export interface IUserStatRepo {
  getRecentByVersion: <T extends keyof UserStatEntitySelect>(
    version: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserStatEntitySelect]?: boolean }
  ) => Promise<Pick<UserStatEntitySelect, T> | undefined>;
  create: (dto: RepoCreateUserStatDto) => Promise<void>;
  getListByQuery: (
    query: QueryUserStatListDto
  ) => Promise<UserStatEntitySelect[]>;
  getByVersionAndEventAt: <T extends keyof UserStatEntitySelect>(
    where: {
      version: number;
      eventAt: Date;
    },
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserStatEntitySelect]?: boolean }
  ) => Promise<Pick<UserStatEntitySelect, T> | undefined>;
  deleteByVersionAndEventAt: (where: {
    version: number;
    eventAt: Date;
  }) => Promise<void>;
}
