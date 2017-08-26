const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

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
  .then(chrome => CDP.Version({ host: 'localhost', port: chrome.port }))
  .then(info => console.log('version: ', info))
  .then(() => CDP({ host: 'localhost', port: launchedChrome.port }))
  .then((client) => {
    console.log('Chrome devtools protocol connected');
    connectedCDP = client;
    return client;
  });
};

module.exports = {
  screenshot: (url, size = '1366,3000') => {
    console.log(`screenshot: url=${url} size=${size}`);
    const [width, height] = size.split(',').map(d => +d);

    return launchChrome()
      .then(() => {
        const { DOM, Emulation, Network, Page } = connectedCDP;

        return Page.enable()
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
          .then(Page.captureScreenshot)
          .then(screenshot => new Buffer(screenshot.data, 'base64'));
      })
      .catch((err) => {
        console.error(err);
        throw err;
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
