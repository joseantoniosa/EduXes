// Referencia á base de datos
//
var db;
var id_global;
var table_global;
var week_day_global=-1;

//
//


function errorCB(err) {
    console.log("Error processing SQL: "+err);
    alert("Error processing SQL: "+err);
    console.log("Error processing SQL: "+err.code);
}

    function successCB() {
    	console.log("Success ");
    }

    function populateDB(tx) {

    	tx.executeSql('DROP TABLE IF EXISTS GROUPS;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)');
        // populate
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "First group  1")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Second group 2")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Third group  3" )');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Fourth group 4")');
// Students         TODO
    	tx.executeSql('DROP TABLE IF EXISTS STUDENTS;');
//    	var create_students="CREATE TABLE IF NOT EXISTS STUDENTS ";
//    	create_students +="(id integer primary key, group_id integer not null, data text , FOREIGN KEY(group_id) REFERENCES groups(id))";

    	var create_students="CREATE TABLE IF NOT EXISTS STUDENTS ";
    	create_students +=" (id integer primary key, id_group integer not null, name text, surname text,";
    	create_students +=" repeteated integer, n_date text , photo text, ";
    	create_students +=" tutor TEXT, address TEXT, phone text, e_phone text, nation text, ";
    	create_students +=" FOREIGN KEY(id_group) REFERENCES groups(id));";
    	console.log(create_students);
        tx.executeSql(create_students);
        // populate
        var header="INSERT INTO STUDENTS (id, id_group, name, surname, photo) VALUES (";
        tx.executeSql(header +'NULL,0, "0First"," Student 0", "f001.png" )');
        tx.executeSql(header +'NULL,0, "0Second"," Student 0", "f002.png" )');
        tx.executeSql(header +'NULL,0, "0Third "," Student 0", "f003.png" )');
        tx.executeSql(header +'NULL,1, "First",  " Student",   "f004.png" )');
        tx.executeSql(header +'NULL,1, "Second"," Student", "f005.png" )');
        tx.executeSql(header +'NULL,1, "Third "," Student", "f006.png" )');
        tx.executeSql(header +'NULL,2, "Fourth"," Student", "f007.png" )');
        tx.executeSql(header +'NULL,2, "Fith"," Student", "f008.png" )');
        tx.executeSql(header +'NULL,3, "Sixth"," Student", "f009.png" )');
        tx.executeSql(header +'NULL,3, "Seventh ","student", "f010.png" )');
        tx.executeSql(header +'NULL,3, "Eighth ","student 11 ", "f011.png" )');


//        -- Sessions ( franja horaria)
        tx.executeSql('DROP TABLE IF EXISTS sessions;');
        var create_session="CREATE TABLE IF NOT EXISTS sessions (id  integer primary key,";
        create_session +="description text, h_start text, h_end text);";
        tx.executeSql(create_session);
        // populate. Hardcoded
        var header="INSERT INTO sessions (id, description, h_start, h_end) VALUES (NULL ";
        tx.executeSql(header +',"First", "09:00", "09:50" )');
        tx.executeSql(header +',"Second", "09:50", "10:40" )');
        tx.executeSql(header +',"Third", "10:40", "11:30" )');
        tx.executeSql(header +',"Recreation", "11:30", "12:00" )');
        tx.executeSql(header +',"Fourth", "12:00", "12:50" )');
        tx.executeSql(header +',"Fith", "12:50", "13:40" )');
        tx.executeSql(header +',"Sixth", "13:40", "14:30" )');
// SELECT id, description, h_start, h_end FROM sessions WHERE id=

//		-- Teacher's schedule
        tx.executeSql('DROP TABLE IF EXISTS teacher_schedule;');
        var create_schedule="CREATE TABLE IF NOT EXISTS teacher_schedule (id  integer primary key,";
        create_schedule +="id_teacher integer, id_session integer, day integer, id_group integer,";
        create_schedule +="FOREIGN KEY(id_group) REFERENCES groups(id),";
        create_schedule +="FOREIGN KEY(id_session) REFERENCES sessions(id));";
