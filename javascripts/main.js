(function(){



	window.onload = function() {
		initPanoBrowser()

		// SmartPhone Scroll Off
		if (util.ua.isiOS || util.ua.isAndroid) $(window).on('touchmove.noScroll', function(e) {e.preventDefault();});
	}





	// ------------------ init pano-browser ------------------

	var websocketAPI = null;
	var panoAPI = null;

	function initPanoBrowser() {
		websocketAPI = initWebSocket( onRecieveMessageViaWebSocket );//websocket.js
		panoAPI = initPanoRender( onRotateCamera )//render.js
		enableDragAndDropImage(onDropImageFile);//dropImage.js
		initSettingView(onClickConnectButton);//ui.js
	}





	//============== ↓ MAIN FUNCTIONS (EVENTS) ↓ ================

	var pitch = 0;
	var yaw = 0;
	var lastMessage;
	var isGoingToRotate = false;
	// When Browser recieved message from WebSocketServer of CVE-Client
	// this function called from websocket.js
	function onRecieveMessageViaWebSocket(message) {

		if (message != lastMessage) {
		    var firstWord = message.substr(0, message.indexOf( ":" ));

		    if (firstWord == "Orientation") {
		        var orientation = parseOrientationMessage(message);
		        pitch = orientation.pitch;
		        yaw = orientation.yaw;
		        isGoingToRotate = true;
		    }

		    //Volume (Extra case)
		    else if (firstWord == "Volume") {
		        pitch = getPitchFromVolumeMessage(message);
		        isGoingToRotate = true;
		    }

		    //when catch message from other pano-browser
		    else {
				var beforeEqual = message.substr(0, message.indexOf( "=" ));
				if (beforeEqual == "o") {
					var orientation = parseOrientationMessageFromPanoBrowser(message);
					pitch = orientation.phi;
					yaw = orientation.theta;
			        isGoingToRotate = true;
				}
		    }


		    if (isGoingToRotate) {
		    	isGoingToRotate = false;
		        // TODO inverting is only here. ok???
				if (CONFIG.direction.vertical == "negative") pitch *= -1;
				if (CONFIG.direction.horizontal == "left") yaw *= -1;

		        panoAPI.rotateCamera(yaw, pitch);
		    }
		}
	}


	// When rotate Camera by moving mouse
	// This function called from render.js
	function onRotateCamera(phi, theta) {

	    var message = "o=0," + phi + "," + theta;

	    websocketAPI.send(message);

	    lastMessage = message;
	}


	// this function called from dropImage.js
	function onDropImageFile (file) {
		panoAPI.changePanoramicPhoto(file);
	}

	function onClickConnectButton(newUri) {
		CONFIG.webSocket_URI = newUri;
		websocketAPI.connect();

	}
	//================= ↑ MAIN FUNCTIONS ↑ ==================











	// ----------- message parser --------------------

	function parseOrientationMessageFromPanoBrowser(message) {
		// var message = "o=0," + phi + "," + theta;
		var splited = message.split(",");
		var phi = splited[1];
		var theta = splited[2];

		phi = parseFloat(phi);
		theta = parseFloat(theta);

	    return {
	    	phi   : phi,
	    	theta : theta
	    };
	}

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






})();