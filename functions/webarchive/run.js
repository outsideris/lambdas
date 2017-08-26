const { screenshot, kill } = require('./headless-chrome');
const { saveImage } = require('./storage');
const { filenamifyUrl } = require('./util');

const takeScreenshot = (url) => {
  return screenshot(url)
    .then((buffer) => saveImage(buffer, filenamifyUrl(url)));
};

const run = (urls = []) => {
  const u = urls.pop();
  if (!u) { return kill(); }
  return takeScreenshot(u)
    .then(() => run(urls))
    .catch((err) => {
      console.error('failed for ', u, err);
    });
};

module.exports = {
  run,
};
