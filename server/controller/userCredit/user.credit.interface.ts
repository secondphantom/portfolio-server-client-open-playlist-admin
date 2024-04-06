import { ServiceUserCreditUpdateDto } from "@/server/application/service/user.credit.service";
import { RequestUserCreditUpdate } from "@/server/spec/userCredit/user.credit.requests";

export type IUserCreditRequestValidator = {
  updateUserCredit: (
    req: RequestUserCreditUpdate
  ) => ServiceUserCreditUpdateDto;
};
