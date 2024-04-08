import * as schema from "../../schema/schema";
import {
  CourseEntitySelect,
  ICourseRepo,
  QueryCourseListDto,
} from "@/server/application/interfaces/course.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";
import { ChannelEntitySelect } from "@/server/application/interfaces/channel.repo";

export class CourseRepo implements ICourseRepo {
  static instance: CourseRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new CourseRepo(drizzleClient);
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
    id,
    videoId,
    pageSize,
  }: QueryCourseListDto) => {
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
    const courses = await this.db.query.courses.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[
            videoId ? eq(value.videoId, videoId) : undefined,
            channelId ? eq(value.channelId, channelId) : undefined,
          ].filter((v) => !!v)
        );
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      with: {
        channel: {
          columns: {
            name: true,
            channelId: true,
          },
        },
      },
    });

    return courses;
  };

  getById = async <T extends keyof CourseEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => {
    const course = this.db.query.courses.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof CourseEntitySelect]: boolean })
        : undefined,
    });
    return course;
  };

  getByIdWith = async <
    T extends keyof CourseEntitySelect,
    W1 extends keyof ChannelEntitySelect
  >(
    id: number,
    columns?: {
      course?:
        | {
            [key in T]?: boolean;
          }
        | { [key in keyof CourseEntitySelect]?: boolean };
      channel?:
        | {
            [key in W1]?: boolean;
          }
        | { [key in keyof ChannelEntitySelect]?: boolean };
    }
  ) => {
    const course = this.db.query.courses.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns?.course,
      with: {
        channel: columns?.channel
          ? {
              columns: columns?.channel,
            }
          : undefined,
      },
    });
    return course as any;
  };
  updateById = async (id: number, value: Partial<CourseEntitySelect>) => {
    await this.db
      .update(schema.courses)
      .set(value)
      .where(eq(schema.courses.id, id));
  };
}
