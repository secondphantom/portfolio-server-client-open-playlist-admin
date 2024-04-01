export type ResponseAuthVerifySession = {
  id: number;
  sessionKey: string;
  admin: {
    id: number;
    roleId: number;
  };
};
