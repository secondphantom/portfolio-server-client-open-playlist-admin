import { ServerError } from "@/server/dto/error";
import { IRoleRepo } from "../interfaces/role.repo";

export type ServiceRoleCreateDto = {
  id: number;
  name: string;
};

export type ServiceRoleGetListByQueryDto = {
  order?: "recent" | "old";
  page?: number;
  id?: number;
};

export type ServiceRoleGetByIdDto = {
  id: number;
};

export type ServiceRoleUpdateByIdDto = {
  id: number;
  name?: string;
};

export type ServiceRoleDeleteByIdDto = {
  id: number;
};

type ServiceInputs = {
  roleRepo: IRoleRepo;
};

export class RoleService {
  static instance: RoleService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new RoleService(inputs);
    return this.instance;
  };

  private roleRepo: IRoleRepo;

  constructor({ roleRepo }: ServiceInputs) {
    this.roleRepo = roleRepo;
  }

  // POST /roles
  createRole = async (dto: ServiceRoleCreateDto) => {
    const role = await this.roleRepo.getById(dto.id);
    if (role) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }
    await this.roleRepo.create(dto);
  };

  // GET /roles?
  getRoleListByQuery = async ({
    page,
    order,
    id,
  }: ServiceRoleGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };
    const roles = await this.roleRepo.getListByQuery({
      order: order ? order : "recent",
      page: pagination.currentPage,
      pageSize: 10,
      id,
    });

    if (roles.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          roles: [],
          pagination,
        },
      });
    }

    return {
      roles,
      pagination,
    };
  };

  // GET /roles/:id
  getRoleById = async (dto: ServiceRoleGetByIdDto) => {
    const role = await this.roleRepo.getById(dto.id);
    if (!role) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return role;
  };

  // PATCH /roles/:id
  updateRoleById = async (dto: ServiceRoleUpdateByIdDto) => {
    const role = await this.roleRepo.getById(dto.id, {
      id: true,
    });

    if (!role) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.roleRepo.updateById(dto.id, {
      ...dto,
    });
  };

  // DELETE /role/:id
  deleteRoleById = async (dto: ServiceRoleDeleteByIdDto) => {
    await this.roleRepo.deleteById(dto.id);
  };
}
