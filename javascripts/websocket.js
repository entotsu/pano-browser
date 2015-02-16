function initWebSocket(onRecieveFunction){

    var SEND_FREQUENCY_MARGIN = 150;

    var socket;
    var isSending = false;
    var isConnected = false;


    //--------------------------------------------------------------

    if (!onRecieveFunction) alert("please set 'onRecieveFunction' to getWebSocketSendFunction");
    if (!window.WebSocket) alert("FATAL: WebSocket not natively supported. This demo will not work!");

    var $popup_connected = null;
    var $popup_not_connected = null;
    $(function() {
        $popup_connected = $("#webSocketConnectedMessage");
        $popup_not_connected = $("#webSocketErrorMessage");

        connect();
    });



    //--------------------------------------------------------------
    // send
    function send(text) {
        if (isConnected) {
            if (!isSending) {
                isSending = true;
                socket.send(text);
                log("[WebSocket#send]      Send:    '" + text + "'\n");
                setTimeout(function(){
                    isSending = false;
                },SEND_FREQUENCY_MARGIN);
            }
        }
    }
    // recieve
    function onRecieve(text) {
        log("[WebSocket#onmessage] Message: '" + text + "'\n");
        // onRecieveMessageViaWebSocket(text);
        onRecieveFunction(text);
    }

    //--------------------------------------------------------------


    function connect() {
        console.log("connect...");
        
        socket = new WebSocket(window.CONFIG.webSocket_URI);

        socket.onopen = function() {
            log("[WebSocket#onopen]\n");
            popupConnectedMessage();
            isConnected = true;
        }
        socket.onclose = function() {
            log("[WebSocket#onclose]\n");
            popupDisconnectedMessage();
            socket = null;
            isConnected = false;
            setTimeout(connect, 5000);
        }
        socket.onmessage = function(e) {
            onRecieve(e.data);
        }

        // if (socket) return true;
        // else return false;
    }

    function disconnect() {
        if (socket) {
            socket.close();
            socket = null;
        }
    }





    //--------------------------------------------------------------


    function popupConnectedMessage () {
        setTimeout(function(){
            $popup_not_connected.fadeOut("fast", function(){
                $popup_connected.fadeIn("slow",function(){
                    setTimeout(function(){
                        $popup_connected.fadeOut("slow")
                    },3000);
                });                
            });
        },100);
    }


    function popupDisconnectedMessage () {
        $popup_not_connected.fadeIn("slow");
    }


    function log(text) {
        console.log(text);
    }



    //--------------------------------------------------------------


    var API = {};
    API.send = send;
    API.connect = connect;
    return API;

}