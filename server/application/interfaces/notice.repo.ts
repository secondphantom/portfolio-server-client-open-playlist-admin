import { AdminEntitySelect } from "@/server/domain/admin.domain";
import { notices } from "@/server/schema/schema";

export type NoticeEntitySelect = typeof notices.$inferSelect;
export type NoticeEntityInsert = typeof notices.$inferInsert;

export type QueryNoticeListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
  adminId?: number;
};

export interface INoticeRepo {
  create: (dto: NoticeEntityInsert) => Promise<void>;
  getListByQuery: (query: QueryNoticeListDto) => Promise<
    (NoticeEntitySelect & {
      admin: Pick<AdminEntitySelect, "profileName" | "id">;
    })[]
  >;
  getById: <T extends keyof NoticeEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof NoticeEntitySelect]?: boolean }
  ) => Promise<Pick<NoticeEntitySelect, T> | undefined>;
  getByIdWith: <
    T extends keyof NoticeEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    id: number,
    columns?: {
      notice?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof NoticeEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => Promise<
    | (Pick<NoticeEntitySelect, T> & {
        credit: Pick<AdminEntitySelect, W1>;
      })
    | undefined
  >;
  updateById: (id: number, value: Partial<NoticeEntitySelect>) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
}
