import * as schema from "../../schema/schema";
import {
  NoticeEntitySelect,
  INoticeRepo,
  QueryNoticeListDto,
  NoticeEntityInsert,
} from "@/server/application/interfaces/notice.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";
import { AdminEntitySelect } from "@/server/domain/admin.domain";

export class NoticeRepo implements INoticeRepo {
  static instance: NoticeRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new NoticeRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: NoticeEntityInsert) => {
    await this.db.insert(schema.notices).values(dto);
  };

  getListByQuery = async ({
    order,
    page,
    id,
    pageSize,
    adminId,
  }: QueryNoticeListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.users.createdAt)];
        case "old":
          return [asc(schema.users.createdAt)];
        default:
          return [];
      }
    })(order);
    const notices = await this.db.query.notices.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[
            id ? eq(value.id, id) : undefined,
            adminId ? eq(value.adminId, adminId) : undefined,
          ].filter((v) => !!v)
        );
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      with: {
        admin: {
          columns: {
            id: true,
            profileName: true,
          },
        },
      },
    });

    return notices;
  };

  getById = async <T extends keyof NoticeEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof NoticeEntitySelect]?: boolean }
  ) => {
    const notice = this.db.query.notices.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof NoticeEntitySelect]: boolean })
        : undefined,
    });
    return notice;
  };

  getByIdWith = async <
    T extends keyof NoticeEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    id: number,
    columns?: {
      notice?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof NoticeEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => {
    const notice = this.db.query.notices.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns?.notice,
      with: {
        admin: columns?.admin
          ? {
              columns: columns?.admin,
            }
          : undefined,
      },
    });

    return notice as any;
  };

  updateById = async (id: number, value: Partial<NoticeEntitySelect>) => {
    await this.db
      .update(schema.notices)
      .set(value)
      .where(eq(schema.notices.id, id));
  };

  deleteById = async (id: number) => {
    await this.db.delete(schema.notices).where(eq(schema.notices.id, id));
  };
}
