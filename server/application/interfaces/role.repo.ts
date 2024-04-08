import { roles } from "@/server/schema/schema";

export type RoleEntitySelect = typeof roles.$inferSelect;
export type RoleEntityInsert = typeof roles.$inferInsert;

export type QueryRoleListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
};

export interface IRoleRepo {
  create: (dto: RoleEntityInsert) => Promise<void>;
  getListByQuery: (query: QueryRoleListDto) => Promise<RoleEntitySelect[]>;
  getById: <T extends keyof RoleEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof RoleEntitySelect]?: boolean }
  ) => Promise<Pick<RoleEntitySelect, T> | undefined>;
  updateById: (id: number, value: Partial<RoleEntitySelect>) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
}
