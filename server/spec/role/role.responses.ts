export type ResponseRoleGetListByQuery = {
  roles: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseRoleGetById = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};
