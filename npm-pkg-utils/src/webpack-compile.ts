import * as path from 'path';
import webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const MemoryFS = require('memory-fs');
import {gzipSync} from 'zlib';
import {PackageExternalDependencies} from './interfaces/PackageExternalDependencies';
import {PackageInformation} from './interfaces/PackageInformation';
import {PackageError} from './models';
const builtInModules = require('builtin-modules');
const escapeRegex = require('escape-string-regexp');

/**
 * Compiles a minified bundle with webpack in memory. Gzip it with zlib. Then compute the resulting sizes.
 * @param packageName
 * @param packageVersion
 * @param buildPath
 * @param entryFilePath
 */
export async function compileAndGetSizes(packageName: string, packageVersion: string, buildPath: string, entryFilePath: string)
: Promise<PackageInformation> {
  // Prepare webpack builder
  const webpackBuilder = webpack(getWebpackConfig(packageName, buildPath, entryFilePath));
  const memoryFileSystem = new MemoryFS();
  webpackBuilder.outputFileSystem = memoryFileSystem;

  // Call webpack to bundle the package with minification
  const {err}: {err: Error} = await new Promise((resolve, reject) => {
    webpackBuilder.run((err: any) => {
      resolve({err});
    });
  });

  if (err) {
    throw new PackageError(err, packageName, packageVersion);
  }

  try {
    const bundlePath = path.join(process.cwd(), 'dist', 'bundle.js');
    const bundle = memoryFileSystem.readFileSync(bundlePath);
    const gzip = gzipSync(bundle);

    return {
      pkgName: packageName,
      pkgVersion: packageVersion,
      gzip: gzip.length,
      size: bundle.length}
  } catch (error) {
    throw new PackageError(error, packageName, packageVersion);
  }
}

/**
 * Generate the webpack config
 * @param packageName
 * @param buildPath
 * @param entryFilePath
 */
function getWebpackConfig(packageName: string, buildPath: string, entryFilePath: string): webpack.Configuration {
  const externals = getExternals(packageName, path.join(__dirname, '..', buildPath));
  const externalsRegex = makeExternalsRegex(externals.peerDependencies);
  const isExternalRequest = (request: string) => {
    const isPeerDep = externals.peerDependencies.length
        ? externalsRegex.test(request)
        : false;
    const isBuiltIn = externals.builtInDependencies.includes(request);
    return isPeerDep || isBuiltIn
  };

  return{
    entry: {main: entryFilePath},
    mode: 'production',
    optimization: {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'main',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin(),
      ]
    },
    plugins: [
      new MiniCssExtractPlugin()
    ],
    resolve: {
      modules: ['node_modules'],
      symlinks: false,
      cacheWithContext: false,
      extensions: [
        '.web.mjs',
        '.mjs',
        '.web.js',
        '.js',
        '.mjs',
        '.json',
        '.css',
        '.sass',
        '.scss',
      ],
      mainFields: ['browser', 'module', 'main', 'style'],
    },
    module: {
      noParse: [/\.min\.js$/],
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        // see https://github.com/apollographql/react-apollo/issues/1737
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: [],
        },
        {
          test: /\.js$/,
          use: ['shebang-loader'], // support CLI tools that start with a #!/usr/bin/node
        },
        {
          test: /\.(scss|sass)$/,
          loader: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      'last 5 Chrome versions',
                      'last 5 Firefox versions',
                      'Safari >= 8',
                      'Explorer >= 10',
                      'edge >= 12',
                    ],
                  }),
                ],
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg|png|jpeg|jpg|gif|webp)$/,
          loader: 'file-loader',
          query: {
            emitFile: true,
          },
        },
      ],
    },
    output: {
      filename: 'bundle.js',
      pathinfo: false,
    },
    externals: (context, request, callback) =>
        isExternalRequest(request)
            ? callback(null, 'commonjs ' + request)
            : callback()
  };
}

/**
 * Compute peer dependencies and dependencies provided by the environment to later exclude them from the webpack build
 * @param packageName
 * @param installPath
 */
function getExternals(packageName: string, installPath: string): PackageExternalDependencies {
  const packageJSONPath = path.join(
      installPath,
      'node_modules',
      packageName,
      'package.json'
  );
  const packageJSON = require(packageJSONPath);
  const dependencies = Object.keys(packageJSON.dependencies || {});
  const peerDependencies = Object.keys(packageJSON.peerDependencies || {});

  // All packages with name same as a built-in node module, but
  // haven't explicitly been added as an npm dependency are externals
  const builtInDependencies = builtInModules.filter(
      (mod: string) => !dependencies.includes(mod)
  );
  return {
    peerDependencies,
    builtInDependencies,
  }
}

function makeExternalsRegex(externals: string[]) {
  let externalsRegex = externals
      .map(dep => `^${escapeRegex(dep)}$|^${escapeRegex(dep)}\\/`)
      .join('|');

  externalsRegex = `(${externalsRegex})`;

  return new RegExp(externalsRegex)
}
