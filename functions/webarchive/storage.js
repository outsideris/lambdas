const AWS = require('aws-sdk'); // eslint-disable-line
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const BUCKET = process.env.AWS_S3_BUCKET || 'kr.sideeffect.webarchive';

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
};
