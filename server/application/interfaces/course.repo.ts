import { courses } from "@/server/schema/schema";
import { ChannelEntitySelect } from "./channel.repo";

export type CourseEntitySelect = typeof courses.$inferSelect;
export type CourseEntityInsert = typeof courses.$inferInsert;

export type QueryCourseListDto = {
  order: "recent" | "old";
  page: number;
  pageSize: number;
  id?: number;
  videoId?: string;
  channelId?: string;
};

export interface ICourseRepo {
  getListByQuery: (query: QueryCourseListDto) => Promise<
    (CourseEntitySelect & {
      channel: Pick<ChannelEntitySelect, "name" | "channelId">;
    })[]
  >;
  getById: <T extends keyof CourseEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CourseEntitySelect]?: boolean }
  ) => Promise<Pick<CourseEntitySelect, T> | undefined>;
  getByIdWith: <
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
  ) => Promise<
    | (Pick<CourseEntitySelect, T> & {
        channel: Pick<ChannelEntitySelect, W1>;
      })
    | undefined
  >;
  updateById: (id: number, value: Partial<CourseEntitySelect>) => Promise<void>;
}
