import { notices } from "@/server/schema/schema";

export type NoticeEntitySelect = typeof notices.$inferSelect;
export type NoticeEntityInsert = typeof notices.$inferInsert;

export type QueryNoticeListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
};

export interface INoticeRepo {
  create: (dto: NoticeEntityInsert) => Promise<void>;
  getListByQuery: (query: QueryNoticeListDto) => Promise<NoticeEntitySelect[]>;
  getById: <T extends keyof NoticeEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof NoticeEntitySelect]?: boolean }
  ) => Promise<Pick<NoticeEntitySelect, T> | undefined>;
  updateById: (id: number, value: Partial<NoticeEntitySelect>) => Promise<void>;
}
