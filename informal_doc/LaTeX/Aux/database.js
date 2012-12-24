
\emph{ errorCB() }     & Error handler \\
\emph{  successCB() &  Error handler \\
\emph{ queryDB(tx) } & List groups \footnote{Deprecated} \\

\emph { queryAllStudentsSuccess() & List filled with students information \\
\emph { queryAllStudentsDB(tx) } & List filled with students information \\
\emph { queryStudentSuccess() } & Fill Editor Page with student information \\
\emph { queryStudentDB() } & Fill Editor Page with student information \\
\emph { queryNewStudentDB() } & Fill Editor Page with student information. Group list \\
\emph { queryStudentsSuccess() } & Fill list of students with name, surname and photo  \\
\emph { queryStudentsDB() } & Fill list of students with name, surname and photo  \\

\emph { queryStudentsByGroupSuccess() }& Settings->Group-> List of Students \\

\emph { queryStudentsByGroupDB() } & Settings->Group-> List of Students \\

\emph { queryScheduleSuccess() }& Main Window - Daily Schedule \\
\emph { querySchedulePerDayDB() } & Main Window - Daily Schedule \\
\emph { loadSchedule(db, this_day) { Load Daily Schedule }

\emph { queryReportAttendanceDB() } & report->Attendance->Group \\
\emph { queryReportAttendanceSuccess() }& report->Attendance->Group \\

\emph { loadGroupsAssessment() } Report->Assessment ->  Group\\

\emph { Peers () } Activities object

\emph { loadStudentsAssessment() } Report->Assessment ->  Students\\

\emph {  fillSelectStudent() } {  Fill attendance student page with options } \\

\emph { queryStudentsAttendanceSuccess(tx, results) {  <!-- Third Window: List of Students.  Attendance //-->

\emph { queryStudentsAttendanceDB(tx) { <!-- Third Window: List of Students.  Attendance //-->


\emph { insertNewGroup(db, name, other_data)} { Insert Group }   \\
\emph { updateGroup(db, name, other_data)}{  Update Group  }\\
\emph { deleteGroup(db) }{ Delete Group } \\
  // 
\emph { loadGroup(db, id_group){ Load only one group! } \\

\emph { queryAllGroupsDB(tx) { List all groups }  \\
\emph { loadAllGroups(db) { { List all groups }  \\


// ---------------------------------------------------------------------------------------------------------
//
//      STUDENTS    Management:
//
// ----------------------------------------------------------------------------------------------------------
    // Insert new Student
\emph { insertNewStudent() } { Insert new Student  } \\

\emph { querySaveStudentDB (tx){ // Update Student \\
\emph { deleteStudent(db) {

// Low level insert
\emph { insertStudentStateL(db, id_student, id_group, id_session, state, actual_date ){ Insert New Student 
// Low level update
\emph { updateStudentStateL(db, id_student, id_group, id_session, state, actual_date ) { Update Student 

// Check whether student state changes
// @id_student student id
\emph { stateCheck(db, id_student, id_group, id_session, state, actual_date){
// Write Student state
\emph { updateStudentState(db, id_student, id_group, id_session, state, actual_date ){
    exist = stateCheck(db, id_student, id_group, id_session, state, actual_date); // Is asynchronous
}

//
// Save Student info
   \emph { saveStudent(db){
       db.transaction(querySaveStudentDB);
   }

   \emph { loadStudents(db) {
       db.transaction(queryStudentsDB);
   }
   // Load only one student!
   \emph { loadStudent(db){
       db.transaction(queryStudentDB);
   }


   \emph { loadNewStudent(db){
       db.transaction(  queryNewStudentDB);
   }

   \emph { loadAllStudents(db) {
          db.transaction(queryAllStudentsDB);
   }

   \emph { loadStudentsByGroup(db,id_group) { List Students by Group }
///---------------------------------------------------------------------------------------------------------
//
//      Activities
//
// ----------------------------------------------------------------------------------------------------------


\emph { queryLoadAllActivitiesDB(tx) { Settings -> Show Activities (to be updated)
\emph { loadAllActivities(db) { Settings -> Show Activities (to be updated)

\emph { loadActivity(db, id_activity ) {Settings -> List Activities -> Load activity information


\emph { updateActivity(  ){Settings -> Activities -> List-> Load activity -> Update Activity. }\\

//
// Update Activities for each group
\emph { updateActivitiesGroup(db, id_group, id_activity, enabled , a_date, notes){ Update Activities for each group


\emph { insertActivitiesGroup(db, id_group, last_inserted_row, enabled , a_date, notes){ Update Activities for each group

\emph {  insertNewActivity( d ) { {Settings -> Activities -> New 

\emph { loadGroupsActivitiesEdit(db){ {Settings -> Activities -> New (List groups)

//
//------------- Assessment:

\emph { fillSelectStudentAssessment(db, select_student_id, id_session, id_student) { Assessment -> Student -> List options and get saved data.


\emph { loadGroupAssessment(db,id_group) { Assessment -> Load group information }
\emph { listStudentsByGroupAssessment(db, id_group, students_ul) { // Assessment. List Students, load data  from DB
\emph { refreshGroupAssessment(){ ^^ ID.}

\emph { updateStudentAssessmentL(db,id_student,id_group, id_activity,mark){  Update Student Assessment

\emph { insertStudentAssessmentL(db,id_student,id_group, id_activity,mark) { Insert Student Assessment  

\emph { onChangeStudentAssessment(id_student,id_group, id_activity){ Select Update or Insert 



\emph { queryListMaxActivities(tx) { List Number of activities }
\emph { listMaxActivities(db) { List number of activities }


   \emph { deleteRawRecord(db, table, id){ Delete any row from any table }

\emph { queryGroupsAttendanceDB() } & Reports -> Attendance ->List  groups \\
 \emph { loadGroupsAttendance(db) { Reports -> Attendance -> List  groups  } \\
//

/*
 * For Students Attendance Table
 */
    \emph { reportAttendanceDB(db) {
       db.transaction(queryReportAttendanceDB);
   }

   \emph { loadStudentAttendance(db) {
       db.transaction(queryStudentsAttendanceDB);
   }


