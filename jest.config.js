/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["<rootDir>/test"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["dotenv/config"],
};
