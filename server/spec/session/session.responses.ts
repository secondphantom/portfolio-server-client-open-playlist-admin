export type ResponseSessionGetListByQuery = {
  sessions: {
    id: number;
    data: {
      device: any;
      ip: string;
      userAgent: string;
    };
    createdAt: string;
    updatedAt: string;
    isCurrent: boolean;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseSessionsGetById = {
  id: number;
  data: {
    device: any;
    ip: string;
    userAgent: string;
  };
  createdAt: string;
  updatedAt: string;
  isCurrent: boolean;
};
