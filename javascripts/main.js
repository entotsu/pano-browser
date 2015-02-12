

(function(){

	var websocketAPI = null;
	var panoAPI = null;


	window.onload = function() {
		initPanoBrowser()

		// SmartPhone Scroll Off
		if (ua.isiOS || ua.isAndroid) $(window).on('touchmove.noScroll', function(e) {e.preventDefault();});
	}

	function initPanoBrowser() {
		websocketAPI = initWebSocket( onRecieveMessageViaWebSocket );//websocket.js
		panoAPI = initPanoRender( onRotateCamera )//render.js
	}


	//=========================== ↓ MAIN FUNCTION ↓ ================================

	var pitch;
	var yaw;
	var lastMessage;

	// When Browser recieved message from WebSocketServer of CVE-Client
	function onRecieveMessageViaWebSocket(message) {

		if (message != lastMessage) {
		    var firstWord = message.substr(0, message.indexOf( ":" ));

		    if (firstWord == "Orientation") {
		        var orientation = parseOrientationMessage(message);
		        pitch = orientation.pitch;
		        yaw = orientation.yaw;

		        panoAPI.rotateCamera(yaw, pitch);
		    }

		    //Volume (Extra case)
		    else if (firstWord == "Volume") {
		        pitch = getPitchFromVolumeMessage(message);

		        panoAPI.rotateCamera(yaw, pitch);
		    }
		}
	}


	// When rotate Camera by moving mouse
	function onRotateCamera(phi, theta) {

	    var message = "o=0," + phi + "," + theta;

	    websocketAPI.send(message);

	    lastMessage = message;
	}
	//=========================== ↑ MAIN FUNCTION ↑ ================================



	function getPitchFromVolumeMessage(message) {
        var volume = message.split(":")[1];
        var pitch = (volume - 0.5) * 180; //  0~1 => -90~90
        pitch = parseFloat(pitch);
		return pitch;
	}


	function parseOrientationMessage(message) {
	    var splited = message.split([":",","]);
	    var orientation = {};

	    var roll = splited[2];
	    var pitch = splited[4];
	    var yaw = splited[6];

        pitch = parseFloat(pitch);
        roll = parseFloat(roll);
        yaw = parseFloat(yaw);

        //pitch -180 ~ 180 -> -90 ~ 90 へ
        if (pitch > 90) pitch = 90
        if (pitch < -90) pitch = -90

	    var orientation = {};
		orientation.roll = roll;
		orientation.pitch = pitch;
		orientation.yaw = yaw;
	    console.log(orientation);

	    return orientation;
	}


	//---------------------------- specify user agent ----------------------------

	var ua = {};
	ua.name = window.navigator.userAgent.toLowerCase();
	 
	ua.isIE = (ua.name.indexOf('msie') >= 0 || ua.name.indexOf('trident') >= 0);
	ua.isiPhone = ua.name.indexOf('iphone') >= 0;
	ua.isiPod = ua.name.indexOf('ipod') >= 0;
	ua.isiPad = ua.name.indexOf('ipad') >= 0;
	ua.isiOS = (ua.isiPhone || ua.isiPod || ua.isiPad);
	ua.isAndroid = ua.name.indexOf('android') >= 0;
	ua.isTablet = (ua.isiPad || (ua.isAndroid && ua.name.indexOf('mobile') < 0));
	 
	if (ua.isIE) {
	    ua.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(ua.name);
	    if (ua.verArray) {
	        ua.ver = parseInt(ua.verArray[2], 10);
	    }
	}
	if (ua.isiOS) {
	    ua.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(ua.name);
	    if (ua.verArray) {
	        ua.ver = parseInt(ua.verArray[2], 10);
	    }
	}
	if (ua.isAndroid) {
	    ua.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(ua.name);
	    if (ua.verArray) {
	        ua.ver = parseInt(ua.verArray[2], 10);
	    }
	}

})();

