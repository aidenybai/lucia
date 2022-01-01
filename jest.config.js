module.exports = {
  collectCoverage: true,
  maxWorkers: '50%',
  testEnvironment: 'jsdom',
  transform: {
    '.(ts)': 'ts-jest',
  },
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/core/$1',
    '@directives/(.*)': '<rootDir>/src/core/directives/$1',
    '@utils/(.*)': '<rootDir>/src/core/utils/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
  },
};
