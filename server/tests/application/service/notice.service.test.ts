import dotenv from "dotenv";
dotenv.config();

import * as schema from "@/server/schema/schema";
import { INoticeRepo } from "@/server/application/interfaces/notice.repo";
import { NoticeService } from "@/server/application/service/notice.service";
import { DrizzleClient } from "@/server/infrastructure/db/drizzle.client";
import { NoticeRepo } from "@/server/infrastructure/repo/notice.repo";
import { eq } from "drizzle-orm";

describe("notice service", () => {
  let noticeRepo: INoticeRepo;
  let noticeService: NoticeService;
  let FIRST_NOTICE_ID: number;

  beforeAll(async () => {
    const dbClient = DrizzleClient.getInstance({
      DATABASE_URL: process.env.DATABASE_URL!,
      LOG_LEVEL: "dev",
    });
    noticeRepo = NoticeRepo.getInstance(dbClient);
    noticeService = NoticeService.getInstance({
      noticeRepo,
    });

    const notice = await dbClient.getDb().query.notices.findFirst();
    FIRST_NOTICE_ID = notice!.id;
    await dbClient
      .getDb()
      .update(schema.notices)
      .set({
        title: "",
      })
      .where(eq(schema.notices.id, FIRST_NOTICE_ID));
  });

  describe("getNoticeListByQuery", () => {
    test("success", async () => {
      const result = await noticeService.getNoticeListByQuery({});

      for (const notice of result.notices) {
        expect(notice).toEqual(
          expect.objectContaining({
            ...noticeSchemaExpect,
            admin: adminSchemaExpect,
          })
        );
      }
    });
  });

  describe("getNoticeById", () => {
    test("fail: not found", async () => {
      try {
        await noticeService.getNoticeById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });
    test("success", async () => {
      const notice = await noticeService.getNoticeById({
        id: FIRST_NOTICE_ID,
      });
      expect(notice).toEqual(
        expect.objectContaining({
          ...noticeSchemaExpect,
          admin: adminSchemaExpect,
        })
      );
    });
  });

  describe("updateNoticeById", () => {
    test("fail: not found", async () => {
      try {
        await noticeService.updateNoticeById({
          id: -1,
        });
      } catch (error: any) {
        expect(error.message).toBe("Not Found");
      }
    });

    test("success", async () => {
      await noticeService.updateNoticeById({
        id: FIRST_NOTICE_ID,
        title: "UPDATED",
      });

      const notice = await noticeRepo.getById(FIRST_NOTICE_ID);

      expect(notice?.title).toEqual("UPDATED");
    });
  });
});

const noticeSchemaExpect = {
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
