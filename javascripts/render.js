function initPanoRender(onRotateCamera) {

	var camera, scene, renderer, material;

	var fov = 70,
		texture_placeholder,
		isUserInteracting = false,
		onMouseDownMouseX = 0,
		onMouseDownMouseY = 0,
		lon = 0,
		onMouseDownLon = 0,
		lat = 0,
		onMouseDownLat = 0,
		phi = 0,
		theta = 0;

	init();
	animate();


	//---------------- added -------------------

	var API = {};


	API.changePanoramicPhoto = function(file) {
		var img = document.createElement("img");
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			img.src = e.target.result;
			material.map = new THREE.Texture(img);
			material.map.needsUpdate = true;
		};

		fileReader.readAsDataURL(file);
	};


	API.changePanoramicPhotoByURL = function(url) {
		var img = document.createElement("img");
		img.src = url;
		material.map = new THREE.Texture(img);
		material.map.needsUpdate = true;
	};


	// the only Global function in this scope
	API.rotateCamera = function(_lon, _lat) {
		// console.log("rotateCamera  lon:" + _lon + " lat:" + _lat);

		lon = _lon;
		lat = _lat;
	}

	//マウスをつかって回転させたときに呼ばれる
	function onCameraRotated_withMouse(lon, lat) {

		var fixed_lon = lon;
		var fixed_lat = lat;

		if (CONFIG.enableWrappingDeg) {
			fixed_lon %= 360;
			if (fixed_lon <= 0)
				fixed_lon = 360 - fixed_lon * -1;
		}

		if (fixed_lat >  90) fixed_lat =  90;
		if (fixed_lat < -90) fixed_lat = -90;


		fixed_lon = util.round_to4decimalPlaces(fixed_lon);
		fixed_lat = util.round_to4decimalPlaces(fixed_lat);

		// console.log("*onCameraRotated_withMouse lon:" + fixed_lon + "°  lat:" + fixed_lat + "°" );
		// onRotateCamera(fixed_lon, fixed_lat);
		onRotateCamera(fixed_lat, fixed_lon);
	}


	//------------------------------------------

	function init() {

		var container, mesh;

		container = document.getElementById('container');

		camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);
		camera.target = new THREE.Vector3(0, 0, 0);

		scene = new THREE.Scene();

		var geometry = new THREE.SphereGeometry(500, 60, 40);
		geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

		material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(CONFIG.first_panoramicPhoto_URL)
		});

		mesh = new THREE.Mesh(geometry, material);

		scene.add(mesh);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		container.addEventListener('mousedown', onMouseDown, false);
		container.addEventListener('mousemove', onMouseMove, false);
		container.addEventListener('mouseup', onMouseUp, false);
		container.addEventListener('mousewheel', onMouseWheel, false);
		container.addEventListener('DOMMouseScroll', onMouseWheel, false);

		container.addEventListener('touchstart', onMouseDown, false);
		container.addEventListener('touchmove', onMouseMove, false);
		container.addEventListener('touchend', onMouseUp, false);

		window.addEventListener('resize', onWindowResize, false);

	}






	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}






	function onMouseDown(event) {

		event.preventDefault();

		isUserInteracting = true;

		//スマホの場合
		if (event.touches) var event = event.touches[0];

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}



	function onMouseMove(event) {

		if (isUserInteracting) {


			//スマホの場合
			if (event.touches) var event = event.touches[0];

			var mouseMoveY = (event.clientY - onPointerDownPointerY);
			var mouseMoveX = (onPointerDownPointerX - event.clientX);

			if (CONFIG.direction.vertical == "negative")
				lat = mouseMoveY * -0.1 + onPointerDownLat;
			else
				lat = mouseMoveY * 0.1 + onPointerDownLat;

			if (CONFIG.direction.horizontal == "left")
				lon = mouseMoveX * -0.1 + onPointerDownLon;
			else
				lon = mouseMoveX * 0.1 + onPointerDownLon;

			// added
			onCameraRotated_withMouse(lon, lat);
		}
	}




	function onMouseUp(event) {
		isUserInteracting = false;
	}


	function onMouseWheel(event) {

		// WebKit

		if (event.wheelDeltaY) {

			fov -= event.wheelDeltaY * 0.05;

			// Opera / Explorer 9

		} else if (event.wheelDelta) {

			fov -= event.wheelDelta * 0.05;

			// Firefox

		} else if (event.detail) {

			fov += event.detail * 1.0;

		}

		camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
		render();

	}





	function animate() {

		requestAnimationFrame(animate);
		render();

	}

	function render() {

		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.Math.degToRad(90 - lat);
		theta = THREE.Math.degToRad(lon);

		camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
		camera.target.y = 500 * Math.cos(phi);
		camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

		camera.lookAt(camera.target);

		/*
				// distortion
				camera.position.x = - camera.target.x;
				camera.position.y = - camera.target.y;
				camera.position.z = - camera.target.z;
				*/

		renderer.render(scene, camera);
	}



	return API;
}