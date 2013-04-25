
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , azure = require('azure')
  , unzip = require('unzip')
  , mimeTypes = require('./mimeTypes.js')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/users', user.list);

app.get('/', function (req, res) {
    res.send('<form method="post" action="/upload" enctype="multipart/form-data">'
      + '<input type="file" name="file" />'
      + '<p><input type="submit" value="Upload" /></p>'
      + '</form>');
});


app.post('/upload', function (req, res, next) {
    res.send('Uploading');
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
            blobService.createBlockBlobFromStream('lesson1',
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function log(mes) {
    console.log(mes);
}