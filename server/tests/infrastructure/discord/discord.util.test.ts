import { DiscordUtil } from "@/server/infrastructure/discord/discord.util";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../../.env.development") });

describe("Discord Util", () => {
  let discordUtil: DiscordUtil;

  beforeAll(() => {
    discordUtil = DiscordUtil.getInstance({
      DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL!,
    } as any);
  });

  test("notify", async () => {
    await discordUtil.notify(
      { title: "info", description: "info" },
      { level: "info" }
    );
  });
});
