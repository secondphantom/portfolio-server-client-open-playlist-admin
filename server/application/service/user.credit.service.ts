import { ServerError } from "@/server/dto/error";
import { IUserCreditRepo } from "../interfaces/user.credit.repo";
import { IUserRepo } from "../interfaces/user.repo";

export type ServiceUserCreditUpdateDto = {
  userId: number;
  credit: {
    freeCredits?: number;
    purchasedCredits?: number;
  };
};

type ServiceInputs = {
  userRepo: IUserRepo;
  userCreditRepo: IUserCreditRepo;
};

export class UserCreditService {
  static instance: UserCreditService | undefined;
  static getInstance = (inputs: ServiceInputs) => {
    if (this.instance) return this.instance;
    this.instance = new UserCreditService(inputs);
    return this.instance;
  };

  private userRepo: IUserRepo;
  private userCreditRepo: IUserCreditRepo;

  constructor({ userRepo, userCreditRepo }: ServiceInputs) {
    this.userRepo = userRepo;
    this.userCreditRepo = userCreditRepo;
  }

  //PATCH /users/:id/credit
  updateUserCredit = async (dto: ServiceUserCreditUpdateDto) => {
    const user = await this.userRepo.getUserById(dto.userId, { id: true });
    if (!user) {
      throw new ServerError({
        code: 404,
        message: "Not Found",
      });
    }
    await this.userCreditRepo.updateByUserId(dto.userId, dto.credit);
  };
}
