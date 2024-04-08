import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { IChannelRepo } from "@/server/application/interfaces/channel.repo";
import { ChannelService } from "@/server/application/service/channel.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { ChannelRepo } from "@/server/infrastructure/repo/channel.repo";

describe("channel service", () => {
  let channelRepo: IChannelRepo;
  let channelService: ChannelService;
  let FIRST_CHANNEL_ID: string;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    channelRepo = ChannelRepo.getInstance(dbClient);
    channelService = ChannelService.getInstance({
      channelRepo,
    });

    const channel = await dbClient.getDb().query.channels.findFirst();
    FIRST_CHANNEL_ID = channel!.channelId;
    await dbClient.getDb().update(schema.channels).set({
      name: "",
    });
  });

  describe("getChannelListByQuery", () => {
    test("success", async () => {
      const result = await channelService.getChannelListByQuery({});

      for (const channel of result.channels) {
        expect(channel).toEqual(
          expect.objectContaining({
            ...channelSchemaExpect,
          })
        );
      }
    });
  });

  describe("getChannelById", () => {
    test("fail: not found", async () => {
      try {
        await channelService.getChannelById({
          channelId: "",
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const channel = await channelService.getChannelById({
        channelId: FIRST_CHANNEL_ID,
      });
      expect(channel).toEqual(
        expect.objectContaining({
          ...channelSchemaExpect,
        })
      );
    });
  });

  describe("updateChannelById", () => {
    test("fail: not found", async () => {
      try {
        await channelService.updateChannelById({
          channelId: "",
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await channelService.updateChannelById({
        channelId: FIRST_CHANNEL_ID,
        name: "UPDATED",
      });

      const channel = await channelRepo.getById(FIRST_CHANNEL_ID);

      expect(channel?.name).toEqual("UPDATED");
    });
  });
});

const channelSchemaExpect = {
  channelId: expect.any(String),
  name: expect.any(String),
  handle: expect.any(String),
  enrollCount: expect.any(Number),
  extra: expect.any(Object),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};
