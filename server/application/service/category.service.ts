import { ServerError } from "@/server/dto/error";
import { ICategoryRepo } from "../interfaces/category.repo";

export type ServiceCategoryCreateDto = {
  id: number;
  name: string;
  parentId: number;
};

export type ServiceCategoryGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  id?: number;
  parentId?: number;
};

export type ServiceCategoryGetByIdDto = {
  id: number;
};

export type ServiceCategoryUpdateByIdDto = {
  id: number;
  name?: string;
  parentId?: number;
};

export type ServiceCategoryDeleteByIdDto = {
  id: number;
};

type ServiceInputs = {
  categoryRepo: ICategoryRepo;
};

export class CategoryService {
  static instance: CategoryService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new CategoryService(inputs);
    return this.instance;
  };

  private categoryRepo: ICategoryRepo;

  constructor({ categoryRepo }: ServiceInputs) {
    this.categoryRepo = categoryRepo;
  }

  // POST /categories
  createCategory = async (dto: ServiceCategoryCreateDto) => {
    const category = await this.categoryRepo.getById(dto.id);
    if (category) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }
    await this.categoryRepo.create(dto);
  };

  // GET /categories?
  getCategoryListByQuery = async ({
    page,
    order,
    id,
    parentId,
  }: ServiceCategoryGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const categories = await this.categoryRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      id,
      parentId,
    });

    if (categories.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          categories: [],
          pagination,
        },
      });
    }

    return {
      categories,
      pagination,
    };
  };

  // GET /categories/:id
  getCategoryById = async (dto: ServiceCategoryGetByIdDto) => {
    const category = await this.categoryRepo.getById(dto.id);
    if (!category) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return category;
  };

  // PATCH /categories/:id
  updateCategoryById = async (dto: ServiceCategoryUpdateByIdDto) => {
    const category = await this.categoryRepo.getById(dto.id, {
      id: true,
    });

    if (!category) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.categoryRepo.updateById(dto.id, {
      ...dto,
    });
  };

  // DELETE /categories/:id
  deleteCategoryById = async (dto: ServiceCategoryDeleteByIdDto) => {
    await this.categoryRepo.deleteById(dto.id);
  };
}
