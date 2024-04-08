export type ResponseCourseGetListByQuery = {
  courses: {
    id: number;
    version: number;
    videoId: string;
    channelId: string;
    categoryId: number;
    language: string;
    title: string;
    titleTsvector: string;
    description: string;
    summary: string | null;
    chapters: { title: string; time: number }[];
    enrollCount: number;
    generatedAi: boolean;
    duration: number;
    extra: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseCourseGetById = {
  id: number;
  version: number;
  videoId: string;
  channelId: string;
  categoryId: number;
  language: string;
  title: string;
  titleTsvector: string;
  description: string;
  summary: string | null;
  chapters: { title: string; time: number }[];
  enrollCount: number;
  generatedAi: boolean;
  duration: number;
  extra: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
