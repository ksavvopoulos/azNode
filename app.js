
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
    //res.send('Received File ...\n Creating Blobs');
    var form = new formidable.IncomingForm({ uploadDir: __dirname + '/upload' });
    log(form.uploadDir);
    res.send('form created');
    form.parse(req);
   
    var blobService = azure.createBlobService('indtestblob',
       'M8TWMLNJ8AEwHen0uovkytvp+irTDC5V9AxaX/cas24mNypPEZ9zJcKIjxCO/S0imB+JrztyFi2cIBJ5lC1GhQ==').withFilter(new azure.ExponentialRetryPolicyFilter());

    log('Blob Service has been created...');

    log('Initialized Read Stream');

    //res.send('Uploading...');
    var unKnownExtensions = [];
  //  ws = fs.createWriteStream(__dirname+'/Downloads');
    form.onPart = function (part) {
        log('Received Part');
        if (!part.filename) {
           //let formidable handle all non-file parts
            return this.handlePart(part);
        }
        
        var parsedZip = part.pipe(unzip.Parse(), {end:false});
      
        log('Data unziped');

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
                          res.send('eskaase');
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

    };
   
    
   
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


function log(mes) {
    process.stdout.write(mes+'\n');
}
