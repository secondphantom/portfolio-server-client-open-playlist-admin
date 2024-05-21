import dotenv from "dotenv";
dotenv.config();
import * as dateMath from "date-arithmetic";
import { faker } from "@faker-js/faker";

import * as schema from "../../schema/schema";
import { DrizzleClient } from "../../infrastructure/db/drizzle.client";

// node --stack-size=1024 -r ts-node/register C:\Project\project_item\open_playlist\admin\server\scripts\seeding\enroll.ts
const getData = () => {
  const data: (typeof schema.enrolls.$inferInsert)[] = [];
  for (const index of Array.from({ length: 10000 }, (_, index) => index)) {
    data.push({
      userId: faker.number.int({ min: 1, max: 100000 }),
      courseId: faker.number.int({ min: 1, max: 100000 }),
      version: 1,
      chapterProgress: {},
      recentProgress: {} as any,
      totalProgress: 0,
      updatedAt: faker.date.recent({ days: 100 }),
      videoId: faker.string.sample(5),
    });
  }
  return data;
};

const run = async () => {
  const dbClient = DrizzleClient.getInstance({
    DATABASE_URL: process.env.DATABASE_URL!,
    LOG_LEVEL: "verbose",
  });

  const db = dbClient.getDb();
  const data = getData();

  await db.insert(schema.enrolls).values(data);
};

for (const _ of Array.from({ length: 10 })) {
  run()
    .then(() => console.log("success"))
    .catch(() => console.log("fail"));
}
