const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, './');

// This is needed for webpack to compile JavaScript.
// Many open source packages are published as untranspiled code which may contain the latest JavaScript features.
// This example compiles all modules in the src directory as well as any in node_modules that include 'react-native'.
const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'helpers'),
    path.resolve(appDirectory, 'node_modules/react-native-chart-kit'),
    path.resolve(appDirectory, 'node_modules/react-native-svg'),
    path.resolve(appDirectory, 'node_modules/react-native-image-picker'),
    path.resolve(appDirectory, 'node_modules/react-native-linear-gradient'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'module:@react-native/babel-preset' preset is used to compile React Native code.
      presets: ['module:@react-native/babel-preset'],
      // The 'react-native-web' plugin is used to alias 'react-native' to 'react-native-web'.
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = {
  entry: [
    // load any web polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your app's entry point
    path.resolve(appDirectory, 'index.js'),
  ],

  // configures where the build out should go
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'web/index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ],

  resolve: {
    // This will automatically alias 'react-native' to 'react-native-web'
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage':
        '@react-native-async-storage/async-storage/lib/commonjs/index.js',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    },
    // If you're working on a multi-platform project, web extensions should be listed first.
    extensions: [
      '.web.js',
      '.js',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.jsx',
    ],
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
  },
};
