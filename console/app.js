
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , daemon = require('./routes/daemon')
  , http = require('http')
  , path = require('path');

var app = express();

var server = http.createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
    app.use(express.cookieParser('promise'));
    app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/daemon', daemon.index);

//should be async post
app.get('/daemon/start', daemon.start);
app.get('/daemon/stop', daemon.stop);

io.sockets.on('connection', function(socket) {
        
    socket.on('leave', function(message) {
        console.log(message.uuid + ' left');
    });

    socket.on('ready', function(message) {
        console.log('client ', message.uuid, ' joined');
    });

    socket.on('subscribe', function(request) {
        console.log('subscribe to ', request.uuid);
        if (request.uuid === 'geo') {
            daemon.listen(function (data) {
                socket.emit('push', {'data': data});
            });
        }
    });

    socket.on('unsubscribe', function(request) {
        console.log('unsubscribe from ', request.uuid);
    });

    socket.emit('contact_received', { state: 'sync complete' });

});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

