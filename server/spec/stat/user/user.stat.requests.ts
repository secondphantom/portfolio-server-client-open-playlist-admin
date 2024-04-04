export type RequestUserStatCreate = {
  version: number;
  eventAt: string;
};

export type RequestUserStateGetListByQuery = {
  version: number;
  startDate: string;
  endDate: string;
};

export type RequestUserStatGetByVersionAndEventAt = {
  version: number;
  eventAt: string;
};
