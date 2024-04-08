import z from "zod";

import { INoticeRequestValidator } from "@/server/controller/notice/notice.interface";
import {
  ServiceNoticeCreateDto,
  ServiceNoticeGetListByQueryDto,
  ServiceNoticeGetByIdDto,
  ServiceNoticeUpdateByIdDto,
} from "@/server/application/service/notice.service";
import {
  RequestNoticeCrete,
  RequestNoticeGetListByQuery,
  RequestNoticeGetById,
  RequestNoticeUpdateById,
  RequestNoticeDeleteById,
} from "@/server/spec/notice/notice.requests";
import { zodDateTransform, zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class NoticeRequestValidator implements INoticeRequestValidator {
  static instance: NoticeRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new NoticeRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestNoticeCrete = z
    .object({
      auth: z
        .object({
          adminId: z.number(),
        })
        .strict(),
      content: z
        .object({
          title: z.string(),
          content: z.string(),
          isDisplayedOn: z.boolean(),
          displayStartDate: zodDateTransform.optional(),
          displayEndDate: zodDateTransform.optional(),
        })
        .strict(),
    })
    .strict();

  createNotice = (req: RequestNoticeCrete) => {
    try {
      const dto = this.requestNoticeCrete.parse(req);
      return {
        ...dto.content,
        ...dto.auth,
      };
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestNoticeGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      id: zodIntTransform.optional(),
      adminId: zodIntTransform.optional(),
    })
    .strict();
  getNoticeListByQuery = (req: RequestNoticeGetListByQuery) => {
    try {
      const dto = this.requestNoticeGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestNoticeGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  getNoticeById = (req: RequestNoticeGetById) => {
    try {
      const dto = this.requestNoticeGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestNoticeUpdateById = z
    .object({
      id: zodIntTransform,
      adminId: z.number().optional(),
      title: z.string().optional(),
      content: z.string().optional(),
      isDisplayedOn: z.boolean().optional(),
      displayStartDate: zodDateTransform.optional(),
      displayEndDate: zodDateTransform.optional(),
    })
    .strict();
  updateNoticeById = (req: RequestNoticeUpdateById) => {
    try {
      const dto = this.requestNoticeUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestNoticeDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  deleteNoticeById = (req: RequestNoticeDeleteById) => {
    try {
      const dto = this.requestNoticeDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
