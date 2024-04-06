export type RequestUserGetById = {
  id: number;
};

export type RequestUserUpdateById = {
  id: number;
  isEmailVerified?: boolean;
  profileImage?: string;
  profileName?: string;
  roleId?: number;
};

export type RequestUserGetListByQuery = {
  order?: "recent" | "old";
  page?: number;
  roleId?: number;
  email?: string;
};
