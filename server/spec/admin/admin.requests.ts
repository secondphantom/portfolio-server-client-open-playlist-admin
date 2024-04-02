export type RequestAdminCreate = {
  email: string;
  profileName?: string;
};

export type RequestAdminGetListByQuery = {
  page?: number;
  order?: "recent" | "old";
  roleId?: number;
  email?: string;
};

export type RequestAdminGetById = {
  id: number;
};

export type RequestAdminDeleteById = {
  id: number;
};
