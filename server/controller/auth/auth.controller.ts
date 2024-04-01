import { AuthService } from "@/server/application/service/auth.service";
import { IAuthRequestValidator } from "./auth.interface";
import { ControllerResponse } from "@/server/dto/response";
import {
  RequestAuthSignIn,
  RequestAuthSignOut,
  RequestAuthVerifyOtp,
  RequestVerifySession,
} from "@/server/spec/auth/auth.requests";
import { errorResolver } from "@/server/dto/error.resolver";

type ControllerInputs = {
  authService: AuthService;
  authRequestValidator: IAuthRequestValidator;
};

export class AuthController {
  static instance: AuthController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AuthController(inputs);
    return this.instance;
  };

  private authRequestValidator: IAuthRequestValidator;
  private authService: AuthService;

  constructor({ authRequestValidator, authService }: ControllerInputs) {
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

  verifyOtp = async (req: RequestAuthVerifyOtp) => {
    try {
      const dto = this.authRequestValidator.verifyOtp(req);
      const data = await this.authService.verifyOtp(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Verify",
        },
        headers: [
          {
            name: "Set-Cookie",
            value: `sessionId=${data.sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict;`,
          },
        ],
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

  signOut = async (req: RequestAuthSignOut) => {
    try {
      const dto = this.authRequestValidator.signOut(req);
      await this.authService.signOut(dto);
      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Sign Out",
        },
        headers: [
          {
            name: "Set-Cookie",
            value: `sessionId=; Path=/; HttpOnly; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
          },
        ],
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

  verifySession = async (req: RequestVerifySession) => {
    try {
      const dto = this.authRequestValidator.verifySession(req);
      const data = await this.authService.verifySession(dto);
      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
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
