import dotenv from "dotenv";
dotenv.config();
import * as dateMath from "date-arithmetic";
import { faker } from "@faker-js/faker";

import * as schema from "../../schema/schema";
import { DrizzleClient } from "../../infrastructure/db/drizzle.client";

// node --stack-size=1024 -r ts-node/register C:\Project\project_item\open_playlist\admin\server\scripts\seeding\course.ts

const channelId = "UC8butISFwT-Wl7EV0hUK0BQ";
const getData = () => {
  const data: (typeof schema.courses.$inferInsert)[] = [];
  for (const index of Array.from({ length: 1000 }, (_, index) => index)) {
    data.push({
      videoId: faker.string.sample(10),
      channelId,
      categoryId: 1,
      language: "en",
      title: faker.lorem.sentence(5),
      description: faker.lorem.paragraph(),
      summary: null,
      chapters: [],
      duration: 0,
      extra: {},
      publishedAt: faker.date.recent({ days: 100 }),
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

  await db.insert(schema.courses).values(data);
};

for (const _ of Array.from({ length: 5 })) {
  run()
    .then(() => console.log("success"))
    // .catch(() => console.log("fail"));
    .catch(console.log);
}
