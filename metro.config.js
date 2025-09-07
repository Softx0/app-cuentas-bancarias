/**
 * Metro configuration for React Native
 * Complete SVG support with react-native-svg-transformer
 * @format
 */

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// SVG transformer configuration
const { transformer, resolver } = config;

// Configure SVG support
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = config;
