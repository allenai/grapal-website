var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "/examples";
console.log(url);
$.get(url, function(data) {
   $(data).find("li > a").each(function() {
   		var fileName = $(this).attr("href");
		if (!(fileName == "/app//")) {
			var a = document.createElement("p");
			a.className = "list-group-item list-group-item-action bg-light";
			var a_id = fileName.replace(".cql", "");
			a.id = a_id;
			a.innerHTML = format_sidebar_strs(a_id);
			$("#query-list").append(a);
			$("#" + a_id).click(function(e) {
				$.get(url + "/" + fileName, function(data) {
					$("#statements").val(data);
					$("#statements").css("height",($("#statements")[0].scrollHeight) + "px");
					var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?example=' + a_id;
					window.history.pushState({ path: newurl }, '', newurl);
					document.getElementById('ascii-table').innerHTML = "";
				});
			});
		}
    });
});

function format_sidebar_strs(data) {
	data = data.charAt(0).toUpperCase() + data.slice(1);
	return data.replace("_", " ");
}