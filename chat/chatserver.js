/**
 * Created with JetBrains WebStorm.
 * User: mokth
 * Date: 5/15/13
 * Time: 10:35 PM
 * To change this template use File | Settings | File Templates.
 */

exports.createServer = function(io){

    var colors = ['#AE331F', '#D68434', '#116A9F', '#360B95', '#5F209E'];
    var connections = {};

    io.sockets.on('connection', function(socket) {
        var address = socket.handshake.address;
        console.log("New connection from " + address.address + ":" + address.port);

        //sockets.push(socket);
        socket.on('user-ready', function(data) {
            // console.log('got data:', data.toString('utf8'));
            var address = socket.handshake.address;
            console.log("connection from "+data.name+'  ' + address.address + ":" + address.port);
            if (isNameRegister(data)==1)
            {
               console.log(data.name+' already connected...')
               socket.disconnect();
               return;
            }

            socket.name = data.name;
            socket.mok =data.name;

            connections[socket.id] = {name:socket.name,ip:address.address.toString()};
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

        function isNameRegister(data)  {
            var found = 0;
            for (var p in connections){
              var con= connections[p];
                console.log(con.name+'    '+data.name)
               if ( con.name == data.name )
               {

                   found = 1;
                   break;
               }
            }
            return found;
        }

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

};