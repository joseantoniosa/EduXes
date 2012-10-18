// Referencia á base de datos
//
// var db;
var id_global;
var table_global;
var week_day_global=-1;
// new API:
var global_db;
var global_session; // selected session
var global_actual_date ;

// ENUM
var STATE_NONE = 0;
var STATE_ABSENCE = 1;
var STATE_UNPUNCTUAL = 2;
var STATE_EXCUSED = 3;
var STATE_BEHAVIOR = 4;

//
//

//dbErrorFunc = function(tx, e) {
//    if (tx.message) e = tx;
//    alert("There has been an error: " + e.message);
//    return false;
//}

function errorCB(err) {
    console.log("Error processing SQL code : "+err.code);
    alert("Error processing SQL: "+err.message);
    console.log("Error processing SQL message: "+err.message);
}

    function successCB() {
    	console.log("Success ");
    }
function createDB(tx) {

        var sql = "";
        var create_attendance ="";


        tx.executeSql('DROP TABLE IF EXISTS GROUPS;',[],errorCB, successCB);  // To be removed on production
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)',successCB, errorCB);

        tx.executeSql('DROP TABLE IF EXISTS STUDENTS;',[],successCB, errorCB);  // To be removed on production
        var create_students="CREATE TABLE IF NOT EXISTS STUDENTS ";
        create_students +=" (id integer primary key, id_group integer not null, name text, surname text,";
        create_students +=" repeteated integer, n_date text , photo text, ";
        create_students +=" tutor TEXT, address TEXT, phone text, e_phone text, nation text, ";
        create_students +=" FOREIGN KEY(id_group) REFERENCES groups(id));";
        console.log( create_students);
        tx.executeSql(create_students,[],successCB, errorCB);

//        -- Sessions ( franja horaria)
        tx.executeSql('DROP TABLE IF EXISTS sessions;'); // To be removed on production
        var create_session="CREATE TABLE IF NOT EXISTS sessions (id  integer primary key,";
        create_session +="description text, h_start text, h_end text);";
        tx.executeSql(create_session,[],successCB, errorCB);

//      -- Teacher's schedule
        tx.executeSql('DROP TABLE IF EXISTS teacher_schedule;'); // To be removed on production
        var create_schedule = "CREATE TABLE IF NOT EXISTS teacher_schedule (id  integer primary key,";
        create_schedule +=" id_teacher integer, id_session integer, day integer, id_group integer,";
        create_schedule +="FOREIGN KEY(id_group) REFERENCES groups(id),";
        create_schedule +="FOREIGN KEY(id_session) REFERENCES sessions(id));";
//         create_schedule +="FOREIGN KEY(id_teacher) REFERENCES teachers(id));";
        tx.executeSql(create_schedule,
            [],
            successCB,
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" 0 There has been an error: " + e.message);
                return false;
                }
                );


        var create_attendance = "DROP TABLE IF EXISTS attendance;"; // To be removed on production
        create_attendance += " CREATE  TABLE IF NOT EXISTS attendance ( id  integer primary key , ";
        create_attendance += " id_group integer, id_student integer, id_session integer, type integer, date text, ";
        create_attendance +=" FOREIGN KEY(id_session) REFERENCES sessions(id));";

    //tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
        tx.executeSql(create_attendance,
            [],
            successCB,
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error create attendance: " + e.message);
                return false;
                }
            );


    }
    function populateDB(tx) {


// Groups
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "First group  1")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Second group 2")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Third group  3" )');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Fourth group 4")');
// Students
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
        // populate:
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




        var header ="INSERT INTO attendance (id, id_group , id_student, id_session, type, date) VALUES (";
//        tx.executeSql(header+ "NULL,   ); ");
//        tx.executeSql(header+ "NULL,   ); ");
//        tx.executeSql(header+ "NULL,   ); ");


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
// listStudentsAttendance (id_group, -1), -1=> any session
           html += "<a onClick='id_global="+ results.rows.item(i).id + "; table_global=\"groups\"; ";
           html += " listStudentsAttendance("+results.rows.item(i).id  +",-1 );'  ";
           html += " href='index.html#list_students_attendance' data-transition='slideup'>";
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
// organizados por  t_id_session
  	   $('#groups_day_ul').empty();
	   var html;
	   var id=0;
	   var description="";
	   var start = "";
	   var t_id_session=-1;
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;
           t_id_session = results.rows.item(i).t_id_session;

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
           html += " onClick=\"listStudentsAttendance(" + results.rows.item(i).t_id_group + ","+t_id_session + ");\">" + description + "</a>";

           html += "";
           html += "</div>";
           html += "</li>";
		   $('#groups_day_ul').append(html);
	   }
	   $('#groups_day_ul').listview('refresh');

   }


