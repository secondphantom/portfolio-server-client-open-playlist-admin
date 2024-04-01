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
  sessionId: string;
};

export type RequestVerifySession = {
  sessionId: string;
};
