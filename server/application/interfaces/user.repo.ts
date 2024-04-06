import { users } from "@/server/schema/schema";
import { UserCreditEntitySelect } from "./user.credit.repo";

export type UserEntityInsert = typeof users.$inferInsert;
export type UserEntitySelect = typeof users.$inferInsert;

export type QueryUserListDto = {
  page: number;
  pageSize: number;
  order: "recent" | "old";
  roleId?: number;
  email?: string;
};
export interface IUserRepo {
  getTotalUserByPeriod: (period: {
    gte?: Date;
    lte?: Date;
    gt?: Date;
    lt?: Date;
  }) => Promise<number>;
  getUserById: <T extends keyof UserEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof UserEntitySelect]?: boolean }
  ) => Promise<Pick<UserEntitySelect, T> | undefined>;
  getUserByIdWith: <
    T extends keyof UserEntitySelect,
    W1 extends keyof UserCreditEntitySelect
  >(
    id: number,
    columns?: {
      user?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof UserEntitySelect]?: boolean };
      credit?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof UserCreditEntitySelect]?: boolean };
    }
  ) => Promise<
    | (Pick<UserEntitySelect, T> & {
        credit: Pick<UserCreditEntitySelect, W1>;
      })
    | undefined
  >;
  updateUserById: (
    id: number,
    value: Partial<UserEntitySelect>
  ) => Promise<void>;
  getListByQuery: (
    query: QueryUserListDto
  ) => Promise<
    Pick<
      UserEntitySelect,
      | "id"
      | "email"
      | "isEmailVerified"
      | "profileImage"
      | "profileName"
      | "roleId"
      | "updatedAt"
      | "createdAt"
    >[]
  >;
}
