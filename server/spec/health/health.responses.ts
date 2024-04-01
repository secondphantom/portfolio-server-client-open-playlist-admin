export type ResponseHealthGetListByQuery = {
  healths: {
    id: number;
    version: number;
    data: {
      apis: {
        method: string;
        path: string;
        status: number;
        responseTime: number;
      }[];
    };
    createdAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseHealthGetById = {
  id: number;
  version: number;
  data: {
    apis: {
      method: string;
      path: string;
      status: number;
      responseTime: number;
    }[];
  };
  createdAt: string;
};
