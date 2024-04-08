import {
  ServiceChannelGetByIdDto,
  ServiceChannelGetListByQueryDto,
  ServiceChannelUpdateByIdDto,
} from "@/server/application/service/channel.service";
import {
  RequestChannelGetById,
  RequestChannelGetListByQuery,
  RequestChannelUpdateById,
} from "@/server/spec/channel/channel.requests";

export interface IChannelRequestValidator {
  getChannelListByQuery: (
    req: RequestChannelGetListByQuery
  ) => ServiceChannelGetListByQueryDto;
  getChannelById: (req: RequestChannelGetById) => ServiceChannelGetByIdDto;
  updateChannelById: (
    req: RequestChannelUpdateById
  ) => ServiceChannelUpdateByIdDto;
}
