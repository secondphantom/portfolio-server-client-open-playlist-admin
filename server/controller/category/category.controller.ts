import { CategoryService } from "@/server/application/service/category.service";
import { ICategoryRequestValidator } from "./category.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestCategoryCreate,
  RequestCategoryDeleteById,
  RequestCategoryGetById,
  RequestCategoryGetListByQuery,
  RequestCategoryUpdateById,
} from "@/server/spec/category/category.requests";

type ControllerInputs = {
  categoryService: CategoryService;
  categoryRequestValidator: ICategoryRequestValidator;
};

export class CategoryController {
  static instance: CategoryController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new CategoryController(inputs);
    return this.instance;
  };

  private categoryRequestValidator: ICategoryRequestValidator;
  private categoryService: CategoryService;

  constructor({ categoryRequestValidator, categoryService }: ControllerInputs) {
    this.categoryRequestValidator = categoryRequestValidator;
    this.categoryService = categoryService;
  }

  createCategory = async (req: RequestCategoryCreate) => {
    try {
      const dto = this.categoryRequestValidator.createCategory(req);
      await this.categoryService.createCategory(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Created",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getCategoryListByQuery = async (req: RequestCategoryGetListByQuery) => {
    try {
      const dto = this.categoryRequestValidator.getCategoryListByQuery(req);
      const data = await this.categoryService.getCategoryListByQuery(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  getCategoryById = async (req: RequestCategoryGetById) => {
    try {
      const dto = this.categoryRequestValidator.getCategoryById(req);
      const data = await this.categoryService.getCategoryById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          data,
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  updateCategoryById = async (req: RequestCategoryUpdateById) => {
    try {
      const dto = this.categoryRequestValidator.updateCategoryById(req);
      await this.categoryService.updateCategoryById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Updated",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };

  deleteCategoryById = async (req: RequestCategoryDeleteById) => {
    try {
      const dto = this.categoryRequestValidator.deleteCategoryById(req);
      await this.categoryService.deleteCategoryById(dto);

      return new ControllerResponse({
        code: 200,
        payload: {
          success: true,
          message: "Success Deleted",
        },
      });
    } catch (error) {
      const { code, message, data } = errorResolver(error);
      return new ControllerResponse({
        code,
        payload: {
          success: false,
          message,
          data,
        },
      });
    }
  };
}
