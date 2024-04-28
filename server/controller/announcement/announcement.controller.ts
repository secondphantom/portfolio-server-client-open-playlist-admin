import { AnnouncementService } from "@/server/application/service/announcement.service";
import { IAnnouncementRequestValidator } from "./announcement.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestAnnouncementCreate,
  RequestAnnouncementDeleteById,
  RequestAnnouncementGetById,
  RequestAnnouncementGetListByQuery,
  RequestAnnouncementUpdateById,
} from "@/server/spec/announcement/announcement.requests";

type ControllerInputs = {
  announcementService: AnnouncementService;
  announcementRequestValidator: IAnnouncementRequestValidator;
};

export class AnnouncementController {
  static instance: AnnouncementController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AnnouncementController(inputs);
    return this.instance;
  };

  private announcementRequestValidator: IAnnouncementRequestValidator;
  private announcementService: AnnouncementService;

  constructor({
    announcementRequestValidator,
    announcementService,
  }: ControllerInputs) {
    this.announcementRequestValidator = announcementRequestValidator;
    this.announcementService = announcementService;
  }

  createAnnouncement = async (req: RequestAnnouncementCreate) => {
    try {
      const dto = this.announcementRequestValidator.createAnnouncement(req);
      await this.announcementService.createAnnouncement(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getAnnouncementListByQuery = async (
    req: RequestAnnouncementGetListByQuery
  ) => {
    try {
      const dto =
        this.announcementRequestValidator.getAnnouncementListByQuery(req);
      const data = await this.announcementService.getAnnouncementListByQuery(
        dto
      );

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getAnnouncementById = async (req: RequestAnnouncementGetById) => {
    try {
      const dto = this.announcementRequestValidator.getAnnouncementById(req);
      const data = await this.announcementService.getAnnouncementById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateAnnouncementById = async (req: RequestAnnouncementUpdateById) => {
    try {
      const dto = this.announcementRequestValidator.updateAnnouncementById(req);
      await this.announcementService.updateAnnouncementById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  deleteAnnouncementById = async (req: RequestAnnouncementDeleteById) => {
    try {
      const dto = this.announcementRequestValidator.deleteAnnouncementById(req);
      await this.announcementService.deleteAnnouncementById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Deleted",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
