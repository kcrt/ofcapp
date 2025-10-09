const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Deployed at `https://ofcapp.kcrt.net/`
config.transformer.publicPath = '/';

module.exports = config;
