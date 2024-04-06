import {
  ServiceUserGetByIdDto,
  ServiceUserGetListByQueryDto,
  ServiceUserUpdateByIdDto,
} from "@/server/application/service/user.service";
import {
  RequestUserGetById,
  RequestUserGetListByQuery,
  RequestUserUpdateById,
} from "@/server/spec/user/user.requests";

export type IUserRequestValidator = {
  getUserById: (req: RequestUserGetById) => ServiceUserGetByIdDto;
  updateUserById: (req: RequestUserUpdateById) => ServiceUserUpdateByIdDto;
  getUserListByQuery: (
    req: RequestUserGetListByQuery
  ) => ServiceUserGetListByQueryDto;
};
