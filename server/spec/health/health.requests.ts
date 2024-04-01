export type RequestHealthGetListByQuery = {
  page?: number;
  version?: number;
  order?: "recent" | "old";
};

export type RequestHealthGetById = {
  id: number;
};
