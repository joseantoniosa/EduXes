//


function onDeviceReady() {
// TODO: it isn't exist create one:

	db = window.openDatabase("eduxesdb", "1.0", "Gestion de Aula", 200000); // global variable

//	$("#etiqueta1").val("Alo France 02"); //results.rows.item(i).data);
//	$("#dentro_inicio").html("Alo France 2"); //results.rows.item(i).data);
//	console.log("One "+ db +"\n");

// On first time it populate DB:
    db.transaction(populateDB, errorCB, successCB);

// Load Data into Interface:
    loadGroups(db);
    loadStudents(db);
    loadActivities(db);

    initialize_data() ;

    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#daily_work");

    $("#daily_date").noWeekends ;

// Callbacks:
    $("#daily_date").change(function() {
        open_daily_page();

	});


}

function init(){
//	console.log("Hello World \n");

    document.addEventListener("deviceready", onDeviceReady, false);
}

// Load default data
function initialize_data() {
    // set date to current date:  Month / Day /Year
    var a_today = new Date(); // Today
    var today =  (a_today.getMonth() +1 )+ "/" + a_today.getDate() +"/"+  (1900+a_today.getYear());
    $("#daily_date").val(today);

    $("#teachers_name").text("Geography");
}

//
// Open Daily work page: list of groups
function open_daily_page() {
    var this_date = $("#daily_date").val();
    if (this_date != "") {
        var a_date = new Date(this_date);
        if (a_date.getDay() == 6 || a_date.getDay() == 0) {
            alert("No class on Weekend!");
        } else {
            week_day_global = a_date.getDay();
            loadSchedule(db, week_day_global);
            $("#current_day").text(this_date);
            $.mobile.changePage("#daily_schedule");
        }
    }
}

// Open Students Attendance page
function listStudentsAttendance(id_group)
{
    $.mobile.showPageLoadingMsg();

    id_global=id_group ;  //local variable goes global
    table_global='STUDENTS';
    alert("Attendance");
    // loadStudentsByGroup(db);
    loadStudentAttendance(db);

    $.mobile.changePage("#list_students_attendance", { transition: "slideup"} );

}


//inside list:
function requestNewActivity (){
	$.mobile.showPageLoadingMsg();

}

function requestNewGroup() {

    $.mobile.showPageLoadingMsg();
    $('#in_nombre_grupo').disabled="false";
    $.mobile.changePage("#edit_groups");

}

// inside edit
function addNewGroup() {
	$.mobile.showPageLoadingMsg();

	name = $("#in_nombre_grupo").val();
	other_data = $("#in_nivel_grupo").val();
	insertNewGroup(db, name, other_data);
// 	debería re-leerlo de la BD
	loadGroups(db);
    // $('#groups_ul').listview('refresh');

	$.mobile.changePage("#lista_grupos");
}

function addNewStudent() { // TODO
	$.mobile.showPageLoadingMsg();

	name = $("#in_name_student").val();
	surname = $("#in_surname_student").val();
	group_id = 0;
	insertNewStudent(db, name, surname, group_id); //
    $('#students_ul').listview('refresh');

	$.mobile.changePage("#list_students");
}


function addNewActivity() { // TODO
	$.mobile.showPageLoadingMsg();

	name = $("#in_nombre_activity").val();
	other_data = $("#in_nivel_activity").val();
	insertNewActivity(db, name, other_data);

    $('#activities_ul').listview('refresh');

	$.mobile.changePage("#list_activities");
}


function listStudents(id_group)
{
	$.mobile.showPageLoadingMsg();

	id_global=id_group ;  //local variable goes global
	table_global='STUDENTS';

	loadStudentsByGroup(db);

	$.mobile.changePage("#list_students", { transition: "slideup"} );

}
/*
 * Students Attendance
 */
function Attendance(id_student){

	$.mobile.showPageLoadingMsg();

	id_global=id_student ;  //local variable goes global
	table_global='STUDENTS';

	loadStudentAttendance(db);

	$.mobile.changePage("#edit_students_attendance");

}


// lista_alumnos, list_students
// Generic functions

function deleteRecord(db, table, id){
	   var db2= db;
	   var id2= id;
	   var table2 = table;

	   deleteRawRecord(db2, table2, id2);

	   switch(table2) {
	   case 'groups':
		   loadGroups(db2);
		   break;
	   case 'students':
		   loadStudents(db2);
		   break;
	   case 'activities':
		   loadActivities(db2);
		   break;
	   case 'attendance':
		   loadGroups(db2);
		   break;

	   default:
		   break;
	   }

}

// daily_work
//
// today=new Date()
// thisDay=today.getDay()
// $("#daily_date").