export type ENV = typeof env;

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  LOG_LEVEL: "verbose",
};
