$(document).ready(function() {
	autosize(document.querySelectorAll('textarea'));
	var query = getQueryStringValue("query");
	if (!(query === "")) {
		$("#statements").val(query);
		$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
	} else if (!(getQueryStringValue("example") == "")) {
		var type = getQueryStringValue("example");
		$.get("examples/" + type + ".cql", function(data) {
			$("#statements").val(data);
			$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
		});

	}
});

function getQueryStringValue (key) {  
	var stmt = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	return stmt;
} 
