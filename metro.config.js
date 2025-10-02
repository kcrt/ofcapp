const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure for GitHub Pages deployment
config.transformer.publicPath = '/ofcapp/';

module.exports = config;
