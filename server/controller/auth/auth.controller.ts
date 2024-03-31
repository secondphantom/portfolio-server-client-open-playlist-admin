import { AuthService } from "@/server/application/service/auth.service";
import { IAuthRequestValidator } from "./auth.interface";
import { ControllerResponse } from "@/server/dto/response";
import { RequestAuthSignIn } from "@/server/spec/auth/auth.requests";
import { errorResolver } from "@/server/dto/error.resolver";

type ConstructorInputs = {
  authService: AuthService;
  authRequestValidator: IAuthRequestValidator;
};

export class AuthController {
  static instance: AuthController | undefined;
  static getInstance = (inputs: ConstructorInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AuthController(inputs);
    return this.instance;
  };

  private authRequestValidator: IAuthRequestValidator;
  private authService: AuthService;

  constructor({ authRequestValidator, authService }: ConstructorInputs) {
    this.authRequestValidator = authRequestValidator;
    this.authService = authService;
  }

  signIn = async (req: RequestAuthSignIn) => {
    try {
      const dto = this.authRequestValidator.signIn(req);
      await this.authService.signIn(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success",
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