//         create_schedule +="FOREIGN KEY(id_teacher) REFERENCES teachers(id));";
        tx.executeSql(create_schedule);

        // populate: hardcoded!
        var header="INSERT INTO teacher_schedule (id, id_session, day , id_group ) VALUES (NULL";
        tx.executeSql(header +',0, 1, 0 )'); // 1st hour (0), Monday (1)  1st group (0)
        tx.executeSql(header +',2, 1, 1 )'); // 3rd hour (2), Monday (1)  2nd group (1)
        tx.executeSql(header +',0, 2, 0 )'); // 1st hour (0), Tuesday (2)  1st group (0)
        tx.executeSql(header +',5, 2, 1 )'); // 6th hour (2), Tuesday (2)  2nd group (1)
        tx.executeSql(header +',0, 3, 1 )'); // 1st hour (0), Wednesday (3)  2nd group (1)
        tx.executeSql(header +',2, 3, 0 )'); // 3rd hour (2), Wednesday (3)  1st group (0)
        tx.executeSql(header +',0, 4, 0 )'); // 1st hour (0), Thursday (4)  1st group (0)
        tx.executeSql(header +',2, 4, 1 )'); // 3rd hour (2), Thursday (4)  2nd group (1)
        tx.executeSql(header +',0, 5, 1 )'); // 1st hour (0), Friday (5)  2nd group (0)
        tx.executeSql(header +',2, 5, 0 )'); // 3rd hour (2), Friday (5)  1st group (1)
// SELECT id_session, day, id_group FROM teacher_schedule WHERE day=  ORDER BY id_session;
//
//-- Teacher's schedule
//     DROP TABLE IF EXISTS teacher_schedule;
//     CREATE TABLE IF NOT EXISTS teacher_schedule (id  integer primary key,
//        id_session integer, day integer, id_group integer,
//        FOREIGN KEY(id_group) REFERENCES groups(id),
//        FOREIGN KEY(id_session) REFERENCES sessions(id));


//
//	Activities        TODO
    	tx.executeSql('DROP TABLE IF EXISTS ACTIVITIES;');
    	var create_activities="CREATE TABLE IF NOT EXISTS ACTIVITIES ";
    	create_activities +="(id integer primary key, description text, date_init text, date_end text, weight real); ";
    	console.log(create_activities);
        tx.executeSql(create_activities);

    	var header = "INSERT INTO ACTIVITIES (id, description,date_init, date_end ,weight) VALUES (NULL,";

        tx.executeSql( header + '"Activity 1", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 2", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 3", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 4", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 5", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 6", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 7", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 8", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 9", "2012-01-01", "2012-02-01", 0.2 )');


   }

   function queryDB(tx) {
	    tx.executeSql('SELECT * FROM GROUPS', [], querySuccess, errorCB);
	}

   function queryGroupsDB(tx) {
	   	console.log("Query Groups \n");
    	tx.executeSql('SELECT * FROM GROUPS', [], queryGroupsSuccess, errorCB);
	}
   function queryStudentsDB(tx) {
	   console.log("Warning: Query Students \n");
	   tx.executeSql('SELECT * FROM STUDENTS', [], queryStudentsSuccess, errorCB);
	}
   function queryStudentsAttendanceDB(tx) {
       console.log("Query Students Attendance \n");
       console.log(log);

       tx.executeSql('SELECT * FROM STUDENTS WHERE id_group='+id_global, [], queryStudentsAttendanceSuccess, errorCB);
    }




   function queryStudentsByGroupDB(tx) {
	   // pass from and global id!!
	   log = "queryStudentsByGroupDB. Query Students from STUDENTS WHERE id_group="+id_global+ "\n";
	   console.log(log);
	   tx.executeSql('SELECT * FROM STUDENTS WHERE id_group='+id_global, [], queryStudentsSuccess, errorCB);
	}

