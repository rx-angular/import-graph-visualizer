const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app/index.tsx',
  externals: {
    fs: 'empty',
    path: 'empty',
    crypto: 'empty',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/app'),
    clean: true,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.worker\.js/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.wasm$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/app/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/app/generated/icons', to: 'assets/icons' }],
    }),
  ],
};
