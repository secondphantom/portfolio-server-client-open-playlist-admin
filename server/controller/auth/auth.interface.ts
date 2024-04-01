import {
  ServiceAuthSignInDto,
  ServiceAuthSignOutDto,
  ServiceAuthVerifyOtpDto,
  ServiceAuthVerifySession,
} from "@/server/application/service/auth.service";
import {
  RequestAuthSignIn,
  RequestAuthSignOut,
  RequestAuthVerifyOtp,
  RequestVerifySession,
} from "@/server/spec/auth/auth.requests";

export interface IAuthRequestValidator {
  signIn: (req: RequestAuthSignIn) => ServiceAuthSignInDto;
  verifyOtp: (req: RequestAuthVerifyOtp) => ServiceAuthVerifyOtpDto;
  signOut: (req: RequestAuthSignOut) => ServiceAuthSignOutDto;
  verifySession: (req: RequestVerifySession) => ServiceAuthVerifySession;
}
