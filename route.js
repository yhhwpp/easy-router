(function () {
	var util = {
		//获取路由的路径和详细参数
		getParamsUrl: function () {
			var hashDeatail = location.hash.split("?"),
				hashName = hashDeatail[0].split("#")[1],
				params = hashDeatail[1] ? hashDeatail[1].split("&") : [],
				query = {};
			for (var i = 0; i < params.length; i++) {
				var item = params[i].split("=");
				query[item[0]] = item[1];
			}
			return {
				path: hashName,
				query: query
			};
		}
	};

	function spaRouters() {
		this.routers = {}; //保存注册的所有路由
		this.beforeFun = null; //切换前
		this.afterFun = null;
	}
	spaRouters.prototype = {
		init: function () {
			var self = this;
			window.addEventListener('load', function () {
				self.urlChange();
			});
			window.addEventListener('hashchange', function () {
				self.urlChange();
			});
			//异步引入js通过回调传递参数
			window.SPA_RESOLVE_INIT = null;
		},
		refresh: function (currentHash) {
			this.routers[currentHash.path].callback.call(self, currentHash);
		},
		//路由处理
		urlChange: function () {
			var currentHash = util.getParamsUrl();
			if (this.routers[currentHash.path]) {
				this.refresh(currentHash);
			} else {
				//不存在的地址重定向到首页
				location.hash = '/index';
			}
		},
		//单层路由注册
		map: function (path, callback) {
			path = path.replace(/\s*/g, ""); //过滤空格
			if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
				this.routers[path] = {
					callback: callback, //回调
					fn: null //存储异步文件状态
				};
			} else {
				console.trace('注册' + path + '地址需要提供正确的的注册回调');
			}
		},
		//路由异步懒加载js文件
		asyncFun: function (file, transition) {
			var self = this;
			if (self.routers[transition.path].fn) {
				self.routers[transition.path].fn(transition);
			} else {
				var _body = document.getElementsByTagName('body')[0];
				var scriptEle = document.createElement('script');
				scriptEle.type = 'text/javascript';
				scriptEle.src = file;
				scriptEle.async = true;
				SPA_RESOLVE_INIT = null;
				scriptEle.onload = function () {
					self.routers[transition.path].fn = SPA_RESOLVE_INIT;
					self.routers[transition.path].fn(transition);
				};
				_body.appendChild(scriptEle);
			}
		},
		//同步操作
		syncFun: function (callback, transition) {
			callback && callback(transition);
		}

	};
	//注册到window全局
	window.spaRouters = new spaRouters();
})();