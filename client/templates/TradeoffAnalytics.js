/*******************************************************************************
 * IBM Confidential
 *  
 * Licensed Materials - Property of IBM
 *
 * AUS720140245C
 *
 * Â© Copyright IBM Corp. 2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 *******************************************************************************/
var taWasEverStarted = false; 
var taDev = false;

function TradeoffAnalytics(ops, parentNodeId) {
	//UTILITIES
	function getTaLibRoot(){
		for(var i=0; i<document.scripts.length; i++){
			var src = document.scripts[i].src;
			var index = src.indexOf("TradeoffAnalytics.js");
			if(index>=0){
				return src.substring(0, index);
			}
		}
	}
	function createCssLink(href, id) {
		var link;
		if (document.createStyleSheet) {// old IE
			link = document.createStyleSheet(href);
		} else {
			link = createDom("link", {
				href : href,
				rel : 'stylesheet',
				type : 'text/css'
			}, document.head);
		}
		if (id) {
			link.id = id;
		}
	}
	function createScriptLink(src, onload) {
		var head = document.getElementsByTagName('head')[0];
		var script = createDom("script", {
			src : src,
			onload : onload
		}, head);
		script.onreadystatechange = function() {// old IE
			if (script.readyState == 'loaded' || script.readyState == 'completed') {
				onload();
			}
		};
	}
	function createDom(elem, map, parent) {
		console.log("CREATE-DOM-ELEM: " + elem);
		console.log("CREATE-DOM-MAP: " + map);
		var e = document.createElement(elem);
		for ( var k in map) {
			e[k] = map[k];
		}
		parent.appendChild(e);
		return e;
	}
	function assert(cond, message){
		if(!cond){
			throw message;
		}
	}

	function xhr(url, method, headers, body, okCallback, errCallback, username, password) {
		[okCallback, errCallback].forEach(function(f){
			if(typeof(f)!="function"){
				throw "invalid callback function";
			}
		});
		var xmlhttp = new XMLHttpRequest();
//		xmlhttp.onload = okCallback;
//		xmlhttp.onerror = errCallback;
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					okCallback(xmlhttp.responseText);
				} else {
					var err = {message:xmlhttp.statusText, responseText:xmlhttp.responseText, status:xmlhttp.status};
					errCallback(err);
				}
			}
		};
		xmlhttp.open(method, url, true, username, password);
		for ( var att in headers) {
			xmlhttp.setRequestHeader(att, headers[att]);
		}
		
		xmlhttp.send(body);
	}

	
	assert(ops, "options argument was not provided");
	assert(typeof(ops.dilemmaServiceUrl)=="string", "Invalid \'dilemmaServiceUrl\' parameter. Expected value of type string.");
	assert((!ops.customCssUrl) || typeof(ops.customCssUrl) == "string", "Invalid \'customCssUrl\' parameter. Expected value of type string.");
	assert((!ops.errCallback) || typeof(ops.errCallback) == "function", "Invalid \'errCallback\' parameter. Expected value of type function.");
	assert((!ops.username) || typeof(ops.username) == "string","Invalid \'username\' parameter. Expected value of type string." );
	assert((!ops.password) || typeof(ops.password) == "string","Invalid \'password\' parameter. Expected value of type string." );
	assert((!ops.locale) || typeof(ops.locale) == "string","Invalid \'locale\' parameter. Expected value of type string." );
	
	var parentNode = document.getElementById(parentNodeId);
	var taLibRoot = getTaLibRoot();
	var locale = ops.locale || 'en';
	var self;
	if(ops.iframe == false){//default is with iframe. consuming app need to explicit set iframe=false to run the widget within the host page 
		self = {
			state: "created",
			start : function(callback) {
				assert(self.state == "created", "TradeoffAnalytics widget should be started once!");
				assert(typeof(callback)=="undefined" || typeof(callback)=="function", "\'callback\' is not a function");
				self.state = "starting";
				
				var dojoLib = taDev? "lib/dojo/" : "",
					idxLib= taDev ? "lib/" : "";
				function dojoConfig(){
					var packages = [
					        {name : "modmt",	location : taLibRoot+ "modmt"},
					        {name : "idx",		location : taLibRoot +idxLib+ "idx"}
					    ];
					if (!taDev) {
						packages = packages.concat([
			                { name : "dojo",	location :  taLibRoot+dojoLib+"dojo"},
							{ name : "dijit",	location :  taLibRoot+dojoLib+"dijit"},
							{ name : "dojox",	location :  taLibRoot+dojoLib+"dojox"}
			            ]);
					}
					
					return {packages: packages, parseOnLoad: false, useXDomain: true, async: false, locale: locale};
				}
				function getModmtScriptLink() { 
					if (taDev) {
						return dojoLib+"dojo/dojo.js";
					}
					return 'modmt/dojoIdxModmt.js';
				}
				function createWidget(){
					modmt.global.start(ops);
					modmt.global.setProxy(new modmt.proxy.DelegatorJsonProxy({dilemmaServiceUrl:ops.dilemmaServiceUrl, username: ops.username, password: ops.password}));
					
					var widgetNode = dojo.create("div", {}, parentNodeId);
					self._widget = new modmt.moov.MOOVWidget({errorCallback:ops.errCallback}, widgetNode);
					self._widget.startup();
					dojo.style(self._widget.domNode, {
						height:'100%',
						width: '100%'
					});

					self._resizeEventHandler = function() {
						self.resize();
					};
					window.addEventListener("resize",self._resizeEventHandler);
					
					self.state = "started";
					callback && callback();
				}
				function startMoov(){
					dojo.addClass(document.body, "moov"); 
					dojo.addClass(document.body, "oneui");
					
					dojo.require("modmt/moov/MOOVWidget");
					dojo.require("modmt/proxy/DelegatorJsonProxy");
					dojo.ready(function(){
						taWasEverStarted = true;
						createWidget();
					});
				}
				if(!taWasEverStarted){
					window.dojoConfig = dojoConfig();
		
					createCssLink(taLibRoot+dojoLib+"dijit/themes/dijit.css");
					createCssLink(taLibRoot+dojoLib+"dojox/grid/enhanced/resources/claro/EnhancedGrid.css");
					createCssLink(taLibRoot+dojoLib+"dojox/form/resources/RangeSlider.css");
					createCssLink(taLibRoot+idxLib+"idx/themes/oneui/oneui.css");
					createCssLink(ops.customCssUrl || taLibRoot+"modmt/styles/watson.css", "taTheme");
					createScriptLink(taLibRoot + getModmtScriptLink(), startMoov);
				}else{
					byId("taTheme").href = ops.customCssUrl || taLibRoot+"modmt/styles/watson.css";
					createWidget();
				}
			},
			show : function(problem, okCallback, doneCallback) {
				assert(self.state == "started", "TradeoffAnalytics widget should be started!");
				assert(typeof(problem) =="object");
				assert(typeof(okCallback)=="undefined" || typeof(okCallback)=="function", "\'okCallback\' is not a function");
				assert(typeof(doneCallback)=="undefined" || typeof(doneCallback)=="function", "\'doneCallback\' is not a function");
				
				doneCallback && dojo.connect(self._widget, "onSolutionChosen", doneCallback);
				self._widget.showProblem(problem, function() {
					okCallback && okCallback();
				});
			},
			
			destroy : function(callback){
				assert(self.state == "started", "TradeoffAnalytics widget should be started!");
				assert(typeof(callback)=="undefined" || typeof(callback)=="function", "\'callback\' is not a function");
				
				window.removeEventListener("resize",this._resizeEventHandler);
				self._widget.destroy();
				self.state = "destroyed";
				callback && callback();
			},
			
			resize: function(width, height) {
				assert(self.state == "started", "TradeoffAnalytics widget should be started!");
				assert(typeof(width)=="undefined" || typeof(width)=="number", "\'width\' provided but it is not a number (of pixels)");
				assert(typeof(height)=="undefined" || typeof(height)=="number", "\'height\' provided but it is not a number (of pixels)");
				
				if (width === null || width === undefined || height === null || height === undefined) {
					var parentNode = self._widget.domNode.parentNode;
					self._widget.resize({w: dojo.getStyle(parentNode,"width"), h: dojo.getStyle(parentNode,"height")});
				}
				else {
					self._widget.resize({w: width, h: height});
				}
			}
		}
	}
	else{
		self = {
			state: "created",
			start : function(callback) {
				assert(self.state == "created", "TradeoffAnalytics widget cannot be started!");
				self.state = "starting";
				var iframeLoaded = function() {
					var msg = {
						type : "start",
						content : {
							taLibRoot : taLibRoot,
							devMode : taDev,
							customCssUrl : ops.customCssUrl,
							profile : ops.profile,
							locale: locale
						}
					};
					self._postMessageToIframe(msg);
				};
		
				self.iframe = createDom("iframe", {
					//src : taLibRoot + "TradeoffAnalyticsIframe.html",
					src : "http://ta-cdn.mybluemix.net/TradeoffAnalyticsIframe.html",
					onload : iframeLoaded,
					id : parentNodeId + "_iframe"
				}, parentNode);
				self.iframe.style.border = 0;
				
				if (window.addEventListener) {
					window.addEventListener("message", self._receiveMessage, false);
				} else {
					window.attachEvent("onmessage", self._receiveMessage);
				}
				self._afterStarted = function(){// overrides
					callback && callback();
				}
			},
		
			show : function(problem, okCallback, doneCallback) {
				assert(self.state == "started", "TradeoffAnalytics was not started");
				var msg = {
					type : "show",
					content : {
						problem : problem
					}
				};
				self._postMessageToIframe(msg);
				self._afterShow = okCallback;// overrides
				self._afterDone = doneCallback;// overrides
			},
			resize: function(width, height) {
				assert(self.state == "started", "TradeoffAnalytics was not started");
				assert(typeof(width)=="undefined" || typeof(width)=="number", "\'width\' provided but it is not a number (of pixels)");
				assert(typeof(height)=="undefined" || typeof(height)=="number", "\'height\' provided but it is not a number (of pixels)");
			
				if(width!=undefined){
					self.iframe.style.width = ""+width+"px";
				}else{
					self.iframe.style.width = "100%";
				}
				if(height!=undefined){
					self.iframe.style.height = ""+height+"px";
				}else{
					self.iframe.style.height = "100%";
				}
			},
			_afterStarted : function() {	},// default
		
			_afterShow : function() {	},// default
		
			_afterDone : function() {	},// default
			
			destroy : function(callback){
				assert(self.state == "started", "TradeoffAnalytics was not started");
				self._postMessageToIframe({type:"destroy"});
				self._afterDestroy = function(){
					if (window.removeEventListener) {
						window.removeEventListener("message", self._receiveMessage, false);
					} else {
						window.detachEvent("onmessage", self._receiveMessage);
					}
					parentNode.removeChild( self.iframe);
					self.state = "destroyed";
					callback && callback();
				}
			},
			_postMessageToIframe : function(msg) {
				self.iframe.contentWindow.postMessage(msg, "*");
			},
			_receiveMessage : function(event) {
				if(["afterStarted", "dilemma", "afterShow", "afterDone", "afterDestroy", "afterError"].indexOf(event.data.type)<0){
					return;
				}
				console.info(event.data.type);
				switch (event.data.type) {
				case "afterStarted":
					assert(self.state == "starting");
					self.state = "started";
					self._afterStarted(event.data.content);
					break;
				case "dilemma":
					(function(){
						var reqNum = event.data.content.reqNum;
						var problem = event.data.content.problem;
						var okCallback = function(response){
							var respObj = JSON.parse(response);
							respObj.reqNum = reqNum;
							self._postMessageToIframe({type:"afterDilemma", content:respObj});
						};
						var errCallback = function(err){
							self._postMessageToIframe({type:"afterDilemmaError", content:{reqNum:reqNum, err: err}});
						};
						var headers = {"Content-Type" : "application/json; charset=utf-8"};
						xhr(ops.dilemmaServiceUrl, "POST", headers, JSON.stringify(problem), okCallback, errCallback, ops.username, ops.password);
					}())
					
					break;
				case "afterShow":
					self._afterShow(event.data.content);
					break;
				case "afterDone":
					self._afterDone(event.data.content);
					break;
				case "afterDestroy":
					self._afterDestroy(event.data.content);
					break;
				case "afterError":
					ops.errCallback(event.data.content);
					break;
				default:
//					console.info("ignored");
				}
			}
		}
	}
	return self;
};

