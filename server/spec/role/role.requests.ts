export type RequestRoleCreate = {
  id: number;
  name: string;
};

export type RequestRoleGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  id?: string;
};

export type RequestRoleGetById = {
  id: string;
};

export type RequestRoleUpdateById = {
  id: string;
  name?: string;
};

export type RequestRoleDeleteById = {
  id: string;
};
