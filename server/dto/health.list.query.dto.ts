import { QueryHealthListDto } from "../application/interfaces/health.repo";
import { ServiceHealthGetListByQueryDto } from "../application/service/health.service";

export class HealthListQueryDto {
  private page: number;
  private version: number;
  private order: "recent" | "old";
  private pageSize: number;

  constructor({
    page,
    version,
    order,
    pageSize,
  }: ServiceHealthGetListByQueryDto & { pageSize?: number }) {
    this.page = page === undefined || page < 0 ? 1 : page;
    this.version = version === undefined ? 1 : version;
    this.order = order ? order : "recent";
    this.pageSize = pageSize ? pageSize : 10;
  }

  getRepoQueryDto = (): QueryHealthListDto => {
    return {
      page: this.page,
      version: this.version,
      order: this.order,
      pageSize: this.pageSize,
    };
  };
}
