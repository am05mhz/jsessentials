(function(){
	'use strict';
	
	if (!Array.from){
		Array.from = [].splice.call;
	}
	
	var oriMin = Math.min,
		oriMax = Math.max;
	
	Math.min = function(){
		var arr = [];
		if (arguments.length > 1){
			arr = arguments;
		} else if (arguments.length == 1){
			if (x_x.isVarTypeOf(arguments[0], Array)){
				arr = arguments[0];
			} else {
				arr.push(arguments[0]);
			}
		}
		return oriMin.apply(Math, arr);
	}
	Math.max = function(){
		var arr = [];
		if (arguments.length > 1){
			arr = arguments;
		} else if (arguments.length == 1){
			if (x_x.isVarTypeOf(arguments[0], Array)){
				arr = arguments[0];
			} else {
				arr.push(arguments[0]);
			}
		}
		return oriMax.apply(Math, arr);
	}
	Math.median = function(){
		var arr = [];
		if (arguments.length > 1){
			arr = arguments;
		} else if (arguments.length == 1){
			if (x_x.isVarTypeOf(arguments[0], Array)){
				if (arguments[0].length > 0){
					arr = arguments[0];
				} else {
					return Infinity;
				}
			} else {
				arr.push(arguments[0]);
			}
		} else {
			return Infinity;
		}
		arr.sort();
		var middle = Math.floor(arr.length / 2);
		return (arr.length % 2) ? arr[middle] : (arr[middle - 1] + arr[middle]) / 2;
	}
	Math.mean = function(){
		var arr = [];
		if (arguments.length > 1){
			arr = arguments;
		} else if (arguments.length == 1){
			if (x_x.isVarTypeOf(arguments[0], Array)){
				if (arguments[0].length > 0){
					arr = arguments[0];
				} else {
					return Infinity;
				}
			} else {
				arr.push(arguments[0]);
			}
		} else {
			return Infinity;
		}
		var total = 0;
		for(var i = 0; i < arr.length; i++){
			total += arr[i];
		}
		return total / arr.length;
	}
	Math.avg = Math.mean;
	Math.range = function(){
		var arr = [];
		if (arguments.length == 1){
			arr = arguments[0];
		} else {
			arr = Array.from(arguments);
		}
		return Math.max(arr) - Math.min(arr);
	}
})();

