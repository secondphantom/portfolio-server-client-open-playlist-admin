export type RequestAnnouncementCreate = {
  auth: {
    adminId: number;
  };
  content: {
    title: string;
    content: string;
    isDisplayedOn: boolean;
    displayStartDate?: string;
    displayEndDate?: string;
  };
};

export type RequestAnnouncementGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  id?: string;
  adminId?: string;
};

export type RequestAnnouncementGetById = {
  id: string;
};

export type RequestAnnouncementUpdateById = {
  id: string;
  adminId?: number;
  title?: string;
  content?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: string;
  displayEndDate?: string;
};

export type RequestAnnouncementDeleteById = {
  id: string;
};
