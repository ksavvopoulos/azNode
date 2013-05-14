
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
  , fs = require('fs')
  , formidable = require('formidable')
  , format = require('util').format;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.errorHandler());
// development only

//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

function logErrors(err, req, res, next) {
    res.send(err.stack);
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, { error: 'egine ' });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    //res.status(500);
   // res.render('error', { error: err });
    res.send(err);
}

//app.get('/', routes.index);
app.get('/users', user.list);

app.get('/', function (req, res) {
    res.send('<form method="post" action="/upload" enctype="multipart/form-data">'
      + '<input type="file" name="file" />'
      + '<p><input type="submit" value="Upload" /></p>'
      + '</form><p><a href="test">Visit Test Page</a></p>');
    process.stdout.write('stdout test');
});

app.get('/custom', function (req, res) {
    res.send('Glu');
    var ext = 'xml';
   // res.send(ext +' has mime '+mimeTypes[ext]);
});

app.post('/upload', function (req, res) {
    var counter = 0,
        count=0;
    var form = new formidable.IncomingForm({ uploadDir: __dirname + '/upload' });
    log(form.uploadDir);
    form.parse(req);
   
    var blobService = azure.createBlobService('indtestblob',
       'M8TWMLNJ8AEwHen0uovkytvp+irTDC5V9AxaX/cas24mNypPEZ9zJcKIjxCO/S0imB+JrztyFi2cIBJ5lC1GhQ==').withFilter(new azure.ExponentialRetryPolicyFilter());

    log('Blob Service has been created...');

    log('Initialized Read Stream');

   

    var unKnownExtensions = [];

    form.onPart = function (part) {
        log('Received Part');
        if (!part.filename) {
           //let formidable handle all non-file parts
            return this.handlePart(part);
        }
        var lessonfolder = part.filename.replace('.zip','');
        var parsedZip = part.pipe(unzip.Parse(), {end:false});
      
        log('Data unziped');

        parsedZip.on('entry', function (entry) {
            counter += 1;
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
                blobService.createBlockBlobFromStream('repository',
                lessonfolder + '/' + path,
                entry,
                entry.size,
                { contentTypeHeader: contentType },
                    function (error) {
                        if (!error) {
                            counter -= 1;
                            log('Blob ' + path + ' created!');
                            if (!counter) {
                                res.send('Blobs have been created');
                                log('Blobs have been created');
                            }
                        } else {
                            log(error);
                            log('------------------');
                            res.send(error);
                        }
                    }
                );
            } else {
                count += 1;
                log('Folder' + count);
            }
        });

        parsedZip.on('end', function (entry) {
            var len = unKnownExtensions.length;
            if (len) {
                for (var i = 0; i < len; i++) {
                    log('Unknown Extension: ' + unKnownExtensions[i]);
                }
            } else {
                log('I knew all the extensions mime type');
            }
        });

        parsedZip.on('error', function (err) {
            res.send(err);
            log('ZIP ERROR: ' + err);
        });

    };
    res.send('Upload completed!');
    //form.on('progress', function (bytesReceived, bytesExpected) {
    //    var progress = {
    //        type: 'progress',
    //        bytesReceived: bytesReceived,
    //        bytesExpected: bytesExpected
    //    };

    //    socket.broadcast(JSON.stringify(progress));
    //});

   
    
   
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


function log(mes) {
    process.stdout.write(mes+'\n');
}
