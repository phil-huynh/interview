const express = require('express');
const app = express();
const aws = require('aws-sdk');
const path = require('path');
const config = require('../config.js');
const multer = require('multer');
const multerS3 = require('multer-s3');
const port = 3000
const s3 = new aws.S3({
  bucketName: config.AWS_BUCKET_NAME,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY,
  region: 'us-west-1'
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'phils-image-upload-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../dist')));

app.post('/image', upload.single('image'),(req, res, next) => {
  next()
}, (req, res) => {
  var url = req.file.location
  res.send({url: url})
})

app.listen(port, () => {
  console.log(`server listening on: ${port}`);
})
