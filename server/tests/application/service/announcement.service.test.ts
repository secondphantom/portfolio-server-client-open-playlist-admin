import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { IAnnouncementRepo } from "@/server/application/interfaces/announcement.repo";
import { AnnouncementService } from "@/server/application/service/announcement.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { AnnouncementRepo } from "@/server/infrastructure/repo/announcement.repo";
import { eq } from "drizzle-orm";

describe("announcement service", () => {
  let announcementRepo: IAnnouncementRepo;
  let announcementService: AnnouncementService;
  let FIRST_ANNOUNCEMENT_ID: number;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    announcementRepo = AnnouncementRepo.getInstance(dbClient);
    announcementService = AnnouncementService.getInstance({
      announcementRepo,
    });

    const announcement = await dbClient.getDb().query.announcements.findFirst();
    FIRST_ANNOUNCEMENT_ID = announcement!.id;
    await dbClient
      .getDb()
      .update(schema.announcements)
      .set({
        title: "",
      })
      .where(eq(schema.announcements.id, FIRST_ANNOUNCEMENT_ID));
  });

  describe("getAnnouncementListByQuery", () => {
    test("success", async () => {
      const result = await announcementService.getAnnouncementListByQuery({});

      for (const announcement of result.announcements) {
        expect(announcement).toEqual(
          expect.objectContaining({
            ...announcementSchemaExpect,
            admin: adminSchemaExpect,
          })
        );
      }
    });
  });

  describe("getAnnouncementById", () => {
    test("fail: not found", async () => {
      try {
        await announcementService.getAnnouncementById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const announcement = await announcementService.getAnnouncementById({
        id: FIRST_ANNOUNCEMENT_ID,
      });
      expect(announcement).toEqual(
        expect.objectContaining({
          ...announcementSchemaExpect,
          admin: adminSchemaExpect,
        })
      );
    });
  });

  describe("updateAnnouncementById", () => {
    test("fail: not found", async () => {
      try {
        await announcementService.updateAnnouncementById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await announcementService.updateAnnouncementById({
        id: FIRST_ANNOUNCEMENT_ID,
        title: "UPDATED",
      });

      const announcement = await announcementRepo.getById(
        FIRST_ANNOUNCEMENT_ID
      );

      expect(announcement?.title).toEqual("UPDATED");
    });
  });
});

const announcementSchemaExpect = {
  id: expect.any(Number),
  adminId: expect.any(Number),
  title: expect.any(String),
  content: expect.any(String),
  isDisplayedOn: expect.any(Boolean),
  displayStartDate: expect.any(Date),
  displayEndDate: expect.any(Date),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};

const adminSchemaExpect = {
  id: expect.any(Number),
  profileName: expect.any(String),
};
