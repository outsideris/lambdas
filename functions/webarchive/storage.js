const AWS = require('aws-sdk'); // eslint-disable-line
const { join } = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const BUCKET = process.env.AWS_S3_BUCKET || 'kr.sideeffect.webarchive';

const getObject = Promise.promisify(s3.getObject, { context: s3 });
const writeFile = Promise.promisify(fs.writeFile);
const access = Promise.promisify(fs.access);
const mkdir = Promise.promisify(fs.mkdir);

const downloadFontAndSave = (path, targetDir, filename) => {
  return getObject({ Bucket: BUCKET, Key: path })
    .then(data => access(`${targetDir}`, fs.constants.F_OK)
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return Promise.all([data, mkdir(targetDir)]);
        }
        return Promise.all([data]);
      })
    )
    .then(([data]) => writeFile(`${targetDir}/${filename}`, data.Body))
};

module.exports = {
  saveImage: (image, filename, cb) => {
    console.log('image to save: ', filename);
    if (!image) { cb(new Error('image is required.')); }
    if (!filename) { cb(new Error('filename is required.')); }

    const year = (new Date()).getUTCFullYear();

    const params = {
      Bucket: BUCKET,
      Key: `${year}/${filename}`,
      Body: image,
    };
    s3.putObject(params, (err, data) => {
      if (err) { return cb(err); }

      return cb(null, data);
    });
  },
  downloadFont: Promise.method((path) => {
    if (!path) { throw new Error('font path is required.'); }
    console.log('download font: ', path);
    const targetDir = join(__dirname, '.fonts');
    const filename = path.substr(path.lastIndexOf('/') + 1);

    return access(`${targetDir}/${filename}`, fs.constants.F_OK)
      .catch((err) => {
        if (err.code !== 'ENOENT') {
          throw err;
        }
        return downloadFontAndSave(path, targetDir, filename);
      });
  }),
};
