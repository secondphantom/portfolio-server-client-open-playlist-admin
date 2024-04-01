import { v4 as uuidv4 } from "uuid";

import { SessionData, sessions } from "../schema/schema";

export type SessionEntitySelect = typeof sessions.$inferSelect;
export type SessionEntityInsert = typeof sessions.$inferInsert;

export type RepoCreateSessionDto = {
  id: string;
  adminId: number;
  data: {
    ip: string;
    userAgent: string;
    device: any;
  };
};

export class SessionDomain {
  id: string;
  adminId: number;
  data: SessionData;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  constructor({
    id,
    adminId,
    data,
    createdAt,
    updatedAt,
  }: Omit<SessionEntitySelect, "id" | "createdAt" | "updatedAt"> &
    Partial<SessionEntitySelect>) {
    this.id = id ? id : uuidv4();
    this.adminId = adminId;
    this.data = data;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getCreateDto = (): RepoCreateSessionDto => {
    return {
      id: this.id,
      adminId: this.adminId,
      data: this.data,
    };
  };
}
