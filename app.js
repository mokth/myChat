
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
    , io = require('socket.io')
    , chatclient = require('./routes/chat')
    ,angular = require('./routes/angular')
  , chat = require('./chat/chatserver');

var app = express();

// all environments
app.set('port', process.env.PORT || 8068);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use('/vendor',express.static(__dirname + '/vendor'));
app.use('/style',express.static(__dirname + '/public/style'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/chat',express.static(__dirname + '/chat'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/chat', chatclient.chat);
app.get('/angular', angular.angular);


var server =http.createServer(app);
var socket =io.listen(server,{log:false});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

chat.createServer(socket);
