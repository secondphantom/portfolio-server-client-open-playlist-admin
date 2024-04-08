import { channels } from "@/server/schema/schema";

export type ChannelEntitySelect = typeof channels.$inferSelect;
export type ChannelEntityInsert = typeof channels.$inferInsert;

export interface IChannelRepo {}
