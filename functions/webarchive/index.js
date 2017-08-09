const { run } = require('./run');

console.log('starting function');

exports.handle = (e, ctx, cb) => {
  const urls = process.env.URLS.split(',') || [];
  console.log('urls:', urls);
  run(urls, (err) => {
    console.log('completed');
    cb(err);
  });
};
