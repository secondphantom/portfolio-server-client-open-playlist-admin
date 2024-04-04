import dotenv from "dotenv";
dotenv.config();
import * as dateMath from "date-arithmetic";
import { faker } from "@faker-js/faker";

import * as schema from "../../schema/schema";
import { DrizzleClient } from "../../infrastructure/db/drizzle.client";

// node --stack-size=2048 -r ts-node/register C:\Project\project_item\open_playlist\admin\server\scripts\seeding\user.ts
const getData = () => {
  const data: (typeof schema.users.$inferInsert)[] = [];
  for (const index of Array.from({ length: 5000 }, (_, index) => index)) {
    const createdAt = faker.date.recent({ days: 100 });
    data.push({
      email: `${faker.number.int({
        min: 1,
        max: 1000,
      })}${faker.internet.exampleEmail()}`,
      extra: {} as any,
      hashKey: "",
      profileName: "",
      uuid: faker.string.uuid(),
      createdAt,
      updatedAt: createdAt,
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

  await db.insert(schema.users).values(data);
};

for (const _ of Array.from({ length: 10 })) {
  run()
    .then(() => console.log("success"))
    .catch(console.log);
  // .catch(() => console.log("fail"));
}
