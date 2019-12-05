const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = {

uploadFile : (fileName,filePath) =>{
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;

     var base64data = new Buffer(data, 'binary');

     const params = {
         Bucket: 'tsmen', // pass your bucket name
         Key: filePath, // file will be saved as testBucket/contacts.csv
         Body: base64data, //JSON.stringify(data, null, 2)
         ACL: 'public-read',
         ContentType: 'text/html'//ContentType: 'video/webm'
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
}

};
//uploadFile();
