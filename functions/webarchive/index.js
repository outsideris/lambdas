const { join } = require('path');

const { run } = require('./run');
const { downloadFont } = require('./storage');

console.log('starting function');

exports.handle = (e, ctx, cb) => {
  const urls = process.env.URLS.split(',') || [];
  console.log('urls:', urls);
  const targetDir = join('/tmp', '.fonts');
  return downloadFont('fonts/NotoSansCJKtc-Regular.otf', targetDir)
    .then(() => run(urls))
    .then(() => {
      console.log('completed');
      return ctx.succeed();
    })
    .catch((err) => {
      ctx.fail(err);
    });
};
