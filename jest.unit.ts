import type { Config } from "@jest/types";

process.env.TZ = "UTC";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  timers: "fake",
  testRegex: "./src/.*\\.test\\.ts$",
};

export default config;
