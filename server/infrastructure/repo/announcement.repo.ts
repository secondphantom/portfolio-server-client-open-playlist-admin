import * as schema from "../../schema/schema";
import {
  AnnouncementEntitySelect,
  IAnnouncementRepo,
  QueryAnnouncementListDto,
  AnnouncementEntityInsert,
} from "@/server/application/interfaces/announcement.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";
import { AdminEntitySelect } from "@/server/domain/admin.domain";

export class AnnouncementRepo implements IAnnouncementRepo {
  static instance: AnnouncementRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: AnnouncementEntityInsert) => {
    await this.db.insert(schema.announcements).values(dto);
  };

  getListByQuery = async ({
    order,
    page,
    id,
    pageSize,
    adminId,
  }: QueryAnnouncementListDto) => {
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
    const announcements = await this.db.query.announcements.findMany({
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

    return announcements;
  };

  getById = async <T extends keyof AnnouncementEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof AnnouncementEntitySelect]?: boolean }
  ) => {
    const announcement = this.db.query.announcements.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof AnnouncementEntitySelect]: boolean })
        : undefined,
    });
    return announcement;
  };

  getByIdWith = async <
    T extends keyof AnnouncementEntitySelect,
    W1 extends keyof AdminEntitySelect
  >(
    id: number,
    columns?: {
      announcement?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof AnnouncementEntitySelect]?: boolean };
      admin?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof AdminEntitySelect]?: boolean };
    }
  ) => {
    const announcement = this.db.query.announcements.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns?.announcement,
      with: {
        admin: columns?.admin
          ? {
              columns: columns?.admin,
            }
          : undefined,
      },
    });

    return announcement as any;
  };

  updateById = async (id: number, value: Partial<AnnouncementEntitySelect>) => {
    await this.db
      .update(schema.announcements)
      .set(value)
      .where(eq(schema.announcements.id, id));
  };

  deleteById = async (id: number) => {
    await this.db
      .delete(schema.announcements)
      .where(eq(schema.announcements.id, id));
  };
}
