import { UserStatData, userStats } from "../schema/schema";

export type UserStatEntitySelect = typeof userStats.$inferSelect;
export type UserStatEntityInsert = typeof userStats.$inferInsert;

export type RepoCreateUserStatDto = {
  version: number;
  eventAt: Date;
  data: UserStatData;
};

export class UserStatDomain {
  version: number;
  eventAt: Date;
  data: UserStatData;
  createdAt: Date | undefined;

  constructor({
    version,
    eventAt,
    data,
    createdAt,
  }: Omit<UserStatEntitySelect, "id" | "version" | "createdAt" | "updatedAt"> &
    Partial<UserStatEntitySelect>) {
    this.version = version === undefined ? 1 : version;
    this.eventAt = eventAt;
    this.data = data;
    this.createdAt = createdAt;
  }

  getCrateDto = (): RepoCreateUserStatDto => {
    return {
      version: this.version,
      eventAt: this.eventAt,
      data: this.data,
    };
  };
}
