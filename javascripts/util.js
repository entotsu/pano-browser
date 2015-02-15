(function(){


	window.util = {}

	//小数点４桁まで丸める
	util.round_to4decimalPlaces = function(num) {

	    //小数点の位置を4桁右に移動する
	    var num = num * 10000;

	    //四捨五入したあと、小数点の位置を元に戻す
	    num = Math.round(num) / 10000;

	    return num;
	};


	// Extention of String.split
	(function(){
	    var orgsplit = String.prototype.split;
	    String.prototype.split = function(arg){
	        if(typeof arg == "object"){
	            var ary = orgsplit.call(this,arg[0]);
	            for(var i=1;i<arg.length;i++){
	                for(var j=ary.length-1;j>=0;j--){
	                    ary[j] = orgsplit.call(ary[j],arg[i]);
	                    Array.prototype.splice.apply(ary,[j,1].concat(ary[j]));
	                }
	            }
	            return ary;
	        }else{
	            return orgsplit.call(this,arg);
	        }
	    };
	})();



	//---------------------------- specify user agent ----------------------------

	window.ua = {};
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