import { ChannelService } from "@/server/application/service/channel.service";
import { IChannelRequestValidator } from "./channel.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestChannelGetById,
  RequestChannelGetListByQuery,
  RequestChannelUpdateById,
} from "@/server/spec/channel/channel.requests";

type ControllerInputs = {
  channelService: ChannelService;
  channelRequestValidator: IChannelRequestValidator;
};

export class ChannelController {
  static instance: ChannelController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelController(inputs);
    return this.instance;
  };

  private channelRequestValidator: IChannelRequestValidator;
  private channelService: ChannelService;

  constructor({ channelRequestValidator, channelService }: ControllerInputs) {
    this.channelRequestValidator = channelRequestValidator;
    this.channelService = channelService;
  }

  getChannelListByQuery = async (req: RequestChannelGetListByQuery) => {
    try {
      const dto = this.channelRequestValidator.getChannelListByQuery(req);
      const data = await this.channelService.getChannelListByQuery(dto);

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

  getChannelById = async (req: RequestChannelGetById) => {
    try {
      const dto = this.channelRequestValidator.getChannelById(req);
      const data = await this.channelService.getChannelById(dto);

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

  updateChannelById = async (req: RequestChannelUpdateById) => {
    try {
      const dto = this.channelRequestValidator.updateChannelById(req);
      await this.channelService.updateChannelById(dto);

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
}
