export interface IEnrollRepo {
  getActiveUserByPeriod: (period: {
    gte?: Date;
    lte?: Date;
    gt?: Date;
    lt?: Date;
  }) => Promise<number>;
}
