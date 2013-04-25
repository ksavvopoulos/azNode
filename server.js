// JavaScript source code
var express = require('express'),
    fs = require('fs'),
    azure = require('azure'),
    unzip = require('unzip'),
    mimeTypes = require('./mimeTypes.js');


var port = process.env.PORT || 1337;

var app = express();

app.use(express.bodyParser());

app.get('/', function (req, res) {
    res.send('<form method="post" action="/upload" enctype="multipart/form-data">'
      + '<input type="file" name="file" />'
      + '<p><input type="submit" value="Upload" /></p>'
      + '</form>');
});

app.post('/upload', function (req, res, next) {
    var blobService = azure.createBlobService('indtestblob',
       'M8TWMLNJ8AEwHen0uovkytvp+irTDC5V9AxaX/cas24mNypPEZ9zJcKIjxCO/S0imB+JrztyFi2cIBJ5lC1GhQ==').withFilter(new azure.ExponentialRetryPolicyFilter());
    log('Blob Service has been created...');

    var name = req.files.file.name;
    var path = req.files.file.path;
    var rs = fs.createReadStream(path);

    log('Initialized Read Stream');

    var parsedZip = rs.pipe(unzip.Parse());

    var unKnownExtensions = [];


    parsedZip.on('entry', function (entry) {
        var path = entry.path;
        var ext = path.split('.').pop();
        var contentType = mimeTypes[ext];
        if (!contentType) {
            unKnownExtensions.push(ext);
        }
        
        log('Entry size :' + entry.size);
        log('Entry type: ' + entry.type);
        log('Entry readable:' + entry.readable);
        log('Entry path:' + path);
        log('Extension :' + ext);
        log('Mime Type : ' + contentType);

        if (entry.type == 'File') {
            blobService.createBlockBlobFromStream('lesson2',
           path,
           entry,
         entry.size,
         { contentTypeHeader: contentType },
              function (error) {
                  if (!error) {
                      log('Blob ' + path + ' created!');
                  } else {
                      log(error);
                      log('------------------');
                  }
              }
           );
        } else {
            count += 1;
            log('Folder' + count);
        }
    });

    parsedZip.on('end', function () {
        var len = unKnownExtensions.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                log('Unknown Extension: ' + unKnownExtensions[i]);
            }
        } else {
            log('I knew all the extensions mime type');
        }
    });

    
    next();
});

app.listen(port);

function log(mes) {
    console.log(mes);
}

