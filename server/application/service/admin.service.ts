import { ServerError } from "@/server/dto/error";
import { IAdminRepo } from "../interfaces/admin.repo";

type ServiceInputs = {
  adminRepo: IAdminRepo;
};

export type ServiceAdminCreateDto = {
  email: string;
  profileName?: string;
};

export type ServiceAdminGetListByQueryDto = {
  page?: number;
  order?: "recent" | "old";
  roleId?: number;
  email?: string;
};

export type ServiceAdminGetByIdDto = {
  id: number;
};

export type ServiceAdminDeleteByIdDto = {
  id: number;
};

export type ServiceAdminUpdateByIdDto = {
  id: number;
  email?: string;
  roleId?: number;
  profileName?: string;
  profileImage?: string;
};

export class AdminService {
  static instance: AdminService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new AdminService(inputs);
    return this.instance;
  };

  private adminRepo: IAdminRepo;

  constructor({ adminRepo }: ServiceInputs) {
    this.adminRepo = adminRepo;
  }

  // POST /admins?
  createAdmin = async (dto: ServiceAdminCreateDto) => {
    const admin = await this.adminRepo.getByEmail(dto.email, { id: true });

    if (admin) {
      throw new ServerError({
        code: 409,
        message: "Conflict",
      });
    }

    await this.adminRepo.create({
      email: dto.email,
      profileName: dto.profileName ? dto.profileName : "New Admin",
    });
  };

  // GET /admins?
  getAdminListByQuery = async ({
    page,
    order,
    email,
    roleId,
  }: ServiceAdminGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const admins = await this.adminRepo.getListByQuery({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      order: order ? order : "recent",
      email,
      roleId,
    });

    if (admins.length === 0) {
      throw new ServerError({
        code: 200,
        message: "Empty",
        data: {
          admins: [],
          pagination,
        },
      });
    }

    return {
      admins,
      pagination,
    };
  };

  // GET /admins/:id
  getAdminById = async (dto: ServiceAdminGetByIdDto) => {
    const admin = await this.adminRepo.getById(dto.id, {
      id: true,
      email: true,
      roleId: true,
      profileName: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!admin) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return admin;
  };

  // DELETE /admins/:id
  deleteAdminById = async (dto: ServiceAdminDeleteByIdDto) => {
    await this.adminRepo.deleteById(dto.id);
  };

  // PATCH /admins/:id
  updateAdminById = async (dto: ServiceAdminUpdateByIdDto) => {
    const admin = await this.adminRepo.getById(dto.id, { id: true });

    if (!admin) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    await this.adminRepo.updateById(dto.id, { ...dto, id: undefined });
  };
}
