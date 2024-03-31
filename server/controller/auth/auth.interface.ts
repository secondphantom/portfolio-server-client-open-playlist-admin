import { ServiceAuthSignInDto } from "@/server/application/service/auth.service";
import { RequestAuthSignIn } from "@/server/spec/auth/auth.requests";

export interface IAuthRequestValidator {
  signIn: (req: RequestAuthSignIn) => ServiceAuthSignInDto;
}
