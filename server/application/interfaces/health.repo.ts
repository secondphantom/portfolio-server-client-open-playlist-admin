import { HealthData, healths } from "@/server/schema/schema";

export type HealthEntitySelect = typeof healths.$inferSelect;
export type HealthEntityInsert = typeof healths.$inferInsert;

export type RepoCreateHealthDto = {
  version: number;
  data: HealthData;
};

export type QueryHealthListDto = {
  page: number;
  version: number;
  order: "recent" | "old";
  pageSize: number;
};

export interface IHealthRepo {
  create: (dto: RepoCreateHealthDto) => Promise<void>;
  getById: (id: number) => Promise<HealthEntitySelect | undefined>;
  getListByQuery: (query: QueryHealthListDto) => Promise<HealthEntitySelect[]>;
}
