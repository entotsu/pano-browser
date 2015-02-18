function init_DropFile_and_LoadFile(onGetImageOrVideo) {

	function onChangeFileInput(e) {
		onGetFile(e.target.files[0]);
	}
	function onDropFile(e) {
		//デフォルトのイベントキャンセルしないとブラウザでイメージが表示されてしまう
		cancelEvent(e);

		onGetFile(e.dataTransfer.files[0]);
	}


	function onGetFile(file) {
		if (!file.type.match('image.*')) {
			if (!file.type.match('video.*')) {
				alert('supported only image or video.');
				return null;
			}
		}
		onGetImageOrVideo(file);
	}



	function cancelEvent(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var droppableArea = document.body;
	droppableArea.addEventListener('dradenter', cancelEvent);
	droppableArea.addEventListener('dragover', cancelEvent);
	droppableArea.addEventListener('drop', onDropFile);

	var fileInput = document.getElementById("fileInput");
	fileInput.addEventListener('change', onChangeFileInput);
}