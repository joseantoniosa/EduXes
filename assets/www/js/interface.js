/*
 * EduXes
 *
 * Copyright (C) 2012  José Antonio Salgueiro Aquino <info@joseantonio.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

//


function onDeviceReady() {
// TODO: it isn't exist create one:


    $.mobile.showPageLoadingMsg();

	var db = window.openDatabase("eduxesdb", "1.0", "Gestion de Aula", 200000); // global variable
	global_db=db;

//	$("#etiqueta1").val("Alo France 02"); //results.rows.item(i).data);
//	$("#dentro_inicio").html("Alo France 2"); //results.rows.item(i).data);
//	log("One "+ db +"\n");

// On first time it populate DB:

    global_db.transaction(createDB); // , errorCB, successCB);
// On production this will be removed:
    global_db.transaction(populateDB); //, errorCB, successCB);

// Load Data into Interface:
  //  loadGroups(global_db);
  //  loadStudents(global_db);
  //  loadActivities(global_db);

    initialize_data() ;


    $.mobile.changePage("#daily_work");

    $("#daily_date").noWeekends ;

// Callbacks:
    $("#daily_date").change(function() {
        open_daily_page();

	});


}

function init(){
//	log("Hello World \n");

    document.addEventListener("deviceready", onDeviceReady, false);
}

// Load default data
function initialize_data() {
    // set date to current date:  Month / Day /Year
    var a_today = new Date(); // Today
    var today =  (a_today.getMonth() +1 )+ "/" + a_today.getDate() +"/"+  (1900+a_today.getYear());
    $("#daily_date").val(today);

    $("#teachers_name").text(" Geography");

}

//
// Open Daily work page: list of groups
function open_daily_page() {
    var this_date = $("#daily_date").val();

    if (this_date != "") {
        var a_date = new Date(this_date);
        if (a_date.getDay() == 6 || a_date.getDay() == 0) {
            help("weekend");
        } else {

            $.mobile.showPageLoadingMsg();
            week_day_global = a_date.getDay();
            loadSchedule(global_db, week_day_global);
            $("#current_day").text(this_date);
            $.mobile.changePage("#daily_schedule");
        }
    }
}

// Open Students Attendance page
function listStudentsAttendance(id_group, id_session)
{
    $.mobile.showPageLoadingMsg();

    id_global=id_group ;  //local variable goes global
    table_global='STUDENTS';
    global_session = id_session;

    loadStudentAttendance(global_db);

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
	insertNewGroup(global_db, name, other_data);
// 	debería re-leerlo de la BD
	loadGroups(global_db);
    // $('#groups_ul').listview('refresh');

	$.mobile.changePage("#lista_grupos");
}

function addNewStudent() { // TODO
	$.mobile.showPageLoadingMsg();

	name = $("#in_name_student").val();
	surname = $("#in_surname_student").val();
	group_id = 0;
	insertNewStudent(global_db, name, surname, group_id); //
    $('#students_ul').listview('refresh');

	$.mobile.changePage("#list_students");
}


function addNewActivity() { // TODO
	$.mobile.showPageLoadingMsg();

	name = $("#in_nombre_activity").val();
	other_data = $("#in_nivel_activity").val();
	insertNewActivity(global_db, name, other_data);

    $('#activities_ul').listview('refresh');

    $.mobile.changePage("#list_activities");
}

// XXX: To be developed
//TODO: 1st. List groups and check one, 2nd. List Attendance by Group & date?
function generalListAttendance() {


    $.mobile.showPageLoadingMsg();
// select group
// select date - week
// list attendance => general_listattendance
    loadGroupsAttendance(global_db);

//    $.mobile.changePage("#list_groups"); // Primero lista los grupos, elige uno
    $.mobile.changePage("#list_groups_attendance");
}

function listStudents(id_group)
{

    $.mobile.showPageLoadingMsg();

	id_global=id_group ;  //local variable goes global
	table_global='STUDENTS';

	loadStudentsByGroup(global_db);

	$.mobile.changePage("#list_students", { transition: "slideup"} );

}
/*
 * For list of Attendance: Students
 */
function listStudentsByGroupAttendance(id_group) {
    $.mobile.showPageLoadingMsg();

    id_global=id_group ;  //local variable goes global
    table_global='STUDENTS';

    loadStudentsAttendanceByGroup(global_db);

    $.mobile.changePage("#list_students_attendance_by_group", { transition: "slideup"} );


}


/*
 * Attendance-Punctuality-Behavior
 *
 * called in: queryStudentsAttendanceSuccess
 */
function studentState(id_student, id_group, id_session) {

    var state =$("#select-student_"+id_student+" option:selected").text()   ;
    var real_state=STATE_NONE;

//  TODO: Should change actual_date to GUI date
    var actual_date= new Date();

    switch(state) {
        case 'Absence':
            real_state=STATE_ABSENCE;
            break;
        case 'Unpunctuality':
            real_state=STATE_UNPUNCTUAL;
            break;
        case 'Excused':
            real_state=STATE_EXCUSED;
            break;
        case 'Behavior':
            real_state=STATE_BEHAVIOR;
            break;
        default:
            real_state=STATE_NONE;
            break;
    }
    updateStudentState( global_db, id_student, id_group, id_session,  real_state,  actual_date );

}

/*
 * Students Attendance
 */
function Attendance(id_student){

    $.mobile.showPageLoadingMsg();

    id_global = id_student;      //local variable goes global
    table_global = 'STUDENTS';

    loadStudentAttendance(global_db);

    $.mobile.changePage("#edit_students_attendance", { transition: "slideup"});

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
function help(field) {
    var message;
    var title;

    switch (field) {
        case "student_attendance":
            title = "student_attendance";
            message ="Student Attendance ...";
            break;
        case "date":
            title = "Date format";
            message =" MM/DD/YY";
            break;
        case "weekend":
            title = "Classes";
            message =" No class on Weekend! ";
            break;

        default:
            break;
        }
        navigator.notification.alert(
            message,
            null,
            "Ayuda: " + title,
            "Cerrar"
        );

}

function exitApp() {
    device.exitApp();
}


function log(message) {
    if (DEBUG) {
        console.log(message);
    }
}




// daily_work
//
// today=new Date()
// thisDay=today.getDay()
// $("#daily_date").