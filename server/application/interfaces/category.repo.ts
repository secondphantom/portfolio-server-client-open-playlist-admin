import { categories } from "@/server/schema/schema";

export type CategoryEntitySelect = typeof categories.$inferSelect;
export type CategoryEntityInsert = typeof categories.$inferInsert;

export type QueryCategoryListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
  parentId?: number;
};

export interface ICategoryRepo {
  create: (dto: CategoryEntityInsert) => Promise<void>;
  getListByQuery: (
    query: QueryCategoryListDto
  ) => Promise<CategoryEntitySelect[]>;
  getById: <T extends keyof CategoryEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CategoryEntitySelect]?: boolean }
  ) => Promise<Pick<CategoryEntitySelect, T> | undefined>;
  updateById: (
    id: number,
    value: Partial<CategoryEntitySelect>
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
}
