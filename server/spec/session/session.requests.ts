export type RequestSessionGetListByQuery = {
  auth: {
    adminId: number;
    sessionId: string;
  };
  query: {
    page?: number;
    order?: "recent" | "old";
  };
};

export type RequestSessionGetById = {
  auth: {
    sessionId: string;
  };
  params: {
    id: string;
  };
};

export type RequestSessionDeleteById = {
  id: string;
};
