const filenamifyUrl = require('filenamify-url');

module.exports = {
  filenamifyUrl: (url, ext = 'png') => {
    const d = new Date();
    const date = d.toISOString().substr(0, d.toISOString().indexOf('T'));
    return `${date}-${filenamifyUrl(url)}.${ext}`;
  },
};
