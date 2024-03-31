import {
  SESClient,
  CloneReceiptRuleSetCommand,
  SendEmailCommand,
} from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

import {
  IEmailUtil,
  SendEmailInputs,
} from "@/server/application/interfaces/email.util";

export class EmailUtil implements IEmailUtil {
  static instance: EmailUtil | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new EmailUtil();
    return this.instance;
  };
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: "us-east-1",
      credentialDefaultProvider: defaultProvider,
    });
  }

  sendEmail = async ({ from, to, message, subject }: SendEmailInputs) => {
    try {
    } catch (error) {}

    const command = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: to.map((v) => v.email),
      },
      Message: {
        Body: {
          // 이메일 본문 내용
          Text: {
            Charset: "UTF-8",
            Data: message,
          },
        },
        Subject: {
          // 이메일 제목
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: `${from.name} <${from.email}>`,
      ReplyToAddresses: [],
    });

    try {
      const response = await this.sesClient.send(command);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
}
