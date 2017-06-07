const path = require('path');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'dist.js',
    libraryTarget: 'commonjs2',
  },
};

