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
  params: {
    id: number;
  };
};

export type RequestSessionDeleteById = {
  auth: {
    adminId: number;
  };
  params: {
    id: number;
  };
};
