import z from "zod";

import { IAnnouncementRequestValidator } from "@/server/controller/announcement/announcement.interface";
import {
  ServiceAnnouncementCreateDto,
  ServiceAnnouncementGetListByQueryDto,
  ServiceAnnouncementGetByIdDto,
  ServiceAnnouncementUpdateByIdDto,
} from "@/server/application/service/announcement.service";
import {
  RequestAnnouncementCreate,
  RequestAnnouncementGetListByQuery,
  RequestAnnouncementGetById,
  RequestAnnouncementUpdateById,
  RequestAnnouncementDeleteById,
} from "@/server/spec/announcement/announcement.requests";
import { zodDateTransform, zodIntTransform } from "./lib/zod.util";
import { ServerError } from "@/server/dto/error";

export class AnnouncementRequestValidator
  implements IAnnouncementRequestValidator
{
  static instance: AnnouncementRequestValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementRequestValidator();
    return this.instance;
  };

  constructor() {}

  private requestAnnouncementCreate = z
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

  createAnnouncement = (req: RequestAnnouncementCreate) => {
    try {
      const dto = this.requestAnnouncementCreate.parse(req);
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

  private requestAnnouncementGetListByQuery = z
    .object({
      order: z.union([z.literal("recent"), z.literal("old")]).optional(),
      page: zodIntTransform.optional(),
      id: zodIntTransform.optional(),
      adminId: zodIntTransform.optional(),
    })
    .strict();
  getAnnouncementListByQuery = (req: RequestAnnouncementGetListByQuery) => {
    try {
      const dto = this.requestAnnouncementGetListByQuery.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAnnouncementGetById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  getAnnouncementById = (req: RequestAnnouncementGetById) => {
    try {
      const dto = this.requestAnnouncementGetById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAnnouncementUpdateById = z
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
  updateAnnouncementById = (req: RequestAnnouncementUpdateById) => {
    try {
      const dto = this.requestAnnouncementUpdateById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };

  private requestAnnouncementDeleteById = z
    .object({
      id: zodIntTransform,
    })
    .strict();
  deleteAnnouncementById = (req: RequestAnnouncementDeleteById) => {
    try {
      const dto = this.requestAnnouncementDeleteById.parse(req);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
