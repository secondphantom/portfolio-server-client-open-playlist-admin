import { IDiscordUtil } from "@/server/application/interfaces/discord.util";
import { ENV } from "@/server/env";
import axios from "axios";

type DiscordNotifyLevel = "error" | "info" | "warn";
type C_ENV = Pick<ENV, "DISCORD_WEBHOOK_URL">;

export class DiscordUtil implements IDiscordUtil {
  static instance: DiscordUtil | undefined;
  static getInstance = (env: C_ENV) => {
    if (this.instance) return this.instance;
    this.instance = new DiscordUtil(env);
    return this.instance;
  };

  private NOTIFY_COLORS = {
    info: 16777215,
    error: 15548997,
    warn: 16705372,
  };

  private DISCORD_USERNAME = "Open Playlist Bot";

  constructor(private env: C_ENV) {}

  notify = async (
    content: { title: string; description?: string | undefined },
    options?: { level?: DiscordNotifyLevel } | undefined
  ) => {
    await axios
      .post(this.env.DISCORD_WEBHOOK_URL, {
        username: this.DISCORD_USERNAME,
        embeds: [
          {
            title: content.title,
            description: content.description,
            color: this.NOTIFY_COLORS[options?.level ? options?.level : "info"],
          },
        ],
      })
      .catch(console.log);
  };
}
