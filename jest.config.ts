module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",       // Matches tests in __tests__ folders
    "**/?(*.)+(spec|test).[tj]s?(x)"     // Matches .spec or .test files in any directory
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
