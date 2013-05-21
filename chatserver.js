
var express = require('c:/progra~1/nodejs/node_modules/express');
var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server,{log:false});

var sockets =[];

server.listen(8068,null);

app.root = __dirname;
app.use(express.bodyParser());
app.use(express.methodOverride());
console.log('root :'+app.root);
app.use('/vendor',express.static(app.root + '/vendor'));
app.use('/style',express.static(app.root + '/style'));
app.use('/js',express.static(app.root + '/js'));

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 100);
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.htm');
});


var colors = ['#AE331F', '#D68434', '#116A9F', '#360B95', '#5F209E'];
var connections = { };

io.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port);

    sockets.push(socket);
    socket.on('user-ready', function(data) {
       // console.log('got data:', data.toString('utf8'));
        var address = socket.handshake.address;
        console.log("connection from "+data.name+'  ' + address.address + ":" + address.port);

        socket.name = data.name;
        socket.color = data.color = colors[Math.floor(Math.random() * colors.length)];
        //sockets.forEach(function(otherSocket) {
            brodcastMessage('user-ready',data);
        //});

    });

    socket.on('user-message', function(data) {
        console.log('got data:', data.toString('utf8'));
       // sockets.forEach(function(otherSocket) {
            brodcastMessage( 'user-message',data);
       // });

    });


    socket.on('alert-message', function(data) {

        brodcastMessage( 'alert-message',data);
        // });

    });


    function dispatchStatus()
    {
        brodcastMessage('status', connections);
    }

    function brodcastMessage(message, data)
    {
        // remove socket.emit if you don't want the sender to receive their own message //
        socket.emit(message, data);
        socket.broadcast.emit(message, data);
    }


    connections[socket.id] = {};
    dispatchStatus();
    socket.on('disconnect', function() {
        var address = socket.handshake.address;
        console.log("Disconnection from "+socket.name+'  ' + address.address + ":" + address.port);
        delete connections[socket.id]; dispatchStatus();
        brodcastMessage('user-disconnected', { name : socket.name, color : socket.color });
    });
    socket.on('error', function(err) {
        console.log('Server error:', err.message);

    });

});

io.sockets.on('close', function() {
        console.log('connection closed');
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
    });

io.sockets.on('error', function(err) {
    console.log('Server error:', err.message);
});
io.sockets.on('close', function() {
    console.log('Server closed');
});

console.log('mok....');





