export type RequestNoticeCrete = {
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

export type RequestNoticeGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  id?: string;
  adminId?: string;
};

export type RequestNoticeGetById = {
  id: string;
};

export type RequestNoticeUpdateById = {
  id: number;
  adminId?: number;
  title?: string;
  content?: string;
  isDisplayedOn?: boolean;
  displayStartDate?: string;
  displayEndDate?: string;
};
