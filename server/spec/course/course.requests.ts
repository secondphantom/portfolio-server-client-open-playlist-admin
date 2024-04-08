export type RequestCourseGetListByQuery = {
  order?: "recent" | "old";
  page?: string;
  id?: string;
  videoId?: string;
  channelId?: string;
};

export type RequestCourseGetById = {
  id: string;
};

export type RequestCourseUpdateById = {
  id: number;
  version?: number;
  categoryId?: number;
  language?: string;
  title?: string;
  description?: string;
  summary?: string;
  chapters?: { title: string; time: number }[];
  enrollCount?: number;
  generatedAi?: boolean;
};
