export type ResponseSessionGetListByQuery = {
  sessions: {
    id: number;
    version: number;
    data: {
      device: any;
      ip: string;
      userAgent: string;
    };
    createdAt: Date;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseSessionsGetById = {
  id: number;
  version: number;
  data: {
    device: any;
    ip: string;
    userAgent: string;
  };
  createdAt: Date;
};
