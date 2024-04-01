export type RequestAuthSignIn = {
  email: string;
};

export type RequestAuthVerifyOtp = {
  email: string;
  otpCode: string;
  data: {
    ip: string;
    device: any;
    userAgent: string;
  };
};

export type RequestAuthSignOut = {
  sessionKey: string;
};

export type RequestVerifySession = {
  sessionKey: string;
};
