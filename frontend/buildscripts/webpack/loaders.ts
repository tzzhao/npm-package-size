const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export function getBabelLoader() {
  // we use babel-loader to load our jsx and tsx files
  return {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  }
}

export function getCssLoaders() {
  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      // add css into the style tag of the document
      'style-loader',
      // create 1 css file per js file which contains css
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development'
        }
      },
      'css-loader',
      // Compiles scss to css
      'sass-loader',
    ]
  }
}
