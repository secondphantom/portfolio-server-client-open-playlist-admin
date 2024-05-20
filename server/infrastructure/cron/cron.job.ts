import { ICronJob } from "@/server/application/interfaces/cron.jobs";
import cronIntervalRange from "cron-interval-range";

export class CronJob implements ICronJob {
  static instance: CronJob | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CronJob();
    return this.instance;
  };

  private jobs = new Map<
    string,
    ReturnType<typeof cronIntervalRange.createSchedule>
  >();

  constructor() {}

  register = (
    id: string,
    fn: (...args: any[]) => any,
    options: {
      interval: number;
      startAt?: Date;
    }
  ) => {
    if (this.jobs.get(id)) {
      throw new Error("Id is duplicated");
    }

    const scheduledTasks = cronIntervalRange.createSchedule(
      {
        sec: options.interval,
      },
      fn,
      {
        scheduleOptions: {
          scheduled: true,
        },
      }
    );

    this.jobs.set(id, scheduledTasks);
  };

  deleteById = (id: string) => {
    if (!this.jobs.get(id)) {
      return;
    }

    const scheduledTasks = this.jobs.get(id)!;

    scheduledTasks.forEach((task) => task.stop());

    this.jobs.delete(id);
  };

  getById = (id: string) => {
    return this.jobs.get(id);
  };
}