/*
 * Fill student attendance sheet
 * TODO: Revisar presentación ¿letras más pequeñas?)
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
    var id_group=0;
    var id_session=0;

    for (var i=0;i<len;i++) {
        id = results.rows.item(i).id;
        photo = results.rows.item(i).photo;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;
        id_group = results.rows.item(i).id_group;

        id_session = global_session; //

        html = "<li>";
//         html += "<div data-role='fieldcontain'>";
//         html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
//         html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";


        html += "<a onClick='id_global="+ id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/"+photo +"' alt='" + surname + "' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
        html += "</a>";
        html += "<label>"+ surname +" "+ name +"</label>";
// Select combo :
        html +="";

        html +="<select name='select-student_"+id+"' id='select-student_"+id+"' ";
        html += " onChange='studentState("+id + "," +id_group + ","+id_session+ ");'>";
// function studentState(id_student, id_group, id_session) {

        html +="<option value=''></option>";
        html +="<option value='Absence'>Absence</option>";
        html +="<option value='Unpunctuality'>Unpunctuality</option>";
        html +="<option value='Excused'>Excused</option>";
        html +="<option value='Behavior' name='Behavior' >Behavior</option>";
        html +="";
        html +="</select>";

        html += "</li>";
        $('#students_attendance_ul').append(html);

    }

    $('#students_attendance_ul').listview('refresh');

}

function queryActivitiesSuccess(tx, results) {
    var len = results.rows.length;

    $('#activities_ul').empty();
    var id=0;
    for (var i=0;i<len;i++) {
       id = results.rows.item(i).id;
       $('#activities_ul').append("<li onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");
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

   function 	insertNewStudent(db, name, surname, id_group) { // TODO : insert new Student
	   var db2= db;
	   var name2= name;
	   var surname2 = surname;
	   var group_id2 = id_group;

	   db2.transaction(function (tx) {
		   var sql = 'INSERT INTO STUDENTS (id, id_group, name, surname) VALUES (NULL,';
		   sql += group_id2 +',';
		   sql +=  '\"'  + name2 + '\" ,  \"'+ surname2 + '\"  )' ;
		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito insertando datos en STUDENTS " + sql + "\n" );
		   }, errorCB );
	   });
	   $('#students_ul').listview('refresh');
}
//
// Write Student's state
// TODO: Define SQL query
function updateStudentState(db, id_student, id_group, id_session, state, actual_date ){

    var db2 = db;

    db2.transaction(function(tx) {
        var sql ="INSERT INTO attendance ( id_group , id_student, id_session, type, date) VALUES (";
        sql += id_group + "," + id_student+ "," + id_session+ "," + state+ ",\" " + actual_date.toString()+"\" );";
//        sql += id_group + "," + id_student+ "," + id_session+ "," + state+ ",\"2/2/2012\" );";
        console.log("SQL =>[" + sql + "]\n");
        alert(sql);

        tx.executeSql(sql, [],
            function(tx, results) {
                console.log("Sucesss in attendance " + sql + "\n");
            },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("There has been an error in updateStudentState: " + e.message);
                return false;
            }
        );
    });


}
//

function insertNewActivity(db, name, other_data) {// TODO
    var db2 = db;
    var name2 = name;
    var other_data2 = other_data;

    db2.transaction(function(tx) {
        var sql = 'INSERT INTO STUDENTS (id, data, other_data) VALUES (NULL,';
        sql += '\"' + name2 + '\" ,  \"' + other_data2 + '\"  )';
        tx.executeSql(sql, [], function(tx, results) {
            console.log("Exito insertando datos en estudiantes \n");
        }, errorCB);
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


//  db.transaction(queryDB, errorCB);
//  tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);

   function loadActivities(db) {

	   db.transaction(queryActivitiesDB, errorCB, successCB);
   }
 /*
  * loadTimeTable(db) {
  * }
  * + ...
  *
  * */

