const filenamifyUrl = require('filenamify-url');

module.exports = {
  filenamifyUrl: (url, ext = 'png') => {
    const d = new Date();
    return `${d.getUTCMonth() + 1}-${d.getUTCDate()}-${filenamifyUrl(url)}.${ext}`;
  },
};
