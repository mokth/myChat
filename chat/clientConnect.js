/**
 * Created with JetBrains WebStorm.
 * User: mokth
 * Date: 5/11/13
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */


$(document).ready(function() {

// initialize the socket connection to listen on the 'chat' namespace //
    //socket = io.connect('/chat');

   // ConnectServer();

});

var options ={
    transports: ['websocket'],
    'force new connection': true
};
var io = require('socket.io-client');


function ConnectServer()
{

   var socket = io.connect('http://localhost:8068',options);
    socket.on('status', function (connections) {

    });
    socket.on('user-ready', function (data) {

    });
    socket.on('user-message', function (data) {

    });
    socket.on('user-disconnected', function (data) {

    });

    socket.on('error', function(err) {
     // alert(err.message);

    });

// register the user's name with the socket connection on the server //
    socket.emit('user-ready', {name : 'mok' });

  //   alert('connection.....');
    var sendMessage = function() {
    }
}