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
    Zip = require('adm-zip'),
    streamifier = require('streamifier');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.errorHandler());
//development only

if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

function logErrors(err, req, res, next) {
    res.send(err.stack);
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, {
            error: err
        });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.send(err);
}

app.get('/', function(req, res) {
    res.sendfile('views/index.html');
});

app.get('/updateScorm', function(req, res) {
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

app.get('/clearContainerContents/:container', function(req, res) {
    var blobService;
    var container = req.params.container;

    blobService = azure.createBlobService('indtestblob',
        '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());

    blobService.listBlobs(container, function(error, blobs) {
        if (!error) {
            for (var index in blobs) {
                blobService.deleteBlob(container,
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

app.post('/scormUpdated', function(req, res) {
    log('---------------------Request to /upload ------------------------------');
    var counter = 0,
        count = 0,
        container,
        unKnownExtensions = [],
        form = new formidable.IncomingForm({
            uploadDir: __dirname + '/upload'
        }),
        blobService = azure.createBlobService('indtestblob',
            '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());

    log('Blob Service has been created...');
    log('Initialized Read Stream');


    form.on('end', function() {
        log('--------------------Completed Parsing the Form----------------------------');
    });

    form.onPart = function(part) {

        log('Received Part');

        if (!part.filename) {
            return this.handlePart(part);
        }

        var parsedZip = part.pipe(unzip.Parse(), {
            end: false
        }); //, { end: false }

        parsedZip.paused = false;
        parsedZip.on('entry', function(entry) {

            var path = entry.path,
                ext = path.split('.').pop(),
                contentType = mimeTypes[ext];

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
                    entry.size, {
                        contentTypeHeader: contentType
                    },
                    function(error) {
                        if (!error) {
                            counter -= 1;
                            log('Blob ' + path + ' created!');
                            log('counter: ' + counter);
                            if (!counter) {
                                res.send('<body style="background-color: rgb(239, 239, 239);">' +
                                    '<p>Scorm uploaded </p>' +
                                    '</body>');
                                log('------------------Blobs Creation was succesfull.  Response from /upload  -------------------');
                            } else if (counter < 2 && parsedZip.paused) {
                                parsedZip.resume();
                                parsedZip.paused = false;
                                log("------------------------parsedZip is resumed-------------------------");
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

        parsedZip.on('end', function() {
            log('---------------------------Unzipinng Stream completed------------------------------');
            var len = unKnownExtensions.length,
                i;

            if (len) {
                for (i = 0; i < len; i++) {
                    log('Unknown Extension: ' + unKnownExtensions[i]);
                }
            } else {
                log('I knew all the extensions mime type');
            }
        });

        parsedZip.on('error', function(err) {
            res.send(err);
            log('ZIP ERROR: ' + err);
        });
    };

    form.parse(req);
});

app.post('/upload', function(req, res) {
    log('---------------------Request to /upload ------------------------------');
    var container = "repository";
    var form = new formidable.IncomingForm({
            uploadDir: __dirname + '/upload'
        });
    var tempFileName = Date.now().toString() +'.zip';

    log('Blob Service has been created...');
    log('Initialized Read Stream');

    form.on('field', function(name, value) {
        log('===================================================================');
        log(name + ' ' + value);
        log('===================================================================');
        if (name === 'container') {
            container = value;
        }
    });

    form.on('end', function() {
        log('--------------------Completed Parsing the Form----------------------------');
    });

    form.onPart = function(part) {
        var blobService, lessonfolder, writeStream;

        log('Received Part');

        if (!part.filename) {
            return this.handlePart(part);
        }

        if (part.filename.indexOf('.zip') < 0) {
            res.send('<script>alert ("Scorm package must be a zip file"); history.back() ;</script>');
            return;
        }

        // res.writeHead(200, {
        //     'Content-Type': 'text/html',
        //     'Transfer-Encoding': 'chunked'
        // });

        lessonfolder = part.filename.replace('.zip', '');

        writeStream = fs.createWriteStream(__dirname + '/upload/' + part.filename);

        part.pipe(writeStream);

        writeStream.on('finish', function() {
            createBlobService();
            createContainerIfNotExists(moveScormToContainer);
        });

        function createBlobService() {
            blobService = azure.createBlobService('indtestblob',
                '0eg17FS5REKaUBzgoxI3oO4OWw2T83Nph0zh70F8AtfWi5Xug2LAXvdNFFrO80jlpNe9ww8Jd//VJqUWtq9XSg==').withFilter(new azure.ExponentialRetryPolicyFilter());
        }

        function createContainerIfNotExists(cb) {
            blobService.createContainerIfNotExists(container, {
                publicAccessLevel: 'blob'
            }, function(error) {
                if (!error) {
                    // Container exists and is public
                    cb();
                } else {
                    log(error);
                    res.send(error);
                }
            });
        }

        function moveScormToContainer() {

            log('extract complete');
            //var readStream = fs.createReadStream(__dirname + '/upload/energy.zip');
            var zip = new Zip(__dirname + '/upload/' + part.filename);
            var entries = zip.getEntries();
            var files = [];
            var totalFiles;
            var remainingFiles;

            entries.forEach(function(entry) {
                if (entry.isDirectory === false) {
                    files.push(entry);
                }
            });

            totalFiles = files.length;
            remainingFiles = totalFiles;

            files.forEach(function(file) {
                var decompressedData = zip.readFile(file),
                    streamedData = streamifier.createReadStream(decompressedData),
                    path = file.entryName,
                    ext = path.split('.').pop(),
                    contentType = mimeTypes[ext];

                blobService.createBlockBlobFromStream(container,
                    lessonfolder + '/' + path,
                    streamedData,
                    file.header.size, {
                        contentTypeHeader: contentType
                    },
                    function(error) {
                        if (!error) {
                            remainingFiles -= 1;
                            // log('totalFiles :' + totalFiles);
                            // log('remainingFiles :' + remainingFiles);
                            // log('Blob ' + path + ' created!');
                            
                            if (!remainingFiles) {
                                // res.write('<p>Lesson uploaded in ' + container + '/' + lessonfolder + '<br/>Please wait for page redirect...</p>' +
                                //     '<script type="text/javascript" src="/javascripts/json2.js"></script>' +
                                //     '<script type="text/javascript" src="/javascripts/postMessages.js"></script>' +
                                //     '<script type="text/javascript">' +
                                //     ' SendMessage( { "theFunction" : "zipUploaded", "theData" : "' +
                                //     lessonfolder +
                                //     '" });' +
                                //     '</script>');
                                // res.end();
                                res.send('<p>Lesson uploaded in ' + container + '/' + lessonfolder + '<br/>Please wait for page redirect...</p>' +
                                    '<script type="text/javascript" src="/javascripts/json2.js"></script>' +
                                    '<script type="text/javascript" src="/javascripts/postMessages.js"></script>' +
                                    '<script type="text/javascript">' +
                                    ' SendMessage( { "theFunction" : "zipUploaded", "theData" : "' +
                                    lessonfolder +
                                    '" });' +
                                    '</script>');
                                //log('------------------Blobs Creation was succesfull.  Response from /upload  -------------------');
                                fs.unlink(__dirname + '/upload/' + part.filename);
                            }
                        } else {
                            // log('------------------------Blob Error------------------------------');
                            // log(error);
                            // log('------------------------Error End-------------------------------');
                            res.send(error);
                        }
                    }
                );

            });
        }
    };

    form.on('error', function(error) {
        log("Error in Processing the Form : " + error);
    });

    form.parse(req);
});

app.get('/tincan/activities',function(req,res){
    res.send("ok");
});
app.get('/tincan/activities/state',function(req,res){
    res.send("ok");
});
app.options('/tincan/activities/state',function(req,res){
    res.send("ok");
});

app.get('/progress', function(req, res) {
    res.send({
        progress: '10'
    });
});

http.createServer(app).listen(app.get('port'), function() {
    log('Express server listening on port ' + app.get('port'));
});

function log(mes) {
    process.stdout.write(mes + '\n');
}
