// JavaScript Document

/**
 * Module dependencies.
 johnpan
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    azure = require('azure'),
    unzip = require('unzip'),
    mimeTypes = require('./mimeTypes.js'),
    fs = require('fs'),
    formidable = require('formidable'),
    format = require('util').format,
    longjohn=require('longjohn');

var app = express();

longjohn.async_trace_limit = 5;   // defaults to 10
longjohn.empty_frame = 'ASYNC CALLBACK';

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
    res.send(err);
}

app.get('/', function (req, res) {
    log('---------------------Request to / ------------------------------');
    res.send('<body style="background-color: rgb(239, 239, 239);">' +
			'<div id="img" style="display:none;"> <table width="100%" border="0"> Uploading. Please wait...</br>' +
            '<img src="/images/ajaxLoader.gif" /> </table>' +
			'</div>' +
            '<form  method="post" action="/upload" enctype="multipart/form-data">' +
                '<input type="text" name="container" id="container" value="repository" style="display:none;" />' +
                '<input type="file" name="file" required/>' +
                '<input id="submit" type="submit" value="Upload" />' +
            '</form>' +
            '<script type="text/javascript" src="/javascripts/jquery-1-10-min.js"></script>' +
			'<script type="text/javascript" src="/javascripts/json2.js"></script>' +
            '<script type="text/javascript" src="/javascripts/postMessages.js"></script>' +
            '<script type="text/javascript" src="/javascripts/myscript.js"></script>' +
			'<script type="text/javascript">' +
				'SendMessage({"theFunction":"tellMeTheOrganizationName", "thaData":""});' +
			'</script>' +
            '</body>');

    log('--------------------Response from / -------------------------');
});

app.get('/updateScorm', function (req, res) {
    res.send('<body style="background-color: rgb(239, 239, 239);">' +
            '<img style="display:none;" src="/images/ajaxLoader.gif" />' +
            '<form  method="post" action="/scormUpdated" enctype="multipart/form-data">' +
                '<input type="file" name="file" />' +
                '<input type="submit" id="submit" value="Upload" />' +
           '</form>' +
           '<script type="text/javascript" src="/javascripts/jquery-1-10-min.js"></script>' +
           '<script type="text/javascript" src="/javascripts/myscript.js"></script>' +
           '<br/><br/><br/><br/>' +
           '<a href="/clear">Clear Scorm Folder</a>' +
           '</body>');

});

app.get('/clear', function (req, res) {
    blobService = azure.createBlobService('indtestblob',
      '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());

    blobService.listBlobs('scorm', function (error, blobs) {
        if (!error) {
            for (var index in blobs) {

                blobService.deleteBlob('scorm',
                      blobs[index].name,
                      clearError);

                console.log(blobs[index].name);
            }
            res.send('clear is completed');
        } else {
            res.send('clear failed');
        }
    });

    function clearError(error) {
        if (!error) {
            res.send('clear failed');
        }
    }

});



app.post('/scormUpdated', function (req, res) {
    log('---------------------Request to /upload ------------------------------');
    var counter = 0,
        count = 0,
        container,
        unKnownExtensions = [],
        form = new formidable.IncomingForm({ uploadDir: __dirname + '/upload' }),
        blobService = azure.createBlobService('indtestblob',
       '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());

    log('Blob Service has been created...');
    log('Initialized Read Stream');


    form.on('end', function () {
        log('--------------------Completed Parsing the Form----------------------------');
    });

    form.onPart = function (part) {

        log('Received Part');

        if (!part.filename) {
            return this.handlePart(part);
        }

        var parsedZip = part.pipe(unzip.Parse(), { end: false });//, { end: false }

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

            if (entry.type === 'File') {
                counter += 1;
                blobService.createBlockBlobFromStream('scorm',
                path,
                entry,
                entry.size,
                { contentTypeHeader: contentType },
                    function (error) {
                        if (!error) {
                            counter -= 1;
                            log('Blob ' + path + ' created!');
                            log('counter: ' + counter);
                            if (!counter) {
                                res.send('<body style="background-color: rgb(239, 239, 239);">' +
                                            '<p>Scorm uploaded </p>' +
                                         '</body>');
                                log('------------------Blobs Creation was succesfull.  Response from /upload  -------------------');
                            }
                        } else {
                            log('------------------------Blob Error------------------------------');
                            log(error);
                            log('------------------------Error End-------------------------------');
                            res.send(error);
                        }
                    }
                );
            } else {
                count += 1;
                log('Folder' + count);
            }
        });

        parsedZip.on('end', function () {
            log('---------------------------Unzipinng Stream completed------------------------------');
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

    form.parse(req);

});

app.post('/upload', function (req, res) {
    log('---------------------Request to /upload ------------------------------');
    var counter = 0,
        count = 0,
        container,
        unKnownExtensions = [],
        form = new formidable.IncomingForm({ uploadDir: __dirname + '/upload' }),
        blobService = azure.createBlobService('indtestblob',
       '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());

    log('Blob Service has been created...');
    log('Initialized Read Stream');

    form.on('field', function (name, value) {
        log('===================================================================');
        log(name + ' ' + value);
        log('===================================================================');
        if (name === 'container') {
            container = value;
        }
    });

    form.on('end', function () {
        log('--------------------Completed Parsing the Form----------------------------');
    });

    form.onPart = function (part) {

        log('Received Part');

        if (!part.filename) {
            return this.handlePart(part);
        }

        if (part.filename.indexOf('.zip') < 0) {
            res.send('<script>alert ("Scorm package must be a zip file"); history.back() ;</script>');
            return;
        }

        var lessonfolder = part.filename.replace('.zip', ''),
            parsedZip = part.pipe(unzip.Parse());//, { end: false }

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

            if (entry.type === 'File') {
                counter += 1;

                blobService.createBlockBlobFromStream(container,
                lessonfolder + '/' + path,
                entry,
                entry.size,
                { contentTypeHeader: contentType },
                    function (error) {
                        if (!error) {
                            counter -= 1;
                            log('Blob ' + path + ' created!');
                            if (!counter) {
                                res.send('<body style="background-color: rgb(239, 239, 239);">' +
                                            '<p>Lesson uploaded in ' + container + '/' + lessonfolder + '</p>' +
											'<script type="text/javascript" src="/javascripts/json2.js"></script>' +
											'<script type="text/javascript" src="/javascripts/postMessages.js"></script>' +
											'<script type="text/javascript">' +
											' SendMessage( { "theFunction" : "zipUploaded", "theData" : "' +
											    lessonfolder +
											'" });' +
											'</script>' +
                                         '</body>');
                                log('------------------Blobs Creation was succesfull.  Response from /upload  -------------------');
                            }
                        } else {
                            log('------------------------Blob Error------------------------------');
                            log(error);
                            log('------------------------Error End-------------------------------');
                            res.send('<body style="background-color: rgb(239, 239, 239);"><p> There was an error: ' + error + error.message + '</p></body>');
                        }
                    }
                );

            } else {
                count += 1;
                entry.autodrain();
                log('Folder' + count);
            }
        });

        parsedZip.on('end', function () {
            log('---------------------------Unzipinng Stream completed------------------------------');
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
            res.send("<script type='text/javascript'>say(" + err + "); alert('Please try upload again');");
            log('ZIP ERROR: ' + err);
        });

    };

    form.parse(req);

});

http.createServer(app).listen(app.get('port'), function () {
    log('Express server listening on port ' + app.get('port'));
});

function log(mes) {
    process.stdout.write(mes + '\n');
}
