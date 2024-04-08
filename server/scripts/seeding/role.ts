import dotenv from "dotenv";
dotenv.config();
import * as dateMath from "date-arithmetic";
import { faker } from "@faker-js/faker";

import * as schema from "../../schema/schema";
import { DrizzleClient } from "../../infrastructure/db/drizzle.client";

// node --stack-size=1024 -r ts-node/register C:\Project\project_item\open_playlist\admin\server\scripts\seeding\role.ts

const getData = () => {
  const data: (typeof schema.roles.$inferInsert)[] = [];
  for (const index of Array.from({ length: 10 }, (_, index) => index)) {
    data.push({
      id: index,
      name: faker.person.jobTitle(),
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

  await db.insert(schema.roles).values(data);
};

for (const _ of Array.from({ length: 1 })) {
  run()
    .then(() => console.log("success"))
    // .catch(() => console.log("fail"));
    .catch(console.log);
}
