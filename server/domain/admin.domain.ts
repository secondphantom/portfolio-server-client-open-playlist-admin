import { admins } from "../schema/schema";

export type AdminEntitySelect = typeof admins.$inferSelect;
export type AdminEntityInsert = typeof admins.$inferInsert;

export class AdminDomain {
  private id: number | undefined;
  private email: string;
  private roleId: number | undefined;
  private otpCode: string | null | undefined;
  private otpExpirationAt: Date | undefined;
  private profileName: string;
  private profileImage: string | null | undefined;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

  OTP_CODE_EXPIRATION_DURATION_SEC = 600;

  constructor({
    id,
    email,
    roleId,
    otpCode,
    otpExpirationAt,
    profileName,
    profileImage,
    createdAt,
    updatedAt,
  }: AdminEntityInsert) {
    this.id = id;
    this.email = email;
    this.roleId = roleId;
    this.otpCode = otpCode;
    this.otpExpirationAt = otpExpirationAt;
    this.profileName = profileName;
    this.profileImage = profileImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateOtp = (otpCode: string) => {
    this.otpCode = otpCode;
    this.otpExpirationAt = new Date(
      new Date().getTime() + this.OTP_CODE_EXPIRATION_DURATION_SEC * 1000
    );
  };

  getEntity = () => {
    return {
      id: this.id,
      email: this.email,
      roleId: this.roleId,
      otpCode: this.otpCode,
      otpExpirationAt: this.otpExpirationAt,
      profileName: this.profileName,
      profileImage: this.profileImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };
}
