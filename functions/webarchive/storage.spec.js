const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const { join } = require('path');
const Promise = require('bluebird');

process.env.AWS_S3_BUCKET = 'kr.sideeffect.webarchive-test';

const { saveImage, downloadFont } = require('./storage');
const access = Promise.promisify(fs.access);

describe('storage module\'s', () => {
  describe('saveImage()', () => {
    let imgBuf;

    before((done) => {
      const img = path.join(__dirname, 'img/github.png');
      fs.readFile(img, (err, data) => {
        if (err) { return done(err); }

        imgBuf = data;
        return done();
      });
    });

    it('should save the image on S3', () => {
      const filename = (new Date()).getTime();

      return saveImage(imgBuf, filename)
        .then((data) => {
          expect(data).to.have.property('ETag');
        });
    });
  });

  describe('downloadFont()', () => {
    it('should download the font from S3', () => {
      const targetDir = join(__dirname, '.fonts');
      const filename = 'NotoSansCJKtc-Regular.otf';
      return downloadFont(`fonts/${filename}`)
        .then(() => access(`${targetDir}/${filename}`, fs.constants.F_OK));
    });
  });
});
