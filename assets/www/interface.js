// Referencia á base de datos
var db;

function onDeviceReady() {	

	var db = window.openDatabase("eduxesdb", "1.0", "Gestion de Aula", 200000);

//	$("#etiqueta1").val("Alo France 02"); //results.rows.item(i).data);
//	$("#dentro_inicio").html("Alo France 2"); //results.rows.item(i).data);
//	console.log("One "+ db +"\n");
	
	db.transaction(populateDB, errorCB, successCB);
	
	db.transaction(queryGroupsDB, errorCB, successCB);
	loadGroups();
	loadStudents();
//    loadCards();
}

function init(){
	console.log("Hello World 0\n");
//	$("#inicio").html("<b>Capa inicial</b>"); // works!	
	document.addEventListener("deviceready", onDeviceReady, false);
}
