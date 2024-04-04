import {
  ServiceUserStatCreateDto,
  ServiceUserStatGetByVersionAndEventAt,
  ServiceUserStatGetListByQueryDto,
} from "@/server/application/service/user.stat.service";
import {
  RequestUserStatCreate,
  RequestUserStatGetByVersionAndEventAt,
  RequestUserStateGetListByQuery,
} from "@/server/spec/stat/user/user.stat.requests";

export type IUserStatRequestValidator = {
  crateUserStat: (req: RequestUserStatCreate) => ServiceUserStatCreateDto;
  getUserStatListByQuery: (
    req: RequestUserStateGetListByQuery
  ) => ServiceUserStatGetListByQueryDto;
  getUserStatByVersionAndEventAt: (
    req: RequestUserStatGetByVersionAndEventAt
  ) => ServiceUserStatGetByVersionAndEventAt;
};
