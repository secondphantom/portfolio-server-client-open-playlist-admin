import { CourseService } from "@/server/application/service/course.service";
import { ICourseRequestValidator } from "./course.interface";
import { ControllerResponse } from "@/server/dto/response";
import { errorResolver } from "@/server/dto/error.resolver";
import {
  RequestCourseGetById,
  RequestCourseGetListByQuery,
  RequestCourserUpdateById,
} from "@/server/spec/course/course.requests";

type ControllerInputs = {
  courseService: CourseService;
  courseRequestValidator: ICourseRequestValidator;
};

export class CourseController {
  static instance: CourseController | undefined;
  static getInstance = (inputs: ControllerInputs) => {
    if (this.instance) return this.instance;
    this.instance = new CourseController(inputs);
    return this.instance;
  };

  private courseRequestValidator: ICourseRequestValidator;
  private courseService: CourseService;

  constructor({ courseRequestValidator, courseService }: ControllerInputs) {
    this.courseRequestValidator = courseRequestValidator;
    this.courseService = courseService;
  }

  getCourseListByQuery = async (req: RequestCourseGetListByQuery) => {
    try {
      const dto = this.courseRequestValidator.getCourseListByQuery(req);
      const data = await this.courseService.getCourseListByQuery(dto);

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

  getCourseById = async (req: RequestCourseGetById) => {
    try {
      const dto = this.courseRequestValidator.getCourseById(req);
      const data = await this.courseService.getCourseById(dto);

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

  updateCourseById = async (req: RequestCourserUpdateById) => {
    try {
      const dto = this.courseRequestValidator.updateCourseById(req);
      await this.courseService.updateCourseById(dto);

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
}
