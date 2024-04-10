import {
  AdminEntitySelect,
  RepoCreateAdminDto,
} from "@/server/domain/admin.domain";

export type QueryAdminListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
  roleId?: number;
  email?: string;
};
export interface IAdminRepo {
  getByEmail: <T extends keyof AdminEntitySelect>(
    email: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => Promise<Pick<AdminEntitySelect, T> | undefined>;

  updateByEmail: (
    email: string,
    value: Partial<AdminEntitySelect>
  ) => Promise<void>;

  create: (dto: RepoCreateAdminDto) => Promise<void>;

  getListByQuery: (
    query: QueryAdminListDto
  ) => Promise<Omit<AdminEntitySelect, "otpCode" | "otpExpirationAt">[]>;

  getById: <T extends keyof AdminEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AdminEntitySelect]?: boolean }
  ) => Promise<Pick<AdminEntitySelect, T> | undefined>;

  deleteById: (id: number) => Promise<void>;

  deleteByEmail: (email: string) => Promise<void>;

  updateById: (id: number, value: Partial<AdminEntitySelect>) => Promise<void>;
}
