import otpGenerator from "otp-generator";

import { IUtils } from "@/server/application/interfaces/utils";

export class Utils implements IUtils {
  static instance: Utils | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new Utils();
    return this.instance;
  };

  generateOtp = () => {
    const otpCode = otpGenerator.generate(6, { specialChars: false });

    return otpCode;
  };
}
