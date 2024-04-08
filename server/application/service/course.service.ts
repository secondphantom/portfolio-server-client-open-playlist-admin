import { ServerError } from "@/server/dto/error";
import { ICourseRepo } from "../interfaces/course.repo";
import { CourseChapter } from "@/server/schema/schema";

export type ServiceCourseGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  id?: number;
  videoId?: string;
  channelId?: string;
};

export type ServiceCourseGetByIdDto = {
  id: number;
};

export type ServiceCourserUpdateByIdDto = {
  id: number;
  version?: number;
  categoryId?: number;
  language?: string;
  title?: string;
  description?: string;
  summary?: string;
  chapters?: CourseChapter[];
  enrollCount?: number;
  generatedAi?: boolean;
};

type ServiceInputs = {
  courseRepo: ICourseRepo;
};

export class CourseService {
  static instance: CourseService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new CourseService(inputs);
    return this.instance;
  };

  private courseRepo: ICourseRepo;

  constructor({ courseRepo }: ServiceInputs) {
    this.courseRepo = courseRepo;
  }

  // GET /courses?
  getCourseListByQuery = async ({
    page,
    order,
    channelId,
    id,
    videoId,
  }: ServiceCourseGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const courses = await this.courseRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      id,
      videoId,
      channelId,
    });

    if (courses.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          sessions: [],
          pagination,
        },
      });
    }

    return {
      courses,
      pagination,
    };
  };

  // GET /courses/:id
  getCourseById = async (dto: ServiceCourseGetByIdDto) => {
    const course = await this.courseRepo.getByIdWith(dto.id, {
      channel: {
        name: true,
        channelId: true,
      },
    });

    if (!course) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return course;
  };

  // PATCH /courses/:id
  updateCourseById = async (dto: ServiceCourserUpdateByIdDto) => {
    const course = await this.courseRepo.getById(dto.id, {
      id: true,
    });

    if (!course) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.courseRepo.updateById(dto.id, {
      ...dto,
    });
  };
}
