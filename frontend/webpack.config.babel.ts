import path from 'path';
import {getModules} from './buildscripts/webpack/modules';
import {getPlugins} from './buildscripts/webpack/plugins';
module.exports = {

  // webpack will take the files from ./src/index
  entry: {
    index: ['./src/index.tsx', './src/styles/index.scss'],
  },

  // and output it into /dist as index.js
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
  },

  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  plugins: getPlugins(),

  module: getModules(),
};
