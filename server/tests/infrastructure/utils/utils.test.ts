import { Utils } from "@/server/infrastructure/utils/utils";

describe("Utils infra", () => {
  let utils = Utils.getInstance();

  test("generateOtp", () => {
    const otpCode = utils.generateOtp();

    expect(otpCode).toEqual(expect.any(String));
    expect(otpCode.length).toEqual(6);
  });
});
