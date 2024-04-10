export type ResponseAdminGetListByQuery = {
  admins: {
    id: number;
    email: string;
    roleId: number;
    profileName: string;
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseAdminGetById = {
  id: number;
  email: string;
  roleId: number;
  profileName: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};
