export interface ICronJob {
  register: (
    id: string,
    fn: (...args: any[]) => any,
    options: {
      interval: number;
      startAt?: Date;
    }
  ) => void;
  deleteById: (id: string) => void;
  getById: (id: string) => any;
}
