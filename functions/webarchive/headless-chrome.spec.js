const { expect } = require('chai');

const { screenshot, kill } = require('./headless-chrome');

describe('headless chrome', () => {
  after(() => kill());

  describe('screenshot', () => {
    it('should take a screenshot', (done) => {
      screenshot('https://google.com', undefined, (err, buffer) => {
        if (err) { return done(err); }
        expect(buffer).to.be.an.instanceof(Buffer);
        return done();
      });
    });

    it('should take multiple screenshots once launching chrome', (done) => {
      screenshot('https://google.com', undefined, (err) => {
        if (err) { return done(err); }

        return screenshot('https://github.com', undefined, (err2, buffer) => {
          if (err2) { return done(err2); }
          expect(buffer).to.be.an.instanceof(Buffer);
          return done();
        });
      });
    });
  });
});
