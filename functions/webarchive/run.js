const { screenshot } = require('./headless-chrome');
const { saveImage } = require('./storage');

const takeSnapshot = (url, cb) => {
  screenshot(url, undefined, (err, buffer, filename) => {
    if (err) { return cb(err); }

    return saveImage(buffer, filename)
      .then(() => cb(null))
      .catch(error => cb(error));
  });
};

const run = (urls = [], cb) => {
  const u = urls.pop();
  if (!u) { return cb(); }

  return takeSnapshot(u, (err) => {
    if (err) { console.error('failed for ', u, err); }
    run(urls, cb);
  });
};

module.exports = {
  run,
};
