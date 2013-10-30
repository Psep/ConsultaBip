/**
 * Función que ejecuta la acción del botón click
 * ejecutando la validación y posterior llamado
 * ajax a la api con json, reescribiendo si la
 * data es correcta un div con la información
 * respectiva en relación a la tarjeta bip!
 */
$("button").click(function() {
	if (validate()) {
		var data = "numberBip=";
		data += $.trim(document.getElementById("idTarjeta").value);

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

/**
 * Función que recibe la respuesta ajax
 * para luego procesarla y formatear el
 * div indicado.
 * 
 * @param {Object} ajaxResponse
 */
function successCallback(ajaxResponse) {
	var dataProcess = processObject(ajaxResponse);

	if (!dataProcess) {
		alert("No existe información asociada");
		return;
	}

	var aux	= 0;
	var html= "<article>";
	html	+= "<ul style='font-size: 1.1em;'><li type='disc'>Saldo correspondiente a la fecha indicada.</li></ul>";
	html 	+= "<table border='1' style='width: 100%;'>";
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
	html += "<br />";
	html += '<button id="volver" class="button" onclick="inicio();" style="color: rgb(255, 255, 255); background-color: rgb(77, 178, 39);">Volver</button>';
	html += "</article>";
	document.getElementById('divForm').innerHTML = html;
}

/**
 * Función que retorna a la web de inicio.
 */
function inicio(){
	window.location="index.html";
}

/**
 * Función que valida el objeto
 * json entregado como parámetro.
 * 
 * @param {Object} ajaxResponse
 */
function processObject(ajaxResponse) {
	if ( typeof ajaxResponse == "string")
		ajaxResponse = $.parseJSON(ajaxResponse);
	return ajaxResponse;
}

/**
 * Función que es llamada para el
 * error de la transacción ajax.
 */
function errorCallback() {
	alert("No existe información asociada, revise");
}

/**
 * Función que valida el campo del ID
 * de la tarjeta.
 */
function validate() {
	var id = document.getElementById("idTarjeta").value;

	if ($.trim(id) == "") {
		alert("Debe indicar Número de Tarjeta");
		return false;
	} else {
		return true;
	}
}