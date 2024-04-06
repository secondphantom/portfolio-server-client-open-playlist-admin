import { ServerError } from "@/server/dto/error";
import { IUserRepo } from "../interfaces/user.repo";

export type ServiceUserGetByIdDto = {
  id: number;
};

export type ServiceUserUpdateByIdDto = {
  id: number;
  isEmailVerified?: boolean;
  profileImage?: string;
  profileName?: string;
  roleId?: number;
};

export type ServiceUserGetListByQueryDto = {
  order: "recent" | "old";
  page?: number;
  roleId?: number;
  email?: string;
};

type ServiceInputs = {
  userRepo: IUserRepo;
};

export class UserService {
  static instance: UserService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserService(inputs);
    return this.instance;
  };

  private userRepo: IUserRepo;

  constructor({ userRepo }: ServiceInputs) {
    this.userRepo = userRepo;
  }

  //GET /users/:id
  getUserById = async (dto: ServiceUserGetByIdDto) => {
    const user = await this.userRepo.getUserByIdWith(dto.id, {
      user: {
        id: true,
        email: true,
        isEmailVerified: true,
        profileImage: true,
        profileName: true,
        roleId: true,
        updatedAt: true,
        createdAt: true,
      },
      credit: {
        freeCredits: true,
        purchasedCredits: true,
        freeCreditUpdatedAt: true,
        purchasedCreditUpdatedAt: true,
      },
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    return user;
  };

  //PATCH /users/:id
  updateUserById = async (dto: ServiceUserUpdateByIdDto) => {
    const user = await this.userRepo.getUserById(dto.id, {
      id: true,
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }

    const { isEmailVerified, profileImage, profileName, roleId } = dto;

    await this.userRepo.updateUserById(dto.id, {
      isEmailVerified,
      profileImage,
      profileName,
      roleId,
    });
  };

  //GET /users?
  getUserListByQuery = async ({
    page,
    order,
    roleId,
    email,
  }: ServiceUserGetListByQueryDto) => {
    const pagination = {
      currentPage: page === undefined ? 1 : page,
      pageSize: 10,
    };

    const users = await this.userRepo.getListByQuery({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      order: order ? order : "recent",
      roleId,
      email,
    });

    if (users.length === 0) {
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
      users,
      pagination,
    };
  };
}
