export type ResponseUserGetById = {
  id: number;
  email: string;
  isEmailVerified: boolean;
  profileName: string;
  profileImage: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  credit: {
    freeCredits: number;
    purchasedCredits: number;
    freeCreditUpdatedAt: string;
    purchasedCreditUpdatedAt: string;
  };
};

export type ResponseUserGetListByQuery = {
  users: {
    id: number;
    email: string;
    isEmailVerified: boolean;
    profileName: string;
    profileImage: string;
    roleId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};
