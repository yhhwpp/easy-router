 SPA_RESOLVE_INIT = function (transition) {
 	console.log(document.getElementById("index") || '无法显示');
 	document.getElementById("content").innerHTML = document.getElementById("tpl_home").innerHTML;
 	console.log(document.getElementById("index").innerHTML);
 };