/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // verbose: true,
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/test',
    // /^(?:(?!\.(spec|test)\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)).)*$/.source,
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};
