const filenamifyUrl = require('filenamify-url');

module.exports = {
  filenamifyUrl: (url, ext = 'png') => {
    const d = new Date();
    const date = `${d.getUTCMonth() + 1}-${d.getUTCDate()}-${d.getUTCHours()}`;
    return `${date}-${filenamifyUrl(url)}.${ext}`;
  },
};
