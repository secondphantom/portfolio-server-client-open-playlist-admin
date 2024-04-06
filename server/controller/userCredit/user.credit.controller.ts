import { UserCreditService } from "@/server/application/service/user.credit.service";
import { IUserCreditRequestValidator } from "./user.credit.interface";
import { RequestUserCreditUpdate } from "@/server/spec/userCredit/user.credit.requests";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  userCreditService: UserCreditService;
  userCreditRequestValidator: IUserCreditRequestValidator;
};

export class UserCreditController {
  static instance: UserCreditController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserCreditController(inputs);
    return this.instance;
  };

  private userCreditRequestValidator: IUserCreditRequestValidator;
  private userCreditService: UserCreditService;

  constructor({
    userCreditRequestValidator,
    userCreditService,
  }: ControllerInputs) {
    this.userCreditRequestValidator = userCreditRequestValidator;
    this.userCreditService = userCreditService;
  }

  updateUserCredit = async (req: RequestUserCreditUpdate) => {
    try {
      const dto = this.userCreditRequestValidator.updateUserCredit(req);
      await this.userCreditService.updateUserCredit(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
