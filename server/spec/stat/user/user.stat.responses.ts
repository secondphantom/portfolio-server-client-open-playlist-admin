export type ResponseUserStatGetListByQuery = {
  userStats: {
    eventAt: string;
    version: number;
    data: {
      total: number;
      dau: number;
      wau: number;
      mau: number;
    };
    createdAt: string;
    updatedAt: string;
  }[];
  period: { start: string; end: string };
};

export type ResponseUserStatGetByVersionAndEventAt = {
  eventAt: string;
  version: number;
  data: {
    total: number;
    dau: number;
    wau: number;
    mau: number;
  };
  createdAt: string;
  updatedAt: string;
};
