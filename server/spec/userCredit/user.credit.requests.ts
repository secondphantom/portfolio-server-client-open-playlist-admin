export type RequestUserCreditUpdate = {
  userId: number;
  credit: {
    freeCredits?: number;
    purchasedCredits?: number;
  };
};
