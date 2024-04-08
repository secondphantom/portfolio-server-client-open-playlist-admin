export type RequestChannelGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  channelId?: string;
};

export type RequestChannelGetById = {
  channelId: string;
};

export type RequestChannelUpdateById = {
  channelId: string;
  name?: string;
  handle?: string;
  enrollCount?: number;
};
