function initSettingView(onClickConnect) {

	var $behindSheet;
	var $settingArea;



	$(function() {
		$("#js_wsUri").val(CONFIG.webSocket_URI);

		$behindSheet = $("#SheetBehindModal");
		$settingArea = $("#settingArea");
		$photoSelectView = $("#photoSelectView");

		$("#settingButton").click(showSettingView);
		$("#photoButton").click(showPhotoSelectView);

		initDirectionSettingView()
	});



	function initDirectionSettingView() {
		var radioList = document.getElementsByClassName("js_direction_radio");

		var ver_posi = radioList[0];
		var ver_nega = radioList[1];
		var hor_right = radioList[2];
		var hor_left = radioList[3];

		if (CONFIG.direction.vertical == "positive"){
			$(ver_posi).attr("checked", true );
			$(ver_nega).attr("checked", false );
		}
		if (CONFIG.direction.vertical == "negative"){
			$(ver_posi).attr("checked", false );
			$(ver_nega).attr("checked", true );
		}
		if (CONFIG.direction.horizontal == "right"){
			$(hor_right).attr("checked", true );
			$(hor_left).attr("checked", false );
		}
		if (CONFIG.direction.horizontal == "left"){
			$(hor_right).attr("checked", false );
			$(hor_left).attr("checked", true );
		}
	}
	$(".js_direction_radio").click(function(e){
		var vertical_or_horizontal = e.target.name;
		var direction = e.target.value;
		CONFIG.direction[vertical_or_horizontal] = direction;
		console.log(CONFIG.direction)
	});



	$("#js_connect_button").click(function(){
		var uri = $("#js_wsUri").val();
		onClickConnect(uri);
	});


	function showPhotoSelectView() {
		$behindSheet.fadeIn(300);
		$photoSelectView.addClass("show");
		$behindSheet.click(hidePhotoSelectView);
	}
	function hidePhotoSelectView() {
		$behindSheet.fadeOut(300);
		$photoSelectView.removeClass("show");
	}

	function showSettingView() {
		$behindSheet.fadeIn(300);
		$settingArea.addClass("show");
		$behindSheet.click(hideSettingView);
	}
	function hideSettingView() {
		$behindSheet.fadeOut(300);
		$settingArea.removeClass("show");
	}
}