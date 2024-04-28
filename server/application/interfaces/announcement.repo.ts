import { AdminEntitySelect } from "@/server/domain/admin.domain";
import { announcements } from "@/server/schema/schema";

export type AnnouncementEntitySelect = typeof announcements.$inferSelect;
export type AnnouncementEntityInsert = typeof announcements.$inferInsert;

export type QueryAnnouncementListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
  adminId?: number;
};

export interface IAnnouncementRepo {
  create: (dto: AnnouncementEntityInsert) => Promise<void>;
  getListByQuery: (query: QueryAnnouncementListDto) => Promise<
    (AnnouncementEntitySelect & {
      admin: Pick<AdminEntitySelect, "profileName" | "id">;
    })[]
  >;
  getById: <T extends keyof AnnouncementEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => Promise<Pick<AnnouncementEntitySelect, T> | undefined>;
  getByIdWith: <
    T extends keyof AnnouncementEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    id: number,
    columns?: {
      announcement?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof AnnouncementEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => Promise<
    | (Pick<AnnouncementEntitySelect, T> & {
        credit: Pick<AdminEntitySelect, W1>;
      })
    | undefined
  >;
  updateById: (
    id: number,
    value: Partial<AnnouncementEntitySelect>
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
}
