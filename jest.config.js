export default {
  testEnvironment: 'node',
  transform: {},
  // Remove extensionsToTreatAsEsm since .js is inferred
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  verbose: true,
};
