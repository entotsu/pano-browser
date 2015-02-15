function initWebSocket(onRecieveFunction){

    if (!onRecieveFunction) alert("please set 'onRecieveFunction' to getWebSocketSendFunction");

    var socket;
    // Defined at index.html
    var uri = CONFIG.webSocket_URI;
 // var uri = "ws://localhost:8887";

    var isSending = false;
    var SEND_FREQUENCY_MARGIN = 150;

    var isConnected = false;


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



    if (!window.WebSocket) {
        alert("FATAL: WebSocket not natively supported. This demo will not work!");
    }

    var $popup_connected = null;
    var $popup_not_connected = null;

    $(function() {
        connect();
        $popup_connected = $("#webSocketConnectedMessage");
        $popup_not_connected = $("#webSocketErrorMessage");
    });


    //--------------------------------------------------------------


    function connect() {
        try {
            socket = new WebSocket(uri);
        } catch(e){
            log(e);
        }
        socket.onopen = function() {
            log("[WebSocket#onopen]\n");
            popupConnectedMessage();
            isConnected = true;
        }
        socket.onmessage = function(e) {
            onRecieve(e.data);
        }
        socket.onclose = function() {
            log("[WebSocket#onclose]\n");
            socket = null;
            popupDisconnectedMessage();
            isConnected = false;
            setTimeout(reconnect, 5000);
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

    var reconnectInterval = 5000;//ms
    function reconnect() {
        console.log("reconnect....");
        connect();
        // setTimeout(function(){
        //     if (isConnected) $popup_not_connected.fadeOut("slow");
        // }, 300);
    }


    function popupConnectedMessage () {
        $popup_not_connected.fadeOut("slow");
        setTimeout(function(){
            $popup_connected.fadeIn("slow",function(){
            setTimeout(function(){$popup_connected.fadeOut("slow")},3000);
        });
        },1000);
    }


    function popupDisconnectedMessage () {
        setTimeout(function(){
            $popup_not_connected.fadeIn("slow");
        },1000);
    }


    function log(text) {
        console.log(text);
    }

    var API = {};
    API.send = send;
    return API;

}