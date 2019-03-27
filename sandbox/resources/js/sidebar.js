$(document).ready(function() {
	$.getJSON("examples.json", function(json) {
		var keys = Object.keys(json);
		keys.forEach(function(element) {
			var a = document.createElement("p");
			a.className = "list-group-item list-group-item-action bg-light";
			a.id = element;
			a.innerHTML = json[element]["name"];
			$("#query-list").append(a);
			$("#" + element).click(function(e) {
				$.getJSON("examples.json", function(json) {
					$("#statements").val(json[element]["query"]);
					$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?example=' + element;
					window.history.pushState({ path: newurl }, '', newurl);
					document.getElementById('ascii-table').innerHTML = "";		
				});
			});
		});
	});
});