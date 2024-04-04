import dotenv from "dotenv";
dotenv.config();
import * as dateMath from "date-arithmetic";
import { faker } from "@faker-js/faker";

import * as schema from "../../schema/schema";
import { DrizzleClient } from "../../infrastructure/db/drizzle.client";

// node --stack-size=2048 -r ts-node/register C:\Project\project_item\open_playlist\admin\server\scripts\seeding\user.stat.ts
const getData = () => {
  const data: (typeof schema.userStats.$inferInsert)[] = [];
  const nowDate = new Date().setUTCHours(0, 0, 0, 0);
  for (const index of Array.from({ length: 100 }, (_, index) => index)) {
    const eventAt = dateMath.add(nowDate as any, -index, "day");
    data.push({
      eventAt,
      version: 1,
      data: {
        dau: faker.number.int({ max: 1000 }),
        mau: faker.number.int({ max: 1000 }),
        total: faker.number.int({ max: 1000 }),
        wau: faker.number.int({ max: 1000 }),
      },
    });
  }
  return data;
};

const run = async () => {
  const dbClient = DrizzleClient.getInstance({
    DATABASE_URL: process.env.DATABASE_URL!,
    LOG_LEVEL: "dev",
  });

  const db = dbClient.getDb();
  const data = getData();

  await db.insert(schema.userStats).values(data);
};

for (const _ of Array.from({ length: 1 })) {
  run()
    .then(() => console.log("success"))
    .catch(console.log);
  // .catch(() => console.log("fail"));
}
