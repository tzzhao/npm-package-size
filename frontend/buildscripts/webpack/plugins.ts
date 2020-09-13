import HtmlWebpackPlugin from 'html-webpack-plugin';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import {Plugin} from 'webpack';

export function getPlugins() {
  const plugins: Plugin[] = [];
  plugins.push(new HtmlWebpackPlugin({
    template: './src/index.html',
  }));
  plugins.push(new MiniCssExtractPlugin({
    filename: '[name].css',
  }));
  return plugins;
}
