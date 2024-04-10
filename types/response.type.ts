export type ResponseBody<T> = {
  success: boolean;
  message: string;
  data: T;
};
