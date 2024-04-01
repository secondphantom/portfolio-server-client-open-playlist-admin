import { HealthData } from "@/server/schema/schema";

export type ResponseHealthGetListByQuery = {
  healths: {
    id: number;
    version: number;
    data: HealthData;
    createdAt: Date;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseHealthGetById = {
  id: number;
  version: number;
  data: HealthData;
  createdAt: Date;
};
