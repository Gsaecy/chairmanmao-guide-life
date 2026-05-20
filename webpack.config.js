const path = require('path');

/** @type {import('webpack').Configuration} */
const extensionConfig = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log',
  },
};

/** @type {import('webpack').Configuration} */
const chatWebviewConfig = {
  target: 'web',
  mode: 'none',
  entry: './src/webviews/chat.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chat.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devtool: 'nosources-source-map',
};

/** @type {import('webpack').Configuration} */
const settingsWebviewConfig = {
  target: 'web',
  mode: 'none',
  entry: './src/webviews/settings.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'settings.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devtool: 'nosources-source-map',
};

/** @type {import('webpack').Configuration} */
const historyWebviewConfig = {
  target: 'web',
  mode: 'none',
  entry: './src/webviews/history.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'history.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devtool: 'nosources-source-map',
};

module.exports = [extensionConfig, chatWebviewConfig, settingsWebviewConfig, historyWebviewConfig];
