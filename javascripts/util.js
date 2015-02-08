
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


})();