/*
* Query groups per day - Main Window -
*/
   function querySchedulePerDayDB(tx){
	   var query = "SELECT teacher_schedule.id_session, teacher_schedule.day, teacher_schedule.id_group as t_id_group, teacher_schedule.id_session as t_id_session, ";
	   query += " groups.id as g_id, groups.data as description, sessions.id as s_id, sessions.h_start as s_h_start, sessions.h_end as s_h_text FROM teacher_schedule, groups, sessions ";
	   query += " WHERE day=" +week_day_global + " AND g_id=t_id_group AND t_id_session=s_id  ORDER BY t_id_session;";
	   var log = "Query Groups "+ query;
	   console.log("querySchedulePerDayDB:" + log);
	   tx.executeSql(query,  [], queryScheduleSuccess, errorCB);
   }

   function queryStudentsAttendanceDB(tx){

	   var sql ="";
	   var log = "StudentsAttendance. Query Students from STUDENTS WHERE id="+id_global+ "\n";

	   console.log(log);
	   tx.executeSql('SELECT * FROM STUDENTS WHERE id_group='+id_global, [], queryStudentsAttendanceSuccess, errorCB);

   }

   function queryActivitiesDB(tx) {
	   console.log("Query Activities \n");
	   tx.executeSql('SELECT * FROM ACTIVITIES', [], queryActivitiesSuccess, errorCB);
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /*
    * ^^ Above
    *
    * vv Below
    */
// console.log("Query Groups \n");
   function queryGroupsSuccess(tx, results) {
	   console.log("Returned rows = " + results.rows.length);
	   var len = results.rows.length;
	   // this will be true since it was a select statement and so rowsAffected was 0
//	   if (!resultSet.rowsAffected) {
//		   console.log('No rows affected!');
//		   return false;
//	   }

	   console.log("Last inserted row ID = " + results.insertId);
	   console.log("Number of rows inserted: " +  len)
  	   $('#groups_ul').empty();
//  <ul data-role="listview" data-inset="true" data-split-theme="d" data-split-icon="delete">
// 	    data-rel="dialog" data-transition="slideup"
//	   <a href="lists-split-purchase.html" data-rel="dialog" data-transition="slideup">Purchase album
//		</a>
	   var html="";

	   for (var i=0;i<len;i++) {
           html = "<li><h3> ";
           html += "<a onClick='id_global="+ results.rows.item(i).id + "; table_global=\"groups\"; listStudentsAttendance("+results.rows.item(i).id  +");' href='index.html#list_students_attendance' data-transition='slideup'>";
           html += results.rows.item(i).data +"</a></h3>";
           html += "<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
           html += "</a></li>";
		   $('#groups_ul').append(html);
	   }
	   $('#groups_ul').listview('refresh');
   }

// XXX: Esta función es llamada demasiadas veces ¿por qué?
   function queryStudentsSuccess(tx, results) {
	   var len = results.rows.length;
	   console.log("Last inserted student - row ID = " + results.insertId);
	   console.log("Number of student - rows inserted: " +  len);

  	   $('#students_ul').empty();
	   var html;
	   var id=0;
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;

		   html = "<li>";
//		   html += "<div data-role='fieldcontain'>";
// 		   html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
// 		   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";

		   html += "<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
		   html += "<img height='20px' src='photos/"+results.rows.item(i).photo +"' alt='"+results.rows.item(i).surname +"' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
		   html += "</a>";
		   html += "<label>"+ results.rows.item(i).surname +" "+ results.rows.item(i).name +"</label>";
		   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
//		   html += "</div>";
		   html += "</li>";
		  // html += results.rows.item(i).id+"</a> </li>";
		   $('#students_ul').append(html);

	   }
	   $('#students_ul').listview('refresh');

   }
/*
 *  Main Window
 * 	List of groups per day
 * TODO
 */
   function queryScheduleSuccess(tx, results) {
	   // groups_day_ul
	   var len = results.rows.length;
	   console.log("Last inserted student - row ID = " + results.insertId);
	   console.log("Number of student - rows inserted: " +  len);

  	   $('#groups_day_ul').empty();
	   var html;
	   var id=0;
	   var description="";
	   var start = "";
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;


//		   html += "<div data-role='fieldcontain'>";
// 		   html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
// 		   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";
// TODO: fill with correct fields vvv
		//   html += "<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
		//   html += "<img height='20px' src='photos/"+results.rows.item(i).photo +"' alt='"+results.rows.item(i).surname +"' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
		//   html += "</a>";
		//   html += "<label>"+ results.rows.item(i).surname +" "+ results.rows.item(i).name +"</label>";
		//   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
//		   html += "</div>";
// query = "SELECT id_session, day, id_group FROM teacher_schedule WHERE day=" +week_day_global + " ORDER BY id_session;";
//
//	        var create_session="CREATE TABLE IF NOT EXISTS sessions (id  integer primary key,";
//	        create_session +="description text, h_start text, h_end text);";


           start = results.rows.item(i).s_h_start;  // s_h_end
           description = results.rows.item(i).description;  // description=group_description
           html = "<li>";
           html += "<div data-role='fieldcontain'>";
           html += start;

           html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#list_students_attendance' ";
           html += " onClick=\"listStudentsAttendance(" + results.rows.item(i).t_id_group + ");\">" + description + "</a>";

           html += "";
           html += "</div>";
           html += "</li>";
		   $('#groups_day_ul').append(html);
	   }
	   $('#groups_day_ul').listview('refresh');

   }



/*
 * Fill student attendance sheet
 */
