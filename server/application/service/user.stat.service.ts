import * as dateMath from "date-arithmetic";

import { IEnrollRepo } from "../interfaces/enroll.repo";
import { IUserStatRepo } from "../interfaces/user.stat.repo";
import { IUserRepo } from "../interfaces/user.repo";
import { UserStatDomain } from "@/server/domain/user.stat.domain";
import { ServerError } from "@/server/dto/error";

export type ServiceUserStatCreateDto = {
  version: number;
  eventAt: Date;
};

export type ServiceUserStatGetListByQueryDto = {
  startDate: Date;
  endDate: Date;
  version: number;
};

export type ServiceUserStatGetByVersionAndEventAt = {
  version: number;
  eventAt: Date;
};

type ServiceInputs = {
  userRepo: IUserRepo;
  enrollRepo: IEnrollRepo;
  userStatRepo: IUserStatRepo;
};

export class UserStatService {
  static instance: UserStatService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserStatService(inputs);
    return this.instance;
  };

  private userRepo: IUserRepo;
  private enrollRepo: IEnrollRepo;
  private userStatRepo: IUserStatRepo;

  constructor({ userRepo, enrollRepo, userStatRepo }: ServiceInputs) {
    this.userRepo = userRepo;
    this.enrollRepo = enrollRepo;
    this.userStatRepo = userStatRepo;
  }

  //POST /stats/users
  crateUserStat = async ({ eventAt, version }: ServiceUserStatCreateDto) => {
    eventAt.setUTCHours(0, 0, 0, 0);

    const eventAtUserStat = await this.userStatRepo.getByVersionAndEventAt(
      {
        version,
        eventAt,
      },
      {
        version: true,
        eventAt: true,
      }
    );

    if (eventAtUserStat) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }

    const recentUserStat = await this.userStatRepo.getRecentByVersion(version);

    const startDate = recentUserStat
      ? recentUserStat.eventAt
      : new Date(null as any);

    const periodTotalUser = await this.userRepo.getTotalUserByPeriod({
      gt: startDate,
      lte: eventAt,
    });
    const totalUser = recentUserStat
      ? recentUserStat.data.total + periodTotalUser
      : periodTotalUser;

    const activeUserPeriods = [
      { key: "dau", period: 1 },
      { key: "wau", period: 7 },
      { key: "mau", period: 30 },
    ];
    const activeUserPromises = activeUserPeriods.map(({ key, period }) => {
      return new Promise<{ key: string; period: number; activeUser: number }>(
        async (res, rej) => {
          const gt = dateMath.add(eventAt, -period, "day");
          const lte = eventAt;
          const activeUser = await this.enrollRepo.getActiveUserByPeriod({
            gt,
            lte,
          });
          res({
            key,
            period,
            activeUser,
          });
        }
      );
    });
    const activeUsers = await Promise.all(activeUserPromises);

    const userStatDomain = new UserStatDomain({
      eventAt: eventAt,
      data: {
        total: totalUser,
        dau: activeUsers.filter(({ key }) => key === "dau")[0].activeUser,
        wau: activeUsers.filter(({ key }) => key === "wau")[0].activeUser,
        mau: activeUsers.filter(({ key }) => key === "mau")[0].activeUser,
      },
    });
    const createDto = userStatDomain.getCrateDto();

    await this.userStatRepo.create(createDto);
  };

  //GET /stats/users?
  getUserStatListByQuery = async (dto: ServiceUserStatGetListByQueryDto) => {
    const period = {
      start: dto.startDate,
      end: dto.endDate,
    };

    const userStats = await this.userStatRepo.getListByQuery({
      ...dto,
    });

    if (userStats.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          userStats: [],
          period,
        },
      });
    }

    return {
      userStats,
      period,
    };
  };

  //GET /stats/users/version/:versionId/date
  getUserStatByVersionAndEventAt = async (
    dto: ServiceUserStatGetByVersionAndEventAt
  ) => {
    const userStat = await this.userStatRepo.getByVersionAndEventAt(dto);

    if (!userStat) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return userStat;
  };
}
