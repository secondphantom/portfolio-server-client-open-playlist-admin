export type ResponseCategoryGetListByQuery = {
  categories: {
    id: number;
    name: string;
    parentId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseCategoryGetById = {
  id: number;
  name: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
};
