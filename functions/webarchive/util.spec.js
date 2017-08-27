const { filenamifyUrl } = require('./util');
const { expect } = require('chai'); // eslint-disable-line

describe('util: ', () => {
  describe('normalizeUrl', () => {
    it('should save11', () => {
      const filename = filenamifyUrl('https://google.com');
      expect(filename).to.not.match(/\/\//);
    });
  });
});
