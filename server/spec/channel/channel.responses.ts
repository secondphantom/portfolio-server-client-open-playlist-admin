export type ResponseChannelGetListByQuery = {
  channels: {
    channelId: string;
    name: string;
    handle: string;
    enrollCount: number;
    extra: any;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseChannelGetById = {
  channelId: string;
  name: string;
  handle: string;
  enrollCount: number;
  extra: any;
  createdAt: string;
  updatedAt: string;
};
