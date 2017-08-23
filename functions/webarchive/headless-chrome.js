const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const Promise = require('bluebird');

const { filenamifyUrl } = require('./util');

const version = Promise.promisify(CDP.Version);

let launchedChrome = null;
let connectedCDP = null;
const launchChrome = () => {
  if (launchedChrome) {
    return new Promise(resolve => resolve(launchedChrome));
  }

  return chromeLauncher.launch({
    chromeFlags: [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--homedir=/tmp',
      '--data-path=/tmp/data-path',
      '--disk-cache-dir=/tmp/cache-dir',
      '--vmodule', // These two options are needed in lambda
      '--single-process',
    ],
    logLevel: 'verbose',
  })
  .then((chrome) => {
    console.log(`Headless Chrome launched with debugging port ${chrome.port}`);
    launchedChrome = chrome;
    return chrome;
  })
  .then(chrome => Promise.all([
    version({ host: 'localhost', port: chrome.port }),
    chrome,
  ]))
  .then(([info, chrome]) => {
    console.log('version: ', info);
    return chrome;
  })
  .then(chrome => CDP({ host: 'localhost', port: chrome.port }))
  .then((client) => {
    console.log('Chrome devtools protocol connected');
    connectedCDP = client;
    return client;
  });
};

module.exports = {
  screenshot: (url, size = '1366,3000', cb) => {
    console.log(`screenshot: url=${url} size=${size}`);
    const [width, height] = size.split(',').map(d => +d);

    launchChrome()
      .then(() => {
        const { DOM, Emulation, Network, Page } = connectedCDP;

        Page.enable()
          .then(DOM.enable)
          .then(Network.enable)
          .then(() => {
            // set up viewport resolution, etc.
            const deviceMetrics = {
              width,
              height,
              deviceScaleFactor: 0,
              mobile: false,
              fitWindow: false,
            };

            return Emulation.setDeviceMetricsOverride(deviceMetrics);
          })
          .then(() => Page.navigate({ url })) // navigate to target page
          .then(Page.loadEventFired)
          .then(() => Emulation.setVisibleSize({ width, height }))
          .then(() => Page.captureScreenshot())
          .then((screenshot) => {
            const buffer = new Buffer(screenshot.data, 'base64');
            return buffer;
          })
          .then(buffer => cb(null, buffer, filenamifyUrl(url)))
          .catch((err) => {
            console.error(err);
            cb(err);
          });
      })
      .catch((err) => {
        console.error(err);
        cb(err);
      });
  },
  kill: () => {
    if (launchedChrome) {
      if (connectedCDP) { connectedCDP.close(); }
      console.log('killing the headless chrome');
      return launchedChrome.kill();
    }
    return new Promise(resolve => resolve());
  },
};
