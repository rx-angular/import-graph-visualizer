const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app/index.tsx',
    cli: './src/cli/index.ts',
  },
  output: {
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
      excludeChunks: ['cli'],
    }),
  ],
};
