export type RequestSessionGetListByQuery = {
  auth: {
    adminId: number;
    id: number;
  };
  query: {
    page?: number;
    order?: "recent" | "old";
  };
};

export type RequestSessionGetById = {
  auth: {
    id: number;
  };
  params: {
    id: string;
  };
};

export type RequestSessionDeleteById = {
  sessionKey: string;
  id: number;
};
