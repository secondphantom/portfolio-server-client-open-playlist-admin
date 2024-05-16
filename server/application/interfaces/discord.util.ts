interface IDiscordUtil {
  notify: (
    content: { title: string; description?: string },
    options?: { level?: "error" | "info" }
  ) => Promise<void>;
}
