import {
  ServiceCourseGetByIdDto,
  ServiceCourseGetListByQueryDto,
  ServiceCourseUpdateByIdDto,
} from "@/server/application/service/course.service";
import {
  RequestCourseGetById,
  RequestCourseGetListByQuery,
  RequestCourseUpdateById,
} from "@/server/spec/course/course.requests";

export interface ICourseRequestValidator {
  getCourseListByQuery: (
    req: RequestCourseGetListByQuery
  ) => ServiceCourseGetListByQueryDto;
  getCourseById: (req: RequestCourseGetById) => ServiceCourseGetByIdDto;
  updateCourseById: (
    req: RequestCourseUpdateById
  ) => ServiceCourseUpdateByIdDto;
}
