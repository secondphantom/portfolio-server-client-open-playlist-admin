import * as schema from "../../schema/schema";
import {
  CategoryEntitySelect,
  ICategoryRepo,
  QueryCategoryListDto,
  CategoryEntityInsert,
} from "@/server/application/interfaces/category.repo";
import { Db, DrizzleClient } from "../db/drizzle.client";
import { asc, desc, eq } from "drizzle-orm";

export class CategoryRepo implements ICategoryRepo {
  static instance: CategoryRepo | undefined;
  static getInstance = (drizzleClient: DrizzleClient) => {
    if (this.instance) return this.instance;
    this.instance = new CategoryRepo(drizzleClient);
    return this.instance;
  };

  private db: Db;

  constructor(private drizzleClient: DrizzleClient) {
    this.db = drizzleClient.getDb();
  }

  create = async (dto: CategoryEntityInsert) => {
    await this.db.insert(schema.categories).values(dto);
  };

  getListByQuery = async ({
    order,
    page,
    id,
    pageSize,
    parentId,
  }: QueryCategoryListDto) => {
    const orderBy = ((order: string) => {
      switch (order) {
        case "recent":
          return [desc(schema.users.createdAt)];
        case "old":
          return [asc(schema.users.createdAt)];
        default:
          return [];
      }
    })(order);
    const categories = await this.db.query.categories.findMany({
      where: (value, { eq, and }) => {
        return and(
          ...[
            id ? eq(value.id, id) : undefined,
            parentId ? eq(value.parentId, parentId) : undefined,
          ].filter((v) => !!v)
        );
      },
      orderBy: orderBy,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return categories;
  };

  getById = async <T extends keyof CategoryEntitySelect>(
    id: number,
    columns?:
      | {
          [key in T]?: boolean;
        }
      | { [key in keyof CategoryEntitySelect]?: boolean }
  ) => {
    const category = this.db.query.categories.findFirst({
      where: (value, { eq }) => {
        return eq(value.id, id);
      },
      columns: columns
        ? (columns as { [key in keyof CategoryEntitySelect]: boolean })
        : undefined,
    });
    return category;
  };

  updateById = async (id: number, value: Partial<CategoryEntitySelect>) => {
    await this.db
      .update(schema.categories)
      .set(value)
      .where(eq(schema.categories.id, id));
  };

  deleteById = async (id: number) => {
    await this.db.delete(schema.categories).where(eq(schema.categories.id, id));
  };
}
