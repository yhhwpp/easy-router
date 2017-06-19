SPA_RESOLVE_INIT = function(transition) { 
	document.getElementById("content").innerHTML = document.getElementById('tpl_list').innerHTML;
	console.log("首页回调" + JSON.stringify(transition));
};