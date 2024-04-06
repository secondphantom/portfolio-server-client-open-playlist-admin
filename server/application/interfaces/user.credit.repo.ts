import { userCredits } from "@/server/schema/schema";

export type UserCreditEntityInsert = typeof userCredits.$inferInsert;
export type UserCreditEntitySelect = typeof userCredits.$inferSelect;

export interface IUserCreditRepo {
  updateByUserId: (
    userId: number,
    value: Partial<UserCreditEntitySelect>
  ) => Promise<void>;
}
