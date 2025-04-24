import path from 'path';

const isDev = process.argv.includes('--build') === false;

export default {
  mode: isDev ? 'development' : 'production',
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve('dist/js'),
  },
  devtool: isDev ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
