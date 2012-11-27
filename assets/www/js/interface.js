
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

        var db = window.openDatabase("eduxesdb", "1.0", "Gestion de Aula", 5*1024*1024);
        global_db=db;
// On first time it populate DB:
    global_db.transaction(createDB); // , errorCB, successCB);
// On production this will be removed:
    log("onDeviceReady PopulateDB ");
    global_db.transaction(populateDB); //, errorCB, successCB);
    initialize_data() ;
    $.mobile.changePage("#intro");
}
function init(){
    document.addEventListener("deviceready", onDeviceReady, false);
}
// Load default data
function initialize_data() {
    // set date to current date:  Month / Day /Year
    var a_today = new Date(); // Today
    global_actual_date = a_today;
    global_reports_date = global_actual_date ;
    $("#daily_date").noWeekends ;
    $("#daily_date").val( textDate(a_today) );
    $("#teachers_name").text("Geography");
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
            global_week_day = a_date.getDay();  // 1=> Monday
            var week_day = clone(global_week_day);
            loadSchedule(global_db, week_day);
            global_actual_date = new Date(this_date);
            // Reports date is, in origin, the same as actual_date
            global_reports_date = global_actual_date ;
            $("#current_day").text(this_date);
            $.mobile.changePage("#daily_schedule");
        }
    }
}

function EditStudent(id_student){
    $.mobile.showPageLoadingMsg();
    global_id = id_student;      //local variable goes global
    table_global = 'STUDENTS';
    loadStudent(global_db);
    $.mobile.changePage("#edit_student", { transition: "slideup"});
}
// Open Students Attendance page
function listStudentsAttendance(id_group, id_session)
{
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    table_global='STUDENTS';
    global_session = id_session;
    loadStudentAttendance(global_db);
    $.mobile.changePage("#list_students_attendance" );
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
    loadGroups(global_db);
    // $('#groups_ul').listview('refresh');
    $.mobile.changePage("#lista_grupos");
}
function addNewStudent() { // TODO
    $.mobile.showPageLoadingMsg();
    name = $("#in_name_student").val();
    surname = $("#in_surname_student").val();


    group_id = 0; // Choose group from a list
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
//
function generalListAttendance() {
    $.mobile.showPageLoadingMsg();
    loadGroupsAttendance(global_db);
    $.mobile.changePage("#list_groups_attendance");
}
function listStudents(id_group)
{
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    table_global='STUDENTS';
    loadStudentsByGroup(global_db);
    $.mobile.changePage("#list_students", { transition: "slideup"} );
}
/*
 * => REPORT <=
 * For list of Attendance: Students
 *
 */
function listStudentsByGroupAttendance(id_group) { // report
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    table_global='STUDENTS';
    reportAttendanceDB(global_db); //
    $.mobile.changePage("#list_students_attendance_by_group", { transition: "slideup"} );
}
// List Students by Group
function listStudentsByGroup(id_group) { // report
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    table_global='STUDENTS';
    loadStudentsByGroup(global_db);
    $.mobile.changePage("#list_students_by_group", { transition: "slideup"} );
}
// List All Groups
function listAllGroups(){
    $.mobile.showPageLoadingMsg();
    table_global='GROUPS';
    loadAllGroups(global_db); // #groups_ul
    $.mobile.changePage("#list_groups", { transition: "slideup"} );
}
// List All Students
function listAllStudents(){
    $.mobile.showPageLoadingMsg();
    table_global='STUDENTS';
    loadAllStudents(global_db);
    $.mobile.changePage("#list_students", { transition: "slideup"} );
}
//
function studentsAttendanceListPrevious() {
    global_reports_date = moment(global_reports_date).subtract('days',7).toDate();
    listStudentsByGroupAttendance(global_id);
}
function studentsAttendanceListNext() {
    global_reports_date = moment(global_reports_date).add('days',7).toDate();
    listStudentsByGroupAttendance(global_id);
}

/*
 * Attendance-Punctuality-Behavior
 *
 * called in: queryStudentsAttendanceSuccess
 */
function studentState(id_student, id_group, id_session) {
    var state =$("#select_student_"+id_student+" option:selected").text()   ;
    var real_state=STATE_NONE;

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
    // Consider Today as default date.
    if(global_actual_date!=null) {
        var actual_date = global_actual_date;
    } else  if($('#daily_date').val() != null ) {
        var actual_date = $('#daily_date').val();
    } else {
        var actual_date = new Date();
    }
    updateStudentState( global_db, id_student, id_group, id_session, real_state, actual_date );
}
/*
 * Students Attendance
 */
function Attendance(id_student){
    $.mobile.showPageLoadingMsg();
    global_id = id_student;      //local variable goes global
    table_global = 'STUDENTS';
    loadStudentAttendance(global_db);
    $.mobile.changePage("#edit_students_attendance", { transition: "slideup"});
}
function generalFile(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#file", { transition: "slideup"});
}
function generalListReports(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#list_reports", { transition: "slideup"});
}

function generalListSettings(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#list_settings", { transition: "slideup"});
}
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
//
// Utility functions:
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
        case "no_data":
            title = "No Data";
            message =" There is no data available ";
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
function textDate(a_today){
    var today =  (a_today.getMonth() +1 )+ "/" + a_today.getDate() +"/"+  (1900+a_today.getYear());
    return today;
}
function textDateYear(a_today){
    var today =  (a_today.getMonth() +1 )+ "/" + a_today.getDate() ;
    return today;
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

