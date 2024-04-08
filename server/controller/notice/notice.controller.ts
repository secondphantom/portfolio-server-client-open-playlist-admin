import { NoticeService } from "@/server/application/service/notice.service";
import { INoticeRequestValidator } from "./notice.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestNoticeCrete,
  RequestNoticeDeleteById,
  RequestNoticeGetById,
  RequestNoticeGetListByQuery,
  RequestNoticeUpdateById,
} from "@/server/spec/notice/notice.requests";

type ControllerInputs = {
  noticeService: NoticeService;
  noticeRequestValidator: INoticeRequestValidator;
};

export class NoticeController {
  static instance: NoticeController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new NoticeController(inputs);
    return this.instance;
  };

  private noticeRequestValidator: INoticeRequestValidator;
  private noticeService: NoticeService;

  constructor({ noticeRequestValidator, noticeService }: ControllerInputs) {
    this.noticeRequestValidator = noticeRequestValidator;
    this.noticeService = noticeService;
  }

  createNotice = async (req: RequestNoticeCrete) => {
    try {
      const dto = this.noticeRequestValidator.createNotice(req);
      await this.noticeService.createNotice(dto);

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

  getNoticeListByQuery = async (req: RequestNoticeGetListByQuery) => {
    try {
      const dto = this.noticeRequestValidator.getNoticeListByQuery(req);
      const data = await this.noticeService.getNoticeListByQuery(dto);

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

  getNoticeById = async (req: RequestNoticeGetById) => {
    try {
      const dto = this.noticeRequestValidator.getNoticeById(req);
      const data = await this.noticeService.getNoticeById(dto);

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

  updateNoticeById = async (req: RequestNoticeUpdateById) => {
    try {
      const dto = this.noticeRequestValidator.updateNoticeById(req);
      await this.noticeService.updateNoticeById(dto);

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

  deleteNoticeById = async (req: RequestNoticeDeleteById) => {
    try {
      const dto = this.noticeRequestValidator.deleteNoticeById(req);
      await this.noticeService.deleteNoticeById(dto);

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
