import { channels } from "@/server/schema/schema";

export type ChannelEntitySelect = typeof channels.$inferSelect;
export type ChannelEntityInsert = typeof channels.$inferInsert;

export type QueryChannelListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  channelId?: string;
};

export interface IChannelRepo {
  getListByQuery: (
    query: QueryChannelListDto
  ) => Promise<ChannelEntitySelect[]>;
  getById: <T extends keyof ChannelEntitySelect>(
    channelId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof ChannelEntitySelect]?: boolean }
  ) => Promise<Pick<ChannelEntitySelect, T> | undefined>;
  updateById: (
    channelId: string,
    value: Partial<ChannelEntitySelect>
  ) => Promise<void>;
}
