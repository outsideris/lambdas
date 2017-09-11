const puppeteer = require('puppeteer');

let launchedChrome = null;

const launchChrome = () => {
  if (launchedChrome) {
    return new Promise(resolve => resolve(launchedChrome));
  }

  return puppeteer.launch()
    .then((chrome) => {
      launchedChrome = chrome;
      return chrome;
    })
    .then(chrome => chrome.version())
    .then(version => console.log(`${version} launched.`))
    .then(() => launchedChrome);
};

module.exports = {
  screenshot: (url, size = '1366,3000') => {
    console.log(`screenshot: url=${url} size=${size}`);
    const [width, height] = size.split(',').map(d => +d);

    return launchChrome()
      .then(chrome => chrome.newPage())
      .then(page =>
        page.setViewport({ width, height, deviceScaleFactor: 2 })
          .then(() => page.goto(url, { waitUntil: 'networkidle' }))
          .then(() => page.screenshot({ type: 'png' })) // eslint-disable-line
      )
      .catch((err) => {
        console.error(err);
        throw err;
      });
  },
  kill: () => {
    if (launchedChrome) {
      console.log('killing the headless chrome');
      return launchedChrome.close();
    }
    return new Promise(resolve => resolve());
  },
};
