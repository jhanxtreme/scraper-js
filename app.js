'use strict';

var JX_APP = JX_APP || function(){};
var ez = new JX_APP();

JX_APP.prototype.ajax = function(obj, cb){
	var xhr;

	function _getXMLHttpRequest(){
		try{
			return new XMLHttpRequest();
		}catch(e){
			try{
				return new ActivetXObject('Microsoft.XMLHTTP');
			}catch(e){
				try{
					return ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
				}catch(e){
					try{
						return ActiveXObject( 'Msxml2.XMLHTTP.3.0' );
					}catch(e){
						try{
							return ActiveXObject( 'Msxml2.XMLHTTP' );
						}catch(e){
							throw new "Your current browser does not support XMLHttpRequest";
						}
					}
				}
			}
		}
	}

	function _readyState(obj){
		var method = obj.method.toLowerCase();
		if(method!=='get' && method!=='post'){
			throw new "Invalid method call for AJAX";
		}
		if(obj.url===undefined){
			throw new "Invalid request URL for AJAX";
		}
		if(typeof obj.result!=='function' || obj.result===undefined){
			throw new "Missing callback function";
		}
		if(typeof obj.async!=='boolean'){
			obj.async = true;
		}
		xhr.onreadystatechange = function(){
			if(xhr.readyState===4){
				obj.result({
					statusCode: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText,
					response: xhr.response
				});
			}
		}

		xhr.open(obj.method, obj.url, obj.async);
		if(obj.dataRequest!==undefined && obj.dataRequest.length>0){
			xhr.send(obj.dataRequest);
		}else{
			xhr.send();
		}
	}

	xhr = _getXMLHttpRequest();

	_readyState(obj);

}//end ajax


JX_APP.prototype.scrape = function(obj){

	function __trim(a){
		return a.replace(/[\s\n]{2,}/g, ' ');
	}
	function __getHTMLAttributes(arrAttributes){
		var attr = [];
		if(arrAttributes.length>0){
			for(var j=0, m=arrAttributes.length, _attributes=arrAttributes; j<m; j++){
				if(!/href|src/g.test(_attributes[j].split('=')[0])){
					attr.push(_attributes[j]);
				}
			}
		}
		return attr;
	}

	var data = __trim(obj.data);
	var extract = {
		links : function(){
			var LINKS = data.match(/<a[^\r\n]+?>.+?<\/a>/g) || [];
			var results = [];
			for(var i=0, n=LINKS.length;i<n; i++){
				//push the results
				results.push({
					link : LINKS[i].match(/(?:href=[\"\'])(.+?)(?:[\"\'])/)[1],
					tag: LINKS[i],
					content: LINKS[i].match(/(?:<a.+?>(.+?)<\/a>)/)[1],
					attributes: __getHTMLAttributes(LINKS[i].match(/(\w+=('|").+?('|"))/g))
				});
			}
			return results;
		},
		images: function(){
			var IMAGES = data.match(/<img.+?\/?>/g) || [];
			var results = [];
			for(var i=0, n=IMAGES.length;i<n; i++){
				results.push({
					link : IMAGES[i].match(/(?:src=[\"\'])(.+?)(?:[\"\'])/)[1],
					tag: IMAGES[i],
					attributes: __getHTMLAttributes(IMAGES[i].match(/(\w+=('|").+?('|"))/g))
				});
			}
			return results;
		}
	}

	obj.results({
		getLinks: extract.links(),
		getImages: extract.images()
	});

}

