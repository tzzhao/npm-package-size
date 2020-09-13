import path from 'path';
import {getModules} from './buildscripts/webpack/modules';
import {getPlugins} from './buildscripts/webpack/plugins';
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env: any) => {
  return {
    devtool: env.DEVTOOL || 'eval-source-map',
    // webpack will take the files from ./src/index
    entry: {
      index: ['./src/index.tsx', './src/styles/index.scss'],
    },

    // and output it into /dist as index.js
    output: {
      path: path.join(__dirname, env && env.outputDir || '/dist'),
      filename: '[name].js',
      chunkFilename: '[name].chunk.js'
    },

    // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js'],
    },

    plugins: getPlugins(),

    module: getModules(),

    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    }
  }
};
