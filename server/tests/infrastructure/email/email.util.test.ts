import dotenv from "dotenv";
dotenv.config();

import { SendEmailInputs } from "@/server/application/interfaces/email.util";
import { EmailUtil } from "@/server/infrastructure/email/email.util";

describe("email util", () => {
  let emailUtil: EmailUtil;
  const TEST_EMAIL_DESTINATION = process.env.TEST_EMAIL_DESTINATION!;

  beforeAll(() => {
    emailUtil = EmailUtil.getInstance();
  });

  test("send email", async () => {
    const inputs = {
      from: {
        email: "noreplay@openplaylist.net",
        name: "Open Playlist",
      },
      message: "Sending Email Test",
      subject: "Sending Email Test",
      to: [{ email: TEST_EMAIL_DESTINATION }],
    } satisfies SendEmailInputs;

    const { success } = await emailUtil.sendEmail(inputs);

    console.log({ success });
  });
});
