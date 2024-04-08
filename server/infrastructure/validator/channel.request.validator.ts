import z from "zod";

import { IChannelRequestValidator } from "@/server/controller/channel/channel.interface";
import {
  RequestChannelGetListByQuery,
  RequestChannelGetById,
  RequestChannelUpdateById,
} from "@/server/spec/channel/channel.requests";
import { zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class ChannelRequestValidator implements IChannelRequestValidator {
  static instance: ChannelRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new ChannelRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestChannelGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      channelId: z.string().min(1).optional(),
    })
    .strict();

  getChannelListByQuery = (req: RequestChannelGetListByQuery) => {
    try {
      const dto = this.requestChannelGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestChannelGetById = z
    .object({
      channelId: z.string(),
    })
    .strict();
  getChannelById = (req: RequestChannelGetById) => {
    try {
      const dto = this.requestChannelGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestChannelUpdateById = z
    .object({
      channelId: z.string(),
      name: z.string().optional(),
      handle: z.string().optional(),
      enrollCount: z.number().optional(),
    })
    .strict();

  updateChannelById = (req: RequestChannelUpdateById) => {
    try {
      const dto = this.requestChannelUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
