const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');
const chrome = require('chrome-remote-interface');

const { filenamifyUrl } = require('./util');

// to find headless shell on Linux.
// In macOS, it will find chrome-canay automatically.

const launchChrome = (size = '1366,3000', headless = true) => {
  console.log('launching headless chrome....');

  const launcher = new ChromeLauncher({
    port: 9222,
    autoSelectChrome: true,
    additionalFlags: [
      headless ? '--headless' : '',
      '--disable-gpu',
      `--window-size=${size}`,
      '--no-sandbox',
      '--homedir=/tmp',
      '--data-path=/tmp/data-path',
      '--disk-cache-dir=/tmp/cache-dir',
    ],
  });

  return launcher.run()
    .then(() => console.log('headless chrome launched.'))
    .then(() => launcher)
    .catch((err) => {
      console.error(err);
      return launcher.kill()
        .then(() => { // Kill Chrome if there's an error.
          throw err;
        });
    });
};

module.exports = {
  screenshot: (url, size = '1366,3000', cb) => {
    console.log(`screenshot: url=${url} size=${size}`);
    const [width, height] = size.split(',').map(d => +d);

    return launchChrome(size)
      .then(() => chrome.Version())
      .then(version => console.log('UA:', version['User-Agent']))
      .then(() => {
        chrome((protocol) => {
          // Extract the parts of the DevTools protocol
          const { DOM, Emulation, Network, Page } = protocol;

          Page.enable()
            .then(DOM.enable)
            .then(Network.enable)
            .then(() => {
              // Set up viewport resolution, etc.
              const deviceMetrics = {
                width,
                height,
                deviceScaleFactor: 0,
                mobile: false,
                fitWindow: false,
              };

              return Emulation.setDeviceMetricsOverride(deviceMetrics);
            })
            .then(() => Emulation.setVisibleSize({ width, height }))
            .then(() => Page.navigate({ url })) // Navigate to target page
            .then(Page.loadEventFired)
            .then(() => Page.captureScreenshot({ format: 'png', fromSurface: true }))
            .then((screenshot) => {
              const buffer = new Buffer(screenshot.data, 'base64');
              protocol.close();
              return buffer;
            })
            .then(buffer => cb(null, buffer, filenamifyUrl(url)))
            .catch((err) => {
              console.error(err);
              cb(err);
            });
        }).on('error', (err) => {
          console.error('Cannot connect to browser:', err);
          cb(err);
        });
      })
      .catch((err) => {
        console.error(err);
        cb(err);
      });
  },
};
