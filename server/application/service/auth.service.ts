import { ServerError } from "@/server/dto/error";
import { IAdminRepo } from "../interfaces/admin.repo";
import { IUtils } from "../interfaces/utils";
import { AdminDomain } from "@/server/domain/admin.domain";
import { IEmailUtil } from "../interfaces/email.util";

export type ServiceAuthSignInDto = {
  email: string;
};

type ServiceInputs = {
  adminRepo: IAdminRepo;
  emailUtil: IEmailUtil;
  utils: IUtils;
};

export class AuthService {
  static instance: AuthService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AuthService(inputs);
    return this.instance;
  };

  private adminRepo: IAdminRepo;
  private emailUtil: IEmailUtil;
  private utils: IUtils;

  constructor({ adminRepo, emailUtil, utils }: ServiceInputs) {
    this.adminRepo = adminRepo;
    this.emailUtil = emailUtil;
    this.utils = utils;
  }

  // POST /auth/sign-in
  signIn = async ({ email }: ServiceAuthSignInDto) => {
    const admin = await this.adminRepo.getByEmail(email);
    if (!admin) {
      throw new ServerError({
        message: "Unauthorized",
        code: 401,
      });
    }

    const adminDomain = new AdminDomain(admin);
    const otpCode = this.utils.generateOtp();
    adminDomain.updateOtp(otpCode);
    const entity = adminDomain.getEntity();

    await this.adminRepo.updateByEmail(entity.email, {
      otpCode: entity.otpCode,
      otpExpirationAt: entity.otpExpirationAt,
    });

    const { success: successSendEmail } = await this.emailUtil.sendEmail({
      from: {
        email: "noreplay@openplaylist.net",
        name: "Open Playlist",
      },
      to: [{ email: admin.email }],
      subject: `Your One-Time Password (OTP) for Account Login`,
      message: `Dear ${admin.profileName},\n\nWe've received a request to access your account via a secure login. To ensure the security of your account, we require verification through a One-Time Password (OTP).\n\nYour OTP: ${otpCode}\n\nPlease enter this code on the login page to proceed. Remember, this OTP is valid for only 15 minutes and should not be shared with anyone.\n\nIf you didn't request this code, it's possible someone else is trying to access your account. Please do not share your OTP, and contact our support team immediately for assistance.\n\nThank you for helping us keep your account secure.\n\nBest regards`,
    });

    if (!successSendEmail) {
      throw new ServerError({
        message: "Fail to send verification email",
        code: 500,
      });
    }
  };

  // POST /auth/sign-in/verify-otp

  // POST /auth/sign-out
}
