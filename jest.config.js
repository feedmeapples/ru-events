/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
process.env.TZ = 'UTC';

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  timers: "fake",
};
