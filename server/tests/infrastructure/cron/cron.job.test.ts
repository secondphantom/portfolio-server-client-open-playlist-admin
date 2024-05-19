import { CronJob } from "@/server/infrastructure/cron/cron.job";

describe("Cron Job", () => {
  let cronJob: CronJob;
  const TEST_ID = "test-schedule";

  beforeAll(() => {
    cronJob = CronJob.getInstance();
  });

  const delay = async (timeout: number) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(null);
      }, timeout);
    });
  };

  test("register", async () => {
    const logSpy = jest.spyOn(global.console, "log");

    cronJob.register(TEST_ID, () => console.log(1), {
      interval: 1,
      startAt: new Date(),
    });

    await delay(2500);

    expect(logSpy).toHaveBeenCalledTimes(2);

    logSpy.mockRestore();
  }, 30000);

  test("deleteById", async () => {
    cronJob.deleteById(TEST_ID);

    const result = cronJob.getById(TEST_ID);

    expect(result).toEqual(undefined);
  });
});
