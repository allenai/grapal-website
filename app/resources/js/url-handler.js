$(document).ready(function() {
	autosize(document.querySelectorAll('textarea'));
	var query = getQueryStringValue("query");
	if (!(query === "")) {
		$("#statements").val(query);
		$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
	} else {
		var type = getQueryStringValue("example");
		var json = $.getJSON("examples.json", function(json) {
			$("#statements").val(json[type]["query"]);
			$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
			return false;
		});
	}
});
function getQueryStringValue (key) {  
		var stmt = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
		return stmt;
} 
