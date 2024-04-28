export type ResponseAnnouncementGetListByQuery = {
  announcements: {
    id: number;
    adminId: number;
    title: string;
    content: string;
    isDisplayedOn: boolean;
    displayStartDate: string;
    displayEndDate: string;
    createdAt: string;
    updatedAt: string;
    admin: {
      adminId: number;
      profileName: string;
    };
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseAnnouncementGetById = {
  id: number;
  adminId: number;
  title: string;
  content: string;
  isDisplayedOn: boolean;
  displayStartDate: string;
  displayEndDate: string;
  createdAt: string;
  updatedAt: string;
  admin: {
    adminId: number;
    profileName: string;
  };
};
