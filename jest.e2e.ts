import type { Config } from "@jest/types";

process.env.TZ = "UTC";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 20000,
  timers: "fake",
  testRegex: "./src/.*\\.e2e\\.ts$",
};

export default config;
