export interface IUserRepo {
  getTotalUserByPeriod: (period: {
    gte?: Date;
    lte?: Date;
    gt?: Date;
    lt?: Date;
  }) => Promise<number>;
}
