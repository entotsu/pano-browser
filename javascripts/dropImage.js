
function enableDragAndDropImage(onDropImageFile) {


	function onDropFile(e) {
		//デフォルトのイベントキャンセルしないとブラウザでイメージが表示されてしまう
		cancelEvent(e);

		//単一ファイルの想定
		var file = e.dataTransfer.files[0];
		if (!file.type.match('image.*')) {
			if (!file.type.match('video.*')) {
				alert('supported only image or video.');
				cancelEvent(e);
			}
		}

		onDropImageFile(file);
	}


	function cancelEvent(e) {
		e.preventDefault();
		e.stopPropagation();
	}


	// var droppableArea = document.getElementById('container');
	var droppableArea = document.body;
	droppableArea.addEventListener('dradenter', cancelEvent);
	droppableArea.addEventListener('dragover', cancelEvent);
	droppableArea.addEventListener('drop', onDropFile);
}