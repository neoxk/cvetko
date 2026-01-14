const jestPreset = require('jest-expo/jest-preset');

module.exports = {
  ...jestPreset,
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  setupFiles: ['<rootDir>/src/test/jestSetup.js', ...(jestPreset.setupFiles ?? [])],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts', ...(jestPreset.setupFilesAfterEnv ?? [])],
  moduleNameMapper: {
    ...(jestPreset.moduleNameMapper ?? {}),
    '^react-native/Libraries/BatchedBridge/NativeModules$':
      '<rootDir>/src/test/nativeModulesMock.js',
    '^expo-modules-core/src/Refs$': '<rootDir>/src/test/expoModulesCoreRefsMock.js',
    '^expo-modules-core/src/web/index\\.web$': '<rootDir>/src/test/expoModulesCoreWebMock.js',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
};
