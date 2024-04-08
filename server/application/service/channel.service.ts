import { ServerError } from "@/server/dto/error";
import { IChannelRepo } from "../interfaces/channel.repo";

export type ServiceChannelGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  channelId?: string;
};

export type ServiceChannelGetByIdDto = {
  channelId: string;
};

export type ServiceChannelUpdateByIdDto = {
  channelId: string;
  name?: string;
  handle?: string;
  enrollCount?: number;
};

type ServiceInputs = {
  channelRepo: IChannelRepo;
};

export class ChannelService {
  static instance: ChannelService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new ChannelService(inputs);
    return this.instance;
  };

  private channelRepo: IChannelRepo;

  constructor({ channelRepo }: ServiceInputs) {
    this.channelRepo = channelRepo;
  }

  // GET /channels?
  getChannelListByQuery = async ({
    page,
    order,
    channelId,
  }: ServiceChannelGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const channels = await this.channelRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      channelId,
    });

    if (channels.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          sessions: [],
          pagination,
        },
      });
    }

    return {
      channels,
      pagination,
    };
  };

  // GET /channels/:id
  getChannelById = async (dto: ServiceChannelGetByIdDto) => {
    const channel = await this.channelRepo.getById(dto.channelId);

    if (!channel) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return channel;
  };

  // PATCH /channels/:id
  updateChannelById = async (dto: ServiceChannelUpdateByIdDto) => {
    const channel = await this.channelRepo.getById(dto.channelId, {
      channelId: true,
    });

    if (!channel) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.channelRepo.updateById(dto.channelId, {
      ...dto,
      channelId: undefined,
    });
  };
}
