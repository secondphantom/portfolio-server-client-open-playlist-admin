import { v4 as uuidv4 } from "uuid";

import { SessionData, sessions } from "../schema/schema";

export type SessionEntitySelect = typeof sessions.$inferSelect;
export type SessionEntityInsert = typeof sessions.$inferInsert;

export type RepoCreateSessionDto = {
  sessionKey: string;
  adminId: number;
  data: {
    ip: string;
    userAgent: string;
    device: any;
  };
};

export class SessionDomain {
  id: number | undefined;
  sessionKey: string;
  adminId: number;
  data: SessionData;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    sessionKey,
    adminId,
    data,
    createdAt,
    updatedAt,
  }: Omit<
    SessionEntitySelect,
    "id" | "sessionKey" | "createdAt" | "updatedAt"
  > &
    Partial<SessionEntitySelect>) {
    this.id = id;
    this.sessionKey = sessionKey ? sessionKey : uuidv4();
    this.adminId = adminId;
    this.data = data;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getCreateDto = (): RepoCreateSessionDto => {
    return {
      sessionKey: this.sessionKey,
      adminId: this.adminId,
      data: this.data,
    };
  };
}
