const path = require('path');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'dist.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  resolve: {
    alias: {
      puppeteer: 'puppeteer/node6/Puppeteer.js',
    },
  },
};