(function(obj, container){
	'use strict';
	
	var errand = function(args){
		if (!this.parse(args)){
			throw new Error('Invalid arguments');
		}

		var arr = this.serialize(this.data);
		if (arr.length > 0){
			if (this.method !== 'get'){
				this.formData = arr.join('&');
			} else {
				this.url += (this.url.indexOf('?') != -1) ? '&' : '?' + arr.join('&');
			}
		}
		
		this.setXhr();
	};

	errand.methods = ['get', 'post', 'put', 'delete'];

	errand.prototype.serialize = function(data, varName){
		var arr = [];
		var vName;
		for (var key in data){
			if (varName == '' || varName == undefined){
				vName = key;
			} else {
				vName = varName + '[' + key + ']';
			}
			if (x_x.isVarTypeOf(data[key], Array) || x_x.isVarTypeOf(data[key], Object)){
				arr = arr.concat(this.serialize(data[key], vName));
			} else {
				arr.push(vName + '=' + data[key]);
			}
		}
		return arr;
	}

	errand.prototype.parse = function(args){
		if (x_x.isVarTypeOf(args, String)){
			args = {
				url: args
			};
		}
		
		if (!x_x.isVarTypeOf(args, Object)){ return; }
		if (!x_x.isVarTypeOf(args.url, String)){ return; }
		
		this.url = args.url;
		this.method = 'get';
		this.json = false;
		this.data = {};
		this.formData = null;

		if (x_x.isVarTypeOf(args.method, String)){
			args.method = args.method.toLowerCase();
			if (errand.methods.indexOf(args.method) != -1){
				this.method = args.method;
			}
		}
		if (args.json){
			this.json = true;
		}
		if (x_x.isVarTypeOf(args.data, Object)){
			this.data = args.data;
		}
		if (x_x.isVarTypeOf(args.headers, Object)){
			this.headers = args.headers;
		} else {
			this.headers = {};
		}

		return true;
	};

	errand.prototype.setXhr = function(){
		this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		this.xhr.json = this.json;

		this.cancel = function(fn){
			this.xhr.abort();
			return this;
		};

		this.xhr.callbacks = {
			success: [],
			error: []
		};

		for (var name in this.xhr.callbacks){
			this[name] = function(name){
				return function(fn){
					this.xhr.callbacks[name].push(fn);
					return this;
				};
			}(name);
		}

		this.xhr.call = function(category, result){
			for (var i = 0; i < this.callbacks[category].length; i++){
				if (x_x.isVarTypeOf(this.callbacks[category][i], Function)){
					this.callbacks[category][i](result);
				}
			}
		};

		this.xhr.onreadystatechange = function(){
			if (this.readyState == 4){
				var func = 'error', reply = {status: this.status, message: 'unknown', response: this.responseText};
				switch (this.status){
					case 200:
						var result = this.responseText;
						if (this.json){
							try{
								result = JSON.parse(result);
							} catch (error){
								reply.message = 'invalid json';
								this.call(func, reply);
								return false;
							}
						}
						func = 'success';
						reply = result;
						break;
					case 400:
						reply.message = 'bad request';
						break;
					case 401:
						reply.message = 'unauthorized';
						break;
					case 403:
						reply.message = 'forbidden';
						break;
					case 404:
						reply.message = 'not found';
						break;
					case 500:
						reply.message = 'internal server error';
						break;
					case 502:
						reply.message = 'bad gateway';
						break;
					case 504:
						reply.message = 'gateway timeout';
						break;
				}
				this.call(func, reply);
			}
		};

		this.xhr.open(this.method, this.url, true);
		this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		if (this.headers){
			for (header in this.headers){
				this.xhr.setRequestHeader(header, this.headers[header]);
			}
		}

		this.xhr.send(this.formData);
	};
	
	var essentials = function(elm){
		if (x_x.isVarTypeOf(elm, String)){
			elm = document.querySelectorAll(elm);
			if (!elm.forEach){
				elm = Array.from(elm);
			}
		} else if (!x_x.isVarTypeOf(elm, Array)){
			elm = [elm];
		}

		var self = this;

		return {
			on: function(ev, fn, args){
				elm.forEach(function(val, key){
					self._on(val, ev, fn, args);
				})
				return this;
			},
			hasClass: function(name){
				if (elm.length == 1){
					return Array.from(elm[0].classList).indexOf(name) > -1;
				} else if (elm.length > 1){
					var ctr = 0;
					elm.forEach(function(val, key){
						ctr += Array.from(elm[0].classList).indexOf(name) > -1 ? 1 : 0;
					})
					return {hit: ctr, total: elm.length};
				}
				return false;
			},
			addClass: function(name){
				elm.forEach(function(val, key){
					self._addClass(val, name);
				})
				return this;
			},
			removeClass: function(name){
				elm.forEach(function(val, key){
					self._removeClass(val, name);
				})
				return this;
			},
			css: function(styles){
				elm.forEach(function(val, key){
					try{
						x_x.extends(val.style, styles);
					} catch(ex){

					}
				})
				return this;
			},
			first: function(){
				return this.nth(1);
			},
			last: function(){
				return this.nth(elm.length);
			},
			nth: function(idx){
				if (elm.length >= idx){
					elm = [elm[idx - 1]];
				} else if (elm.length < idx){
					elm = []
				}
				return this;
			},
			toDOM: function(){
				return elm.length == 1 ? elm[0] : elm;
			}
		};
	};

	essentials.readyList = [];
	essentials.readyFired = false;
	essentials.readyEventHandlersInstalled = false;
	
	essentials.prototype.ready = function(){
		if (!essentials.readyFired){
			essentials.readyFired = true;
			for (var i = 0; i < essentials.readyList.length; i++){
				essentials.readyList[i].fn.call(window, essentials.readyList[i].args);
			}
			essentials.readyList = [];
		}
	};
	
	essentials.prototype.readyStateChange = function(){
		if (document.readyState === 'complete'){
			this.ready();
		}
	};

	essentials.prototype._on = function (elm, ev, fn, args){
		if (!x_x.isVarTypeOf(fn, Function)){
			throw new TypeError('callback for x_x.on() must be a function');
		}
		if (elm == window && ev == 'ready'){
			if (essentials.readyFired){
				setTimeout(function(){fn(args);}, 1);
				return;
			} else {
				essentials.readyList.push({fn: fn, args: args});
			}
			if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')){
				setTimeout(this.ready, 1);
			} else if (!essentials.readyEventHandlersInstalled){
				if (document.addEventListener){
					document.addEventListener('DOMContentLoaded', this.ready, false);
					window.addEventListener('load', this.ready, false);
				} else {
					document.attachEvent('onreadystatechange', this.readyStateChange);
					window.attachEvent('onload', this.ready);
				}
				essentials.readyEventHandlersInstalled = true;
			}
		} else if (elm.addEventListener){
			elm.addEventListener(ev, fn, false);
		} else {
			elm.attachEvent('on' + ev, fn);
		}
	}

	essentials.prototype._addClass = function(elm, name){
		elm.classList.add(name);
	}

	essentials.prototype._removeClass = function(elm, name){
		elm.classList.remove(name);
	}

	container[obj] = function(elm){
		return new essentials(elm);
	};

	container[obj].extends = Object.assign || function(target){
		for (var i = 1; i < arguments.length; i++){
			var source = arguments[i];
			for (var key in source){
				if (Object.prototype.hasOwnProperty.call(source, key)){
					target[key] = source[key];
				}
			}
		}
		return target;
	};
	
	container[obj].isVarTypeOf = function(_var, _type, loose){
		if (!loose){
			try {
				return _var.constructor === _type;
			} catch(ex){
				return _var == _type;
			}
		} else {
			try {
				switch(_var.constructor){
					case Number:
					case Boolean:
					case String:
					case Date:
					case Symbol:
					case Map:
					case Set:
					case Function:
					case RegExp:
						return _var.constructor === _type;
					case Error:
					case EvalError:
					case RangeError:
					case ReferenceError:
					case SyntaxError:
					case TypeError:
					case URIError:
						return (_type === Error ? Error : _var.constructor) === _type;
					case Array:
	                case Int8Array:
	                case Uint8Array:
	                case Uint8ClampedArray:
	                case Int16Array:
	                case Uint16Array:
	                case Int32Array:
	                case Uint32Array:
	                case Float32Array:
	                case Float64Array:
	                case NodeList:
	                    return (_type === Array ? Array : _var.constructor) === _type;
	                case Object:
	                default:
	                    return (_type === Object ? Object : _var.constructor) === _type;
				}
			} catch(ex){
				return _var == _type;
			}
		}
	};
	
	container[obj].errand = function(args){
		return new errand(args);
	};
})('x_x', window)
