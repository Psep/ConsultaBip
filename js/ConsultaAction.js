$("button").click(function() {
	if (validate()) {
		var data = "numberBip=";
		data += document.getElementById("idTarjeta").value;

		try {
			$.ajax({
				type : 'GET',
				dataType : 'json',
				url : 'http://www.psep.cl/api/Bip.php?',
				data : data,
				success : successCallback,
				error : errorCallback

			});
		} catch(e) {
			alert(e.description);
		}

	}
});

function successCallback(ajaxResponse) {
	var dataProcess = processObject(ajaxResponse);

	if (!dataProcess) {
		alert("No existe información asociada");
		return;
	}

	var aux = 0;
	var html= "<table border='1' style='width: 100%;'>";
	for (var i in dataProcess) {
		var obj = dataProcess[i];

		switch(aux) {
			case 0: 
				html += "<tr><td>Número Tarjeta</td>";
				html += "<td>";
				html += obj;
				html += "</td></tr>";
				break;
			case 1:
				html += "<tr><td>Estado Contrato</td>";
				html += "<td>";
				html += obj;
				html += "</td></tr>";
				break;
			case 2:
				html += "<tr><td>Saldo Tarjeta</td>";
				html += "<td>";
				html += obj;
				html += "</td></tr>"; 
				break;
			case 3:
				html += "<tr><td>Fecha Saldo</td>";
				html += "<td>";
				html += obj;
				html += "</td></tr>";
				break;
		}
		aux++;
	}
	
	html += "</table>";
	document.getElementById('divForm').innerHTML = html;
}

function processObject(ajaxResponse) {
	if ( typeof ajaxResponse == "string")
		ajaxResponse = $.parseJSON(ajaxResponse);
	return ajaxResponse;
}

function errorCallback() {
	alert("No existe información asociada, revise");
}

function validate() {
	var id = document.getElementById("idTarjeta").value;

	if (id == "") {
		alert("Debe indicar Número de Tarjeta");
		return false;
	} else {
		return true;
	}
}