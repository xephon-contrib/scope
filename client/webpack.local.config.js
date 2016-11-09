const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */

 // Inject websocket url to dev backend
const WEBPACK_SERVER_HOST = process.env.WEBPACK_SERVER_HOST || 'localhost';
const DEV_SERVER_URL = `webpack-dev-server/client?http://${WEBPACK_SERVER_HOST}:4041'`;

module.exports = {

  // Efficiently evaluate modules with source maps
  devtool: 'cheap-module-source-map',

  // Set entry point include necessary files for hot load
  entry: {
    app: [
      './app/scripts/main',
      DEV_SERVER_URL,
      'webpack/hot/only-dev-server'
    ],
    'dev-app': [
      './app/scripts/main.dev',
      DEV_SERVER_URL,
      'webpack/hot/only-dev-server'
    ],
    'contrast-app': [
      './app/scripts/contrast-main',
      DEV_SERVER_URL,
      'webpack/hot/only-dev-server'
    ],
    'terminal-app': [
      './app/scripts/terminal-main',
      DEV_SERVER_URL,
      'webpack/hot/only-dev-server'
    ],
    vendors: ['babel-polyfill', 'classnames', 'd3', 'dagre', 'filesize', 'immutable', 'lodash',
      'moment', 'page', 'react', 'react-dom', 'react-motion', 'react-redux', 'redux',
      'redux-thunk', 'reqwest', 'xterm']
  },

  // This will not actually create a app.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: path.join(__dirname, 'build/'),
    filename: '[name].js'
  },

  // Necessary plugins for hot load
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'contrast-app'],
      template: 'app/html/index.html',
      filename: 'contrast.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'terminal-app'],
      template: 'app/html/index.html',
      filename: 'terminal.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'dev-app'],
      template: 'app/html/index.html',
      filename: 'dev.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'app'],
      template: 'app/html/index.html',
      filename: 'index.html'
    })
  ],

  // Transform source code using Babel and React Hot Loader
  module: {
    // Webpack is opionated about how pkgs should be laid out:
    // https://github.com/webpack/webpack/issues/1617
    noParse: /xterm/,
    include: [
      path.resolve(__dirname, 'app/scripts')
    ],

    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vendor/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules|vendor/,
        loaders: ['react-hot', 'babel']
      }
    ]
  },

  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
