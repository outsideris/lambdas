const { run } = require('./run');
const { downloadFont } = require('./storage');

console.log('starting function');

exports.handle = (e, ctx, cb) => {
  const urls = process.env.URLS.split(',') || [];
  console.log('urls:', urls);
  return downloadFont('fonts/NotoSansCJKtc-Regular.otf')
    .then(() => {
      return run(urls, (err) => {
        console.log('completed');
        if (err) { return ctx.fail(err); }
        return ctx.succeed();
      });
    });
};
