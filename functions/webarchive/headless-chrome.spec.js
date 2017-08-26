const { expect } = require('chai');
const fs = require('fs');

const { screenshot, kill } = require('./headless-chrome');

describe('headless chrome', () => {
  after(kill);

  describe('screenshot', () => {
    it('should take a screenshot', () => {
      return screenshot('https://google.com')
        .then((buffer) => {
          expect(buffer).to.be.an.instanceof(Buffer);
        });
    });

    it('should take multiple screenshots once launching chrome', () => {
      return screenshot('https://google.com')
        .then(() => screenshot('https://github.com'))
        .then((buffer) => {
          expect(buffer).to.be.an.instanceof(Buffer);
        });
    });

    it.skip('to check screenshot', (done) => {
      screenshot('https://github.com')
        .then((buffer) => {
          expect(buffer).to.be.an.instanceof(Buffer);

          fs.writeFile('./github.png', buffer, (err) => {
            if (err) { return done(err); }
            return done(err);
          });
        });
    });
  });
});
