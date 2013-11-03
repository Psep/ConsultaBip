/**
 * Se comprueba si el navegador soporta IndexedDB
 */
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
	document.getElementById('divFavorito').innerHTML = '<p><h1>Lamentablemente tu navegador no soporta esta funcionalidad.</h1></p>';
}


/**
 * Carga de datos
 */
$(function() {
	// Display the todo items.
	todoDB.open(refreshTodos);

	$("#addNumber").click(function() {
		var item = 0;
		var id = $.trim($("#new-todo").val());
		item = parseInt(id);

		if (!isNaN(item) && item > 0) {
			todoDB.createTodo(item, function(todo) {
				refreshTodos();
			});
			alert("Tarjeta N°" + item + " agregada.");
		} else {
			alert("Ingrese un número válido");
		}
		$("#new-todo").val("");
	});

});

// Update the list of todo items.
function refreshTodos() {
	todoDB.fetchTodos(function(todos) {
		var todoList = document.getElementById('todo-items');
		todoList.innerHTML = '';

		for (var i = 0; i < todos.length; i++) {
			//TODO Read the todo items backwards (most recent first).
			var todo = todos[(todos.length - 1 - i)];

			var li = document.createElement('li');
			li.className = "li-matic";
			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.className = "todo-checkbox";
			checkbox.setAttribute("data-id", todo.timestamp);

			li.appendChild(checkbox);

			var span = document.createElement('span');
			span.className = "todo-span";
			span.setAttribute("onclick", "loadData(" + todo.text + ");");
			span.innerHTML = todo.text;

			li.appendChild(span);

			todoList.appendChild(li);

			// Setup an event listener for the checkbox.
			checkbox.addEventListener('click', function(e) {
				var id = parseInt(e.target.getAttribute('data-id'));

				todoDB.deleteTodo(id, refreshTodos);
			});
		}

	});
}

/**
 * IndexedDB Connect
 */
var todoDB = ( function() {
		var tDB = {};
		var datastore = null;

		/**
		 * Open a connection to the datastore.
		 */
		tDB.open = function(callback) {
			// Database version.
			var version = 1;

			// Open a connection to the datastore.
			var request = indexedDB.open('todos', version);

			// Handle datastore upgrades.
			request.onupgradeneeded = function(e) {
				var db = e.target.result;

				e.target.transaction.onerror = tDB.onerror;

				// Delete the old datastore.
				if (db.objectStoreNames.contains('todo')) {
					db.deleteObjectStore('todo');
				}

				// Create a new datastore.
				var store = db.createObjectStore('todo', {
					keyPath : 'timestamp'
				});
			};

			// Handle successful datastore access.
			request.onsuccess = function(e) {
				// Get a reference to the DB.
				datastore = e.target.result;

				// Execute the callback.
				callback();
			};

			// Handle errors when opening the datastore.
			request.onerror = tDB.onerror;
		};

		/**
		 * Fetch all of the todo items in the datastore.
		 * @param {function} callback A function that will be executed once the items
		 *                            have been retrieved. Will be passed a param with
		 *                            an array of the todo items.
		 */
		tDB.fetchTodos = function(callback) {
			var db = datastore;
			var transaction = db.transaction(['todo'], 'readwrite');
			var objStore = transaction.objectStore('todo');

			var keyRange = IDBKeyRange.lowerBound(0);
			var cursorRequest = objStore.openCursor(keyRange);

			var todos = [];

			transaction.oncomplete = function(e) {
				// Execute the callback function.
				callback(todos);
			};

			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;

				if (!!result == false) {
					return;
				}

				todos.push(result.value);

				result.
				continue();
			};

			cursorRequest.onerror = tDB.onerror;
		};

		/**
		 * Create a new todo item.
		 * @param {string} text The todo item.
		 */
		tDB.createTodo = function(text, callback) {
			// Get a reference to the db.
			var db = datastore;

			// Initiate a new transaction.
			var transaction = db.transaction(['todo'], 'readwrite');

			// Get the datastore.
			var objStore = transaction.objectStore('todo');

			// Create a timestamp for the todo item.
			var timestamp = new Date().getTime();

			// Create an object for the todo item.
			var todo = {
				'text' : text,
				'timestamp' : timestamp
			};

			// Create the datastore request.
			var request = objStore.put(todo);

			// Handle a successful datastore put.
			request.onsuccess = function(e) {
				// Execute the callback function.
				callback(todo);
			};

			// Handle errors.
			request.onerror = tDB.onerror;
		};

		/**
		 * Delete a todo item.
		 * @param {int} id The timestamp (id) of the todo item to be deleted.
		 * @param {function} callback A callback function that will be executed if the
		 *                            delete is successful.
		 */
		tDB.deleteTodo = function(id, callback) {
			var db = datastore;
			var transaction = db.transaction(['todo'], 'readwrite');
			var objStore = transaction.objectStore('todo');

			var request = objStore.
			delete (id);

			request.onsuccess = function(e) {
				callback();
			}

			request.onerror = function(e) {
				console.log(e);
			}
		};

		// Export the tDB object.
		return tDB;
	}());
