// /*
 // * The following code checks if the app is already installed on the device.
 // * If it's not it displays a button which you can press to install the app.
 // */
// if (navigator.mozApps) {
	// // check if the app is installed
	// var checkIfInstalled = navigator.mozApps.getSelf();
	// checkIfInstalled.onsuccess = function() {
		// if (checkIfInstalled.result) {
			// // the app is already installed so we don't need to display the
			// // installation instructions.
			// var installationInstructions = document.querySelector("#installation-instructions");
			// if (installationInstructions) {
				// installationInstructions.style.display = "none";
			// }
		// } else {
			// // the app is not yet install, so we show the install instructions and the
			// // install button. If the user clicks on it (once again, we use the "onclick" event
			// // to connect the button with an action) the app gets installed. If the installation
			// // is successful, the install instructions are hidden.
			// var install = document.querySelector("#install"), manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
// 
			// install.className = "show-install";
			// // connect the click on the button with the installation
			// install.onclick = function() {
				// // install the app
				// var installApp = navigator.mozApps.install(manifestURL);
				// installApp.onsuccess = function(data) {
					// // if the installation was successful, we hide the install instructions
					// install.style.display = "none";
				// };
				// installApp.onerror = function() {
					// // there was an error while installing the app, we display a warning window
					// alert("Install failed\n\n:" + installApp.error.name);
				// };
			// };
		// }
	// };
// }

/**
 * Función del slide menu principal
 */
$(function() {
	$('#menu').mmenu({
		onClick : {
			blockUI : false,
			preventDefault : function() {
				return this.rel != 'external';
			}
		}
	}, {
		pageSelector : 'div[data-role="page"]:first'
	});

	$('#menu a[rel!="external"]').on('click', function() {
		var _t = this;
		$('#menu').one('closed.mm', function() {
			window.location = _t.href;
			
			$.mobile.changePage(_t.href, {
				transition : 'slide', 
				reloadPage: true,
				allowSamePageTransition: true
			});
		});
	});
});

/**
 * Función que permite los enlaces externos
 * en el menú.
 */
$(document).on('pageshow', function(e, ui) {
	$('#menu').trigger('setPage', [$(e.target)]);
	$('#menu a').each(function() {
		if ($.mobile.path.parseUrl(this.href).href == window.location.href) {
			$(this).trigger('setSelected.mm');
		}
	});
});

/**
 * Función que ejecuta la acción del botón click
 * ejecutando la validación y posterior llamado
 * ajax a la api con json, reescribiendo si la
 * data es correcta un div con la información
 * respectiva en relación a la tarjeta bip!
 */
$("#consultar").click(function() {
	var id = parsedId();

	if (id > 0) {
		var data = "numberBip=";
		data += id;

		try {
			$(document).ajaxStart($.blockUI({
				centerX : 1,
				centerY : 1,
				css : {
					border : 'none',
					padding : '15px',
					backgroundColor : '#000',
					opacity : .5,
					color : '#F9F9F9'
				},
				message : '<h1>Espere</h1>'
			})).ajaxStop($.unblockUI);

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

	var aux = 0;
	var html = "<article>";
	html += "<ul style='font-size: 1em;'><li type='disc'>Saldo correspondiente a la fecha indicada.</li></ul>";
	html += '<table style="width: 100%;">';
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
	html += '<div class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" data-disabled="false" aria-disabled="false">';
	html += '<span class="ui-btn-inner"><span class="ui-btn-text">Ir al Inicio</span></span>';
	html += '<button class="ui-btn-hidden" data-disabled="false"  onclick="inicio();">Ir al Inicio</button></div>';
	html += "</article>";
	document.getElementById('divForm').innerHTML = html;
}

/**
 * Función que retorna a la web de inicio.
 */
function inicio() {
	window.location = "index.html";
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
 * de la tarjeta, retornándolo como entero
 */
function parsedId() {
	var id = parseInt($("#idTarjeta").val());

	if (isNaN(id) || id == 0) {
		alert("Debe indicar Número de Tarjeta válido");
		$("#idTarjeta").val("");
		return 0;
	} else {
		return id;
	}
}

/**
 * Para efectos de entrada de datos de favoritos
 * @param {Object} idTarjeta
 */
function loadData(idTarjeta) {
	var id = parseInt(idTarjeta);

	if (!isNaN(id) && id > 0) {
		var data = "numberBip=";
		data += id;

		try {
			$(document).ajaxStart($.blockUI({
				centerX : 1,
				centerY : 1,
				css : {
					border : 'none',
					padding : '15px',
					backgroundColor : '#000',
					opacity : .5,
					color : '#F9F9F9'
				},
				message : '<h1>Espere</h1>'
			})).ajaxStop($.unblockUI);

			$.ajax({
				type : 'GET',
				dataType : 'json',
				url : 'http://www.psep.cl/api/Bip.php?',
				data : data,
				success : successCallback2,
				error : errorCallback

			});
		} catch(e) {
			alert(e.description);
		}

	}
}

/**
 * Función que redirige a favoritos
 */
function irFavoritos() {
	window.location = "favoritos.html";
}


/**
 * Para efectos de favoritos
 * @param {Object} ajaxResponse
 */
function successCallback2(ajaxResponse) {
	var dataProcess = processObject(ajaxResponse);

	if (!dataProcess) {
		alert("No existe información asociada");
		return;
	}

	var aux = 0;
	var html = "<article>";
	html += "<ul style='font-size: 1em;'><li type='disc'>Saldo correspondiente a la fecha indicada.</li></ul>";
	html += '<table style="width: 100%;">';
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
	html += '<div class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" data-disabled="false" aria-disabled="false">';
	html += '<span class="ui-btn-inner"><span class="ui-btn-text">Volver a Favoritos</span></span>';
	html += '<button class="ui-btn-hidden" data-disabled="false" onclick="irFavoritos();">Volver a Favoritos</button></div>';
	html += "</article>";
	document.getElementById('divFavorito').innerHTML = html;
}