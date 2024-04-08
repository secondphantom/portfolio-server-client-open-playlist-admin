import {
  ChannelEntitySelect,
  IChannelRepo,
  QueryChannelListDto,
} from "@/server/application/interfaces/channel.repo";
import * as schema from "../../schema/schema";

import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";

export class ChannelRepo implements IChannelRepo {
  static instance: ChannelRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }
  getListByQuery = async ({
    order,
    page,
    channelId,
    pageSize,
  }: QueryChannelListDto) => {
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
    const channels = await this.db.query.channels.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[channelId ? eq(value.channelId, channelId) : undefined].filter(
            (v) => !!v
          )
        );
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return channels;
  };

  getById = async <T extends keyof ChannelEntitySelect>(
    channelId: string,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof ChannelEntitySelect]?: boolean }
  ) => {
    const channel = this.db.query.channels.findFirst({
      where: (value, { eq }) => {
        return eq(value.channelId, channelId);
      },
      columns: columns
        ? (columns as { [key in keyof ChannelEntitySelect]: boolean })
        : undefined,
    });
    return channel;
  };

  updateById = async (
    channelId: string,
    value: Partial<ChannelEntitySelect>
  ) => {
    await this.db
      .update(schema.channels)
      .set(value)
      .where(eq(schema.channels.channelId, channelId));
  };
}
