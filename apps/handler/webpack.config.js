const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  target: 'node',
  mode: isDevelopment ? 'development' : 'production',
  entry: isDevelopment ? './src/main.ts' : './src/main.lambda.ts',
  output: {
    path: join(__dirname, '../../dist/apps/handler'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: isDevelopment ? './src/main.ts' : './src/main.lambda.ts',
      tsConfig: './tsconfig.app.json',
      optimization: !isDevelopment,
      outputHashing: isDevelopment ? 'none' : 'all',
      generatePackageJson: true,
    }),
  ],
};
