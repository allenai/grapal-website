function load(items) {
    var output = AsciiTable.table(items)
    document.getElementById('ascii-table').innerHTML = output
 }

 function handleDownload(data) {
	data =  JSON.stringify(data);
	var url = URL.createObjectURL( new Blob( [data], {type:'text/json'} ) );
    $("#download").attr("href", url);
    $("#download").css("display", "");
 }

(function($){
    function processForm( e ){
    	document.getElementById('ascii-table').innerHTML = "loading...";
    	document.getElementById("response").innerHTML = "";
    	var stmt = $("#statements")[0]['value'].split("\"").join("\'");
    	stmt = stmt.split("\n").join(" ");
    	stmt = stmt.split("\t").join(" ");
    	stmt = stmt.split("\r").join(" ");
    	$.ajax({
		    type: "POST",
		    url: "https://grapal.allenai.org:7473/db/data/transaction/commit",
		    dataType: "json",
		    contentType: "application/json;charset=UTF-8",
		    data: "{\"statements\": [{\"statement\": \"" + stmt +"\"}]}",
		    success: function (data, textStatus, jqXHR) {
		    	let errors = data['errors'];
		    	if (errors.length > 0) {
		    		let headers = ["code", "message"];
		    		let body =[];
		    		body.push(errors[0]['code']);
		    		body.push(errors[0]['message']);
		    		load([headers, body]);
		    		handleDownload([headers, body]);
		    	} else {
			    	let res = data['results'][0]['data'];
					let final = [];
					final.push(data['results'][0]['columns'])
			    	for (var i = 0; i < res.length; i++) {
						final.push(res[i]['row']);
			    	}
			    	load(final);
			    	handleDownload(data['results'][0]);
			    }
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    	console.log(textStatus);
		        console.log(errorThrown);
		        console.log(jqXHR);
		    }
		});
        e.preventDefault();
    }
    $('#query-form').submit(processForm);
})(jQuery);

document.getElementById("statements").addEventListener("keydown", function(event) {
	if (event.keyCode === 13 && event.metaKey) {
		event.preventDefault();
		document.getElementById("submit").click();
	}
});

$(document).ready(function() {
    $("#copy").click(function(){
		var copyText = document.getElementById("statements");
		copyText.select();
		document.execCommand("copy");
		if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
	}); 
});

$("#statements").on("change keyup paste", function() {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?query=' + $("#statements")[0]['value'].split("\n").join(" ");
	window.history.pushState({ path: newurl }, '', newurl);
	if ($("#statements")[0]['value'] === "")  {
		$('#ascii-table').empty();
		$("#download").css("display", "none");
	}
});
