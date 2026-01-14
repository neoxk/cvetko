const nativeModules = require('react-native/jest/mocks/NativeModules');

const resolvedModules = nativeModules.default ?? nativeModules;

module.exports = {
  ...resolvedModules,
  UIManager: resolvedModules.UIManager ?? {},
  NativeUnimoduleProxy: resolvedModules.NativeUnimoduleProxy ?? { viewManagersMetadata: {} },
};
