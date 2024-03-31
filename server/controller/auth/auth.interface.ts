import {
  ServiceAuthSignInDto,
  ServiceAuthVerifyOtpDto,
} from "@/server/application/service/auth.service";
import {
  RequestAuthSignIn,
  RequestAuthVerifyOtp,
} from "@/server/spec/auth/auth.requests";

export interface IAuthRequestValidator {
  signIn: (req: RequestAuthSignIn) => ServiceAuthSignInDto;
  verifyOtp: (req: RequestAuthVerifyOtp) => ServiceAuthVerifyOtpDto;
}
