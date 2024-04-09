import {
  ServiceCategoryCreateDto,
  ServiceCategoryDeleteByIdDto,
  ServiceCategoryGetByIdDto,
  ServiceCategoryGetListByQueryDto,
  ServiceCategoryUpdateByIdDto,
} from "@/server/application/service/category.service";
import {
  RequestCategoryCreate,
  RequestCategoryDeleteById,
  RequestCategoryGetById,
  RequestCategoryGetListByQuery,
  RequestCategoryUpdateById,
} from "@/server/spec/category/category.requests";

export interface ICategoryRequestValidator {
  createCategory: (req: RequestCategoryCreate) => ServiceCategoryCreateDto;
  getCategoryListByQuery: (
    req: RequestCategoryGetListByQuery
  ) => ServiceCategoryGetListByQueryDto;
  getCategoryById: (req: RequestCategoryGetById) => ServiceCategoryGetByIdDto;
  updateCategoryById: (
    req: RequestCategoryUpdateById
  ) => ServiceCategoryUpdateByIdDto;
  deleteCategoryById: (
    req: RequestCategoryDeleteById
  ) => ServiceCategoryDeleteByIdDto;
}
