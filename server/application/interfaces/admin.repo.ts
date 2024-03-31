import { AdminEntitySelect } from "@/server/domain/admin.domain";

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
}
