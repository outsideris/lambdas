const path = require('path');
const { readFile } = require('fs');
const { expect } = require('chai');

process.env.AWS_S3_BUCKET = 'kr.sideeffect.webarchive-test';

const { saveImage } = require('./storage');

describe('storage module\'s', () => {
  describe('saveImage()', () => {
    let imgBuf;

    before((done) => {
      const img = path.join(__dirname, 'img/github.png');
      readFile(img, (err, data) => {
        if (err) { return done(err); }

        imgBuf = data;
        return done();
      });
    });

    it('should save the image on S3', (done) => {
      const filename = (new Date()).getTime();

      saveImage(imgBuf, filename, (err, data) => {
        if (err) { return done(err); }
        expect(data).to.have.property('ETag');
        return done();
      });
    });
  });
});
