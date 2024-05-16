export interface ICronJobs {
  register: (
    id: number,
    fn: (...args: any[]) => Promise<any>,
    options: {
      interval: number;
      startAt: Date;
    }
  ) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
  getById: (id: number) => Promise<any>;
}
