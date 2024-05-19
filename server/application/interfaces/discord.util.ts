export type DiscordNotifyLevel = "error" | "info" | "warn";

export interface IDiscordUtil {
  notify: (
    content: { title: string; description?: string },
    options?: { level?: DiscordNotifyLevel }
  ) => Promise<void>;
}
