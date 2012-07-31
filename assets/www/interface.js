// Referencia á base de datos
var db;

function onDeviceReady() {	

	db = window.openDatabase("eduxesdb", "1.0", "Gestion de Aula", 200000); // global variable

//	$("#etiqueta1").val("Alo France 02"); //results.rows.item(i).data);
//	$("#dentro_inicio").html("Alo France 2"); //results.rows.item(i).data);
//	console.log("One "+ db +"\n");

// On first time it populate DB:
	
	db.transaction(populateDB, errorCB, successCB);
	
//	db.transaction(queryGroupsDB, errorCB, successCB);
// Load Data into Interface:	
	loadGroups(db);
	loadStudents(db);
	loadActivities(db);

}

function init(){
	console.log("Hello World \n");
//	$("#inicio").html("<b>Capa inicial</b>"); // works!	
	document.addEventListener("deviceready", onDeviceReady, false);
}



function requestNewActivity (){
	$.mobile.showPageLoadingMsg();
	
}

function requestNewGroup() {
	
    $.mobile.showPageLoadingMsg();
    $('#in_nombre_grupo').disabled="false";
    $.mobile.changePage("#edit_grupos");
	
}

function addNewGroup() {
	$.mobile.showPageLoadingMsg();
	
	name = $("#in_nombre_grupo").val();
	other_data = $("#in_nivel_grupo").val();
	insertNewGroup(db, name, other_data);
	   
    $('#grupos_ul').listview('refresh');	   

	$.mobile.changePage("#lista_grupos");
}

