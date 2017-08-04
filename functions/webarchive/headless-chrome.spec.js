const { expect } = require('chai');

const { screenshot } = require('./headless-chrome');

describe('headless chrome', () => {
  describe('screenshot', () => {
    it('should take a screenshot', (done) => {
      screenshot('https://google.com', undefined, (err, buffer) => {
        if (err) { return done(err); }
        expect(buffer).to.be.an.instanceof(Buffer);
        return done();
      });
    });
  });
});