function queryStudentsAttendanceSuccess(tx, results) {
    var len = results.rows.length;

    console.log("queryStudentsAttendanceSuccess.Number of student - rows inserted: " +  len);

    $('#students_attendance_ul').empty();
    var html="";
    var id=0;
    var photo="";
    var name="";
    var surname="";
    for (var i=0;i<len;i++) {
        id = results.rows.item(i).id;
        photo = results.rows.item(i).photo;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;

        html = "<li>";
//         html += "<div data-role='fieldcontain'>";
//         html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
//         html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";

// TODO: Añadir un combobox con Asistencia/Puntualidad/Asistencia_justificada/Expulsión ....
        html += "<a onClick='id_global="+ id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/"+photo +"' alt='" + surname + "' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
        html += "</a>";
        html += "<label>"+ surname +" "+ name +"</label>";
//           html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
//         html += "</div>";
        html += "</li>";
        $('#students_attendance_ul').append(html);

    }

    $('#students_attendance_ul').listview('refresh');

}

function queryActivitiesSuccess(tx, results) {
    var len = results.rows.length;
	   console.log("Last inserted activity - row ID = " + results.insertId);
	   console.log("Number of activity - rows inserted: " +  len)

	   $('#activities_ul').empty();
	   var id=0;
//	   $('#activities_ul') // poner a vacío
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;
		   $('#activities_ul').append("<li   onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");
	   }
	   $('#activities_ul').listview('refresh');


   }

   // Insert new group
   function insertNewGroup(db, name, other_data){
	   var db2= db;
	   var name2= name;
	   var other_data2 = other_data;

	   db2.transaction(function (tx) {
		   var sql = 'INSERT INTO GROUPS (id, data, other_data) VALUES (NULL,';
		   sql  +=  '\"'  + name2 + '\" ,  \"'+ other_data2 + '\"  )' ;
		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito insertando datos \n");
		   }, errorCB );
	   });
	   $('#grupos_ul').listview('refresh');
   }

   function 	insertNewStudent(db, name, surname, group_id) { // TODO : insert new Student
	   var db2= db;
	   var name2= name;
	   var surname2 = surname;
	   var group_id2 = group_id;

	   db2.transaction(function (tx) {
// tx.executeSql('INSERT INTO STUDENTS (id, group_id, name, surname) VALUES (NULL,1, "First"," student")');
		   var sql = 'INSERT INTO STUDENTS (id, group_id, name, surname) VALUES (NULL,';
		   sql += group_id2 +',';
		   sql +=  '\"'  + name2 + '\" ,  \"'+ surname2 + '\"  )' ;
		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito insertando datos en STUDENTS " + sql + "\n" );
		   }, errorCB );
	   });
	   $('#students_ul').listview('refresh');
}

   function 	insertNewActivity(db, name, other_data) { // TODO
	   var db2= db;
	   var name2= name;
	   var other_data2 = other_data;

	   db2.transaction(function (tx) {
// tx.executeSql('INSERT INTO STUDENTS (id, group_id, name, surname) VALUES (NULL,1, "First"," student")');
		   var sql = 'INSERT INTO STUDENTS (id, data, other_data) VALUES (NULL,';
		   sql  +=  '\"'  + name2 + '\" ,  \"'+ other_data2 + '\"  )' ;
		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito insertando datos en estudiantes \n" );
		   }, errorCB );
	   });
	   $('#students_ul').listview('refresh');


}


// delete
   function deleteRawRecord(db, table, id){
	   var db2 = db;
	   var id2 = id;
	   var table2 = table;

	   db2.transaction(function (tx) {
		   var sql = 'DELETE FROM '+table2 +' WHERE id='+id2 ;

		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito borrando datos  " + table2 + " registro" + id);
		   }, errorCB );
	   });
   }

   //groups_day_ul
   // loadSchedule

   function loadSchedule(db, this_day) {

	   db.transaction( querySchedulePerDayDB, errorCB, successCB);

//	   queryScheduleSuccess
//	   db.transaction(queryGroupsDB, errorCB, successCB);
// groups_day_ul
   }

// load all

   function loadGroups(db)
   {
	   db.transaction(queryGroupsDB, errorCB, successCB);
   }

   function loadStudents(db)
   {
	   db.transaction(queryStudentsDB, errorCB, successCB);
   }
   function loadStudentsByGroup(db)
   {
	   db.transaction(queryStudentsByGroupDB, errorCB, successCB);
   }
   function loadStudentAttendance(db) {

	   db.transaction(queryStudentsAttendanceDB, errorCB, successCB);

   }

   function loadActivities(db) {

	   db.transaction(queryActivitiesDB, errorCB, successCB);
   }
 /*
  * loadTimeTable(db) {
  * }
  * + ...
  *
  * */

