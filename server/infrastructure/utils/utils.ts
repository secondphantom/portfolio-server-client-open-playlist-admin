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
    const otpCode = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    return otpCode;
  };

  getTimeStamp = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}_${String(
      date.getHours()
    ).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };
}
