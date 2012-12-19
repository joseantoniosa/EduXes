
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

    db.transaction(drop_table_if_exist); // DEBUG
    db.transaction(createDB); // , errorCB, successCB);
// On production this will be removed:
    log("onDeviceReady PopulateDB ");
    global_db.transaction(populateDB); //, errorCB, successCB); // DEBUG
    initialize_data(db) ;

    $.mobile.page.prototype.options.backBtnTheme = "a";
    $.mobile.changePage("#intro");
}
function init(){
    document.addEventListener("deviceready", onDeviceReady, false);
}
// Load default data
function initialize_data(db) {
    // set date to current date:  Month / Day /Year
    var a_today = new Date(); // Today
    global_actual_date = a_today;
    global_reports_date = global_actual_date ;

    listMaxActivities(db);

    $("#daily_date_scroller").val( textDate(a_today) );
    $("#teachers_name").text("Geography");
// New:
//    $("#daily_date_scroller").mobiscroll().date();

    $('#daily_date_scroller').scroller({
        preset: 'date',
        invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
        theme: 'android',
        display: 'modal',
        mode: 'scroller',
        animate: 'slidedown',
        dateOrder: 'mmD ddyy'
    });
    $("#in_date_end_activity_scroller").val( textDate(a_today) );
    $('#in_date_init_activity_scroller').scroller({
        preset: 'date',
        invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
        theme: 'android',
        display: 'modal',
        mode: 'scroller',
        animate: 'slidedown',
        dateOrder: 'mmD ddyy'
    });

    $("#in_date_end_activity_scroller").val( textDate(a_today) );
    $('#in_date_end_activity_scroller').scroller({
        preset: 'date',
        invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
        theme: 'android',
        display: 'modal',
        mode: 'scroller',
        animate: 'slidedown',
        dateOrder: 'mmD ddyy'
    });
    // daily_date_scroller

}
//
// Open Daily work page: list of groups
function open_daily_page() {
    var this_date = $("#daily_date_scroller").val();
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


// ----------------------------------------------------------------------------

// Open Students Attendance page
function listStudentsAttendance(id_group, id_session)
{
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    global_id_group = id_group;
    table_global='STUDENTS';
    global_session = id_session;
    loadStudentAttendance(global_db);
    $.mobile.changePage("#list_students_attendance" );
}



//-----------------------------------------------------------------------------
//      Groups:
//-----------------------------------------------------------------------------
function requestNewGroup() {
    $.mobile.showPageLoadingMsg();
    $('#in_nombre_grupo').disabled="false";
    $.mobile.changePage("#edit_groups");
}
// inside edit
function onAddNewGroup(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#edit_new_group");
}

function onUpdateGroup() {
    name = $("#in_nombre_grupo").val();
    other_data = $("#in_nivel_grupo").val();
    updateGroup(global_db, name, other_data);
    listAllGroups();
}
function EditGroup(id_group){
    $.mobile.showPageLoadingMsg();
    global_id = id_group;      //local variable goes global
    table_global = 'GROUPS';
    loadGroup(global_db,id_group);
    $.mobile.changePage("#edit_groups", { transition: "slideup"});
}

function onDeleteGroup(){
    $.mobile.showPageLoadingMsg();
    // global_id = id_student;      //local variable goes global
    table_global = 'GROUPS';
    deleteGroup(global_db);
    history.back(); // XXX: Cambiarlo por algo más sólido
  //  $.mobile.changePage("#edit_student", { transition: "slideup"});
}

function onSaveNewGroup() {
    name = $("#in_new_nombre_grupo").val();
    other_data = $("#in_new_nivel_grupo").val();
    insertNewGroup(global_db, name, other_data);
    onlistAllGroups();
}
// List All Groups
function onListAllGroups(){
    $.mobile.showPageLoadingMsg();
    table_global='GROUPS';
    loadAllGroups(global_db); // #groups_ul
    $.mobile.changePage("#list_groups", { transition: "slideup"} );
}

//-----------------------------------------------------------------------------
//      Students:
//----------------------------------------------------------------------------

function EditStudent(id_student){
    $.mobile.showPageLoadingMsg();
    global_id = id_student;      //local variable goes global
    table_global = 'STUDENTS';
    loadStudent(global_db);
    $.mobile.changePage("#edit_student", { transition: "slideup"});
}

function onDeleteStudent(){
    $.mobile.showPageLoadingMsg();
    // global_id = id_student;      //local variable goes global
    table_global = 'STUDENTS';
    deleteStudent(global_db);
    history.back(); // XXX: Cambiarlo por algo más sólido
    //alert("Ir a la anterior"); // TODO: Go to previous page
  //  $.mobile.changePage("#edit_student", { transition: "slideup"});
}
// Add new Student
function onAddNewStudent(){
    $.mobile.showPageLoadingMsg();
    table_global = 'STUDENTS';
    loadNewStudent(global_db);
    $.mobile.changePage("#edit_new_student", { transition: "slideup"});

}

function onSaveStudent(){
    $.mobile.showPageLoadingMsg();
    table_global = 'STUDENTS';
    saveStudent(global_db);
    history.back(); // XXX: Cambiarlo por algo más sólido
    //alert("Ir a la anterior"); // TODO: Go to previous page

  //  $.mobile.changePage("#edit_student", { transition: "slideup"});
}

function onSaveNewStudent() {
    $.mobile.showPageLoadingMsg();
    group_id=$('#student_new_edit_group_list_ul')[0].selectedIndex ;
    name=  $('#in_new_name_student').val();
    surname= $('#in_new_surname_student').val();
    repeated=0 ;
    n_date=$('#in_new_birth_date_student').val();
    photo="";// TODO: How to implement this?
    tutor=$('#in_new_tutor_student').val();
    address=$('#in_new_address_student').val();
    phone=$('#in_new_phone_student').val();
    e_phone=$('#in_new_e_phone_student').val();
    nation=$('#in_new_nation_student').val();

    insertNewStudent(global_db, name, surname, group_id, repeated, n_date, photo, tutor,address, phone, e_phone, nation); //
    $('#students_ul').listview('refresh');
    listStudentsByGroup(group_id);
}
// Dummy function?
function listStudents(id_group)
{
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    table_global='STUDENTS';
    loadStudentsByGroup(global_db);
    $.mobile.changePage("#list_students", { transition: "slideup"} );
}
// List Students by Group
function listStudentsByGroup(id_group) { // report
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    global_id_group=id_group;
    table_global='STUDENTS';
    loadStudentsByGroup(global_db,id_group);
    $.mobile.changePage("#list_students_by_group", { transition: "slideup"} ); // TODO ??
}
// List All Students
function onListAllStudents(){
    $.mobile.showPageLoadingMsg();
    table_global='STUDENTS';
    loadAllStudents(global_db);
    $.mobile.changePage("#list_students", { transition: "slideup"} );
}

// ----------------------------------------------------------------------------
// Activities
// ----------------------------------------------------------------------------
function onListAllActivities()
{
    $.mobile.showPageLoadingMsg();
    loadAllActivities(global_db);

    $.mobile.changePage("#list_all_activities");


//    $.mobile.changePage("#list_all_activities");
//    alert("Page changed");
}
// TODO: Activity update
// Show edition activity page
function onUpdateActivity(id_activity) {
    $.mobile.showPageLoadingMsg();
    global_is_new=0;
    global_id = id_activity;      //local variable goes global
    global_id_activity = id_activity;      //local variable goes global
    table_global = 'ACTIVITIES';
    loadActivity(global_db, id_activity );

    $('#activity_page_name').text("Activity");
    $('#activity_page_name_footer').text("Update Activity");

    $.mobile.changePage("#update_activity", { transition: "slideup"});
//    alert("Update Page Loaded");

}

// Show edition activity page
function onAddNewActivity() { // TODO
    $.mobile.showPageLoadingMsg();
    global_is_new=1;
    // TODO: Fill with  groups info: #list_groups_activities_ul
    global_id_activity = -1;      //local variable goes global NEW activity
    loadGroupsActivitiesEdit(global_db);
    $('#activity_page_name').text("New Acitivity");
    $('#activity_page_name_footer').text("New Activity");
    $.mobile.changePage("#update_activity");

//    $.mobile.changePage("#edit_activity");
}

function onSaveNewActivity() {

    var name = $('#in_name_activity').val();
    var date_init=$('#in_date_init_activity_scroller').val();
    var date_end=$('#in_date_end_activity_scroller').val();
    var weight=$('#in_weight_activity').val();
    var e_final=$('#in_final_activity').val();
    if(weight=="") weight=0;

    if(global_is_new==1) { // NEW
        if(name!="")  {
           insertNewActivity(global_db, name , date_init , date_end , weight , e_final  );
        }
    } else { // UPDATE
          updateActivity(global_db, name , date_init , date_end , weight , e_final  );
    }
    onListAllActivities();
}
// Assessment (part of Activities)
//
function onOpenStudentsAssessment(){

    $.mobile.showPageLoadingMsg();
    id_group=global_id_group; // Se supone que vendra de una variable global:
    loadGroupAssessment(global_db,id_group);

    $.mobile.changePage("#list_students_assessment");

}
function onRefreshGroupAssessment(){
    refreshGroupAssessment();
}

// ----------------------------------------------------------------------------
//
// TO BE DONE!
function onOpenStudentsAttendance(){
    // Debería abrir la página list_students_attendance
    listStudentsAttendance(global_id_group, global_session); // XXX: un mal parche

}
//------------------
// REPORTS: List Attendance
function onReportListAttendance() {
    $.mobile.showPageLoadingMsg();
    loadGroupsAttendance(global_db);
    $.mobile.changePage("#list_groups_attendance");
}

// TODO: Assessment Reports. List Groups
function onReportListAssessment() {
    $.mobile.showPageLoadingMsg();
    loadGroupsAssessment(global_db); // TODO: Assessment - List Groups (?)
    $.mobile.changePage("#list_groups_assessment");

}
// TODO : List Students:
function onListStudentsAssessment(id_group){
    $.mobile.showPageLoadingMsg();
    //alert("Assessment "+ id_group) ;
    global_id_group = id_group;
// Get all activities list!!??
    loadStudentsAssessment(global_db, id_group); // TODO: Assessment - List Students
    $.mobile.changePage("#list_students_assessment_reports");// TODO: Assessment - List Students

}
/*
 * => REPORT <=
 * For list of Attendance: Students
 *
 */
function listStudentsByGroupAttendance(id_group) { // report
    $.mobile.showPageLoadingMsg();
    global_id=id_group ;  //local variable goes global
    global_id_group = id_group;
    table_global='STUDENTS';
    reportAttendanceDB(global_db); //
    $.mobile.changePage("#list_students_attendance_by_group", { transition: "slideup"} );
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
    } else  if($('#daily_date_scroller').val() != null ) {
        var actual_date = $('#daily_date_scroller').val();
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
function onGeneralFile(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#file", { transition: "slideup"});
}
function onGeneralListReports(){
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage("#list_reports", { transition: "slideup"});
}

function onGeneralListSettings(){
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

