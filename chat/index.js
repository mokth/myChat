/**
 * Created with JetBrains WebStorm.
 * User: mokth
 * Date: 5/11/13
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {

    $('#msg').focus();
// give user a generic name to start //
   // $('#name').val(Math.random().toFixed(8).toString().substr(2));
    $('#btn-send').click(function(){ sendMessage(); })
    $('#btn-alert').click(function(){ alertMessage(); })
    $('#btn-connect').click(function(){ connectServer(); })
    $('#msg').keypress(function(e){ if (e.keyCode === 13) { sendMessage(); return false; } })

// initialize the socket connection to listen on the 'chat' namespace //
    //socket = io.connect('/chat');
    socket = io.connect('http://localhost:8068');
    socket.on('status', function (connections) {
        var i=0; for (p in connections) i++;
        var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';

        $('#connected').html('There '+s+' Currently Connected');
    });
    socket.on('user-ready', function (data) {
        $('#incoming').append('<span class="shadow" style="color:'+data.color+'">'+data.name +' :: connected</span><br>');
        autoScroll();
    });
    socket.on('user-message', function (data) {
        flashTitle(data);
        $('#incoming').append('<span class="shadow" style="color:'+data.color+'">'+data.name +' :: '+ data.message+'</span><br>');
        autoScroll();
    });

    socket.on('alert-message', function (data) {
        //document.title = 'Message from '+data.name;
        flashTitle(data);
        jAlert( data.message,data.name);
    });

    socket.on('user-disconnected', function (data) {
        $('#incoming').append('<span class="shadow" style="color:'+data.color+'">'+data.name +' :: disconnected</span><br>');
        autoScroll();
    });

// register the user's name with the socket connection on the server //
   // socket.emit('user-ready', {name : $('#name').val() });

    var autoScroll = function() {
        document.getElementById('incoming').scrollTop = document.getElementById('incoming').scrollHeight;
    }

    var connectServer = function() {
        socket.emit('user-ready', {name : $('#name').val() });
    }

    var sendMessage = function() {
        socket.emit('user-message', {name : $('#name').val() , message : $('#msg').val() });
        $('#msg').val('')
    }

    var alertMessage = function() {
        socket.emit('alert-message', {name : $('#name').val() , message : $('#msg').val() });
        $('#msg').val('')
    }

    function flashTitle(data)
    {
        $.titleAlert( 'Message from '+data.name, {
            requireBlur:true,
            stopOnFocus:true,
            duration:40000,
            interval:500
        });
    }
    function JQueryAlert(message,windowHeight){
        /****
         *  equivalent to javascript 'alert'
         */
        if (!windowHeight) var windowHeight = 470;

        $("#msgdialog").remove();

        $("body").append("<div id='msgdialog'></div>");

        thatmsg = $("#msgdialog");

        $("#msgdialog").dialog({
            resizable: false,
            draggable: false,
            width: 770,
            height: windowHeight,
            context: thatmsg,
            modal: true,
            autoOpen: false,
            buttons: {
                "Cancel" : function (){
                    thatmsg.dialog("close");
                }/*,
                 "View Source" : function (){
                 alert($('<div>').append($(this).clone()).html());
                 }*/
            }
        });

        $("#msgdialog").html(message);
        $("#msgdialog").dialog('open');
    }
});