$(document).ready(function() {
	autosize(document.querySelectorAll('textarea'));
	var query = getQueryStringValue("query");
	if (!(query === "")) {
		$("#statements").val(query);
		$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
	} else if (!(getQueryStringValue("example") == "")) {
		var type = getQueryStringValue("example");
		var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "/examples/" + type + ".cql";
		$.get(url, function(data) {
			$("#statements").val(data);
			$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
		});

	}
});

function getQueryStringValue (key) {  
	var stmt = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	return stmt;
} 
