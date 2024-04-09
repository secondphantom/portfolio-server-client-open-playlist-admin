export type RequestCategoryCreate = {
  id: number;
  name: string;
  parentId: number;
};

export type RequestCategoryGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  id?: string;
  parentId?: number;
};

export type RequestCategoryGetById = {
  id: string;
};

export type RequestCategoryUpdateById = {
  id: string;
  name?: string;
  parentId?: number;
};

export type RequestCategoryDeleteById = {
  id: string;
};
