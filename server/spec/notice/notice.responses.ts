export type ResponseNoticeGetListByQuery = {
  notices: {
    id: number;
    adminId: number;
    title: string;
    content: string;
    isDisplayedOn: boolean;
    displayStartDate: string;
    displayEndDate: string;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseNoticeGetById = {
  id: number;
  adminId: number;
  title: string;
  content: string;
  isDisplayedOn: boolean;
  displayStartDate: string;
  displayEndDate: string;
  createdAt: string;
  updatedAt: string;
};
