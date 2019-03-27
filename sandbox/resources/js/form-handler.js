function load(items) {
    var output = AsciiTable.table(items)
    document.getElementById('ascii-table').innerHTML = output
    console.log(output)
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
		    	console.log(data);
		    	let errors = data['errors'];
		    	console.log(errors);
		    	if (errors.length > 0) {
		    		let headers = ["code", "message"];
		    		let body =[];
		    		body.push(errors[0]['code']);
		    		body.push(errors[0]['message']);
		    		load([headers, body]);
		    	} else {
			    	let res = data['results'][0]['data'];
			    	console.log(data);
					let final = [];
					final.push(data['results'][0]['columns'])
			    	for (var i = 0; i < res.length; i++) {
						final.push(res[i]['row']);
			    	}
			    	load(final);
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