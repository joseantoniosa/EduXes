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

// Modo de depuración
var DEBUG = true;

// Referencia á base de datos
//
// var db;
var id_global;
var table_global;
var week_day_global=-1;
// new API:
var global_db;
var global_session; // selected session
var global_actual_date ; // Date

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
    log("Error processing SQL code : "+err.code);
    alert("STOP! Error processing SQL ");
    log("Error processing SQL message: "+err.message);
}

    function successCB() {
    	log("Success ");
    }
function createDB(tx) {

        var sql = "";
        var create_attendance ="";

// tx.executeSql(sql , [], querySuccess, errorCB)

        tx.executeSql('DROP TABLE IF EXISTS GROUPS;',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error");
                alert(" There has been an error 0: " + e);
                return false;
                }
            );  // To be removed on production
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error");
                alert(" There has been an error 1: " + e.message);
                return false;
                });

        tx.executeSql('DROP TABLE IF EXISTS STUDENTS;',[],
            dbSuccessFunc = function(tx,rs){ return true;},
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 2: " + e);
                return false;
                });  // To be removed on production
        var create_students="CREATE TABLE IF NOT EXISTS students ";
        create_students +=" (id integer primary key, id_group integer not null, name text, surname text,";
        create_students +=" repeteated integer, n_date text , photo text, ";
        create_students +=" tutor TEXT, address TEXT, phone text, e_phone text, nation text, ";
        create_students +=" FOREIGN KEY(id_group) REFERENCES groups(id));";
        log( create_students);
        tx.executeSql(create_students,[],
            dbSuccessFunc = function(tx,rs){ return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 3: " + e);
                return false;
                });

//        -- Sessions ( franja horaria)
        tx.executeSql('DROP TABLE IF EXISTS sessions;'); // To be removed on production
        var create_session="CREATE TABLE IF NOT EXISTS sessions (id  integer primary key,";
        create_session +="description text, h_start text, h_end text);";
        tx.executeSql(create_session,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 4: " + e);
                return false;
                });

//      -- Teacher's schedule
        tx.executeSql('DROP TABLE IF EXISTS teacher_schedule;'); // To be removed on production
        var create_schedule = "CREATE TABLE IF NOT EXISTS teacher_schedule (id  integer primary key,";
        create_schedule +=" id_teacher integer, id_session integer, day integer, id_group integer,";
        create_schedule +="FOREIGN KEY(id_group) REFERENCES groups(id),";
        create_schedule +="FOREIGN KEY(id_session) REFERENCES sessions(id));";
//         create_schedule +="FOREIGN KEY(id_teacher) REFERENCES teachers(id));";
        tx.executeSql(create_schedule,[],
            dbSuccessFunc = function(tx,rs){ return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 5: " + e);
                return false;
                });

        var create_attendance = "DROP TABLE IF EXISTS ATTENDANCE;"; // To be removed on production
        create_attendance += " CREATE TABLE IF NOT EXISTS ATTENDANCE ( id  integer primary key , ";
        create_attendance += " id_group integer, id_student integer, id_session integer, a_type integer, a_date text, ";
        create_attendance += " FOREIGN KEY(id_student) REFERENCES students(id),";
        create_attendance += " FOREIGN KEY(id_group) REFERENCES groups(id),";
        create_attendance += " FOREIGN KEY(id_session) REFERENCES sessions(id));";


    //tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
        tx.executeSql(create_attendance,[],
            dbSuccessFunc = function(tx,rs){
                alert(" Table Attendance created: " + create_attendance);
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error create_attendance: " + e);
                return false;
                });


    }
function populateDB(tx) {


// Groups
        tx.executeSql('INSERT INTO GROUPS ( data) VALUES ( "First group  1")');
        tx.executeSql('INSERT INTO GROUPS ( data) VALUES ( "Second group 2")');
        tx.executeSql('INSERT INTO GROUPS ( data) VALUES ( "Third group  3" )');
        tx.executeSql('INSERT INTO GROUPS ( data) VALUES ( "Fourth group 4")');
// Students
        var header="INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (";
        tx.executeSql(header +'0, "0First"," Student 0", "f001.png" )');
        tx.executeSql(header +'0, "0Second"," Student 0", "f002.png" )');
        tx.executeSql(header +'0, "Bis "," Maxi ", "f008.png" )');
        tx.executeSql(header +'0, "0Third "," Student 0", "f003.png" )');
        tx.executeSql(header +'1, "First",  " Student",   "f004.png" )');
        tx.executeSql(header +'1, "Second"," Student", "f005.png" )');
        tx.executeSql(header +'1, "Third "," Student", "f006.png" )');
        tx.executeSql(header +'2, "Fourth"," Student", "f007.png" )');
        tx.executeSql(header +'2, "Fith"," Student", "f008.png" )');
        tx.executeSql(header +'3, "Sixth"," Student", "f009.png" )');
        tx.executeSql(header +'3, "Seventh ","student", "f010.png" )');
        tx.executeSql(header +'3, "Eighth ","student 11 ", "f011.png" )');

//        -- Sessions ( franja horaria)
        var header="INSERT INTO sessions (description, h_start, h_end) VALUES ( ";
        tx.executeSql(header +'"First", "09:00", "09:50" )');
        tx.executeSql(header +'"Second", "09:50", "10:40" )');
        tx.executeSql(header +'"Third", "10:40", "11:30" )');
        tx.executeSql(header +'"Recreation", "11:30", "12:00" )');
        tx.executeSql(header +'"Fourth", "12:00", "12:50" )');
        tx.executeSql(header +'"Fith", "12:50", "13:40" )');
        tx.executeSql(header +'"Sixth", "13:40", "14:30" )');
// SELECT id, description, h_start, h_end FROM sessions WHERE id=

//		-- Teacher's schedule
        // populate:
        var header="INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (";
        tx.executeSql(header +'0, 1, 0 )'); // 1st hour (0), Monday (1)  1st group (0)
        tx.executeSql(header +'1, 1, 1 )'); // 2nd hour (1), Monday (1)  2nd group (1)
        tx.executeSql(header +'2, 1, 1 )'); // 3rd hour (2), Monday (1)  2nd group (1)
        tx.executeSql(header +'0, 2, 0 )'); // 1st hour (0), Tuesday (2)  1st group (0)
        tx.executeSql(header +'5, 2, 1 )'); // 6th hour (2), Tuesday (2)  2nd group (1)
        tx.executeSql(header +'0, 3, 1 )'); // 1st hour (0), Wednesday (3)  2nd group (1)
        tx.executeSql(header +'1, 3, 2 )'); // 2nd hour (1), Wednesday (3)  3nd group (2)
        tx.executeSql(header +'2, 3, 0 )'); // 3rd hour (2), Wednesday (3)  1st group (0)
        tx.executeSql(header +'0, 4, 0 )'); // 1st hour (0), Thursday (4)  1st group (0)
        tx.executeSql(header +'2, 4, 1 )'); // 3rd hour (2), Thursday (4)  2nd group (1)
        tx.executeSql(header +'0, 5, 1 )'); // 1st hour (0), Friday (5)  2nd group (0)
        tx.executeSql(header +'2, 5, 0 )',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error");
                alert(" There has been an error 00: " + e.message);
                return false;
                }); // 3rd hour (2), Friday (5)  1st group (1)
;


// Attendance:
//  Careful with sessions, date, and id_group.  Should be enter by hand.
        var header ="INSERT INTO ATTENDANCE ( id_group , id_student, id_session, type, a_date) VALUES (";
        tx.executeSql(header +'0, 0, 0,1, date(\'now\')   );'); // 0,          0,          0,         1,   date('now')
        tx.executeSql(header +'0, 0, 1,1, date(\'now\')   );',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error inserting data ");
                alert(" There has been an error 00: " + e);
                return false;
                }
        );

        tx.executeSql(header +'1, 0, 1,1, date(\'now\')   );',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error inserting data ");
                alert(" There has been an error 00: " + e);
                return false;
                }
        );

        // 0,          0,          1,         1,   date('now')
//

        //
/*
//	Activities        TODO
    	tx.executeSql('DROP TABLE IF EXISTS ACTIVITIES;');
    	var create_activities="CREATE TABLE IF NOT EXISTS ACTIVITIES ";
    	create_activities +="(id integer primary key, description text, date_init text, date_end text, weight real); ";
    	log(create_activities);
        tx.executeSql(create_activities);

    	var header = "INSERT INTO ACTIVITIES ( description,date_init, date_end ,weight) VALUES (";

        tx.executeSql( header + '"Activity 1", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 2", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 3", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 4", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 5", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 6", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 7", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 8", "2012-01-01", "2012-02-01", 0.1 )');
        tx.executeSql( header + '"Activity 9", "2012-01-01", "2012-02-01", 0.2 )');
**/

   }

   function queryDB(tx) {
	    tx.executeSql('SELECT * FROM GROUPS',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert("Error");
                log(" There has been an error Select * from groups : " + e.message);
                return false;
            });
	}


function queryGroupsDB(tx) {
    log("Query Groups \n");
    var ul_list =$('#groups_ul');
    tx.executeSql('SELECT * FROM GROUPS', [], dbSuccessFunc = function(tx, rs) {
        ul_list.empty();
        for (var i = 0; i < rs.rows.length; i++) {
            html = "<li><h3> ";
            html += "<a onClick='id_global=" + rs.rows.item(i).id + "; table_global=\"groups\"; ";
            html += " listStudentsByGroupAttendance(" + rs.rows.item(i).id + ",-1 );'  ";
            html += " href='#' data-transition='slideup'>";
            html += rs.rows.item(i).data;
  //  html += "<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
            html += "</a></h3></li>";
            ul_list.append(html);
        }
        ul_list.listview('refresh');
    }, dbErrorFunc = function(ttx, e) {
        if (ttx.message)
            e = ttx;
        alert("Error");
        log(" There has been an error Select * from groups : " + e.message);
        return false;
    });
}

/*
 * For Students Attendance
 */
function queryGroupsAttendanceDB(tx) {
    log("Query Groups \n");
    var ul_list = $('#groups_attendance_ul');
    tx.executeSql('SELECT * FROM GROUPS', [], dbSuccessFunc = function(tx, rs) {
        ul_list.empty();
        for (var i = 0; i < rs.rows.length; i++) {
            html = "<li><h3> ";
            html += "<a onClick='id_global=" + rs.rows.item(i).id + "; table_global=\"groups\"; ";
            html += " listStudentsByGroupAttendance(" + rs.rows.item(i).id + ",-1 );'  ";
            html += " href='#' data-transition='slideup'>";
            html += rs.rows.item(i).data  ;
            html += "</a></h3></li>";
            ul_list.append(html);
        }
        ul_list.listview('refresh');

    }, dbErrorFunc = function(ttx, e) {
        if (ttx.message)
            e = ttx;
        alert("Error");
        log(" There has been an error Select * from groups : " + e.message);
        return false;
    });
}



   function queryStudentsDB(tx) {
	   log("Query Students \n");
	   var sql = 'SELECT * FROM STUDENTS';
	   tx.executeSql(sql, [],
        queryStudentsSuccess,
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                alert("Error");
                log(" There has been an error queryStudentsDB: " + e.message);
                return false;
            });
	}



function queryStudentsByGroupDB(tx) {
    // pass from and global id!!
    var sql = 'SELECT * FROM STUDENTS WHERE id_group=' + id_global;
    tx.executeSql(sql, [], queryStudentsSuccess, dbErrorFunc = function(tx, e) {
        if (tx.message)
            e = tx;
        alert("Error");
        log(" There has been an error queryStudentsByGroupDB: " + e.message);
        return false;
    });
}

/*
* Query groups per day - Main Window -
*/
   function querySchedulePerDayDB(tx){
	   var query = "SELECT teacher_schedule.id_session, teacher_schedule.day, teacher_schedule.id_group as t_id_group, teacher_schedule.id_session as t_id_session, ";
	   query += " groups.id as g_id, groups.data as description, sessions.id as s_id, sessions.h_start as s_h_start, sessions.h_end as s_h_text FROM teacher_schedule, groups, sessions ";
	   query += " WHERE day=" +week_day_global + " AND g_id=t_id_group AND t_id_session=s_id  ORDER BY t_id_session;";

       log("querySchedulePerDayDB:" + query);
	   tx.executeSql(query,[],
            dbSuccessFunc = function(tx,rs){
                queryScheduleSuccess(tx, rs);
                },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                alert("Error");
                alert(" There has been an error QuerySchedulePerDayDB: " + e.message);
                return false;
            });
   }

// TODO: Rellenar con el query para averiguar asistencia, etc.. de los alumnos de tal grupo
//          de entre una fecha dada. global_actual_date
// XXX: Rellenar con datos reales

   function queryStudentsAttendanceByGroupDB(tx){

// buscar el lunes de global_actual_date
// SELECT * FROM STUDENTS, ATTENDANCE WHERE id_group= and... and fecha<fecha_primer and fecha>fecha_segunda
//       var sql ='SELECT * FROM STUDENTS WHERE id_group='+id_global;

        var monday_date = clone(global_actual_date);
        var friday_date = clone(global_actual_date);

        monday_date= moment(monday_date).day(1).toDate(); // Monday
        friday_date = moment(friday_date).day(5).toDate(); // Friday
        /*
    CREATE  TABLE IF NOT EXISTS ATTENDANCE ( id  integer primary key ,
            id_group integer, id_student integer, id_session integer, type integer, date text,
            FOREIGN KEY(id_session) REFERENCES sessions(id) );

    CREATE TABLE IF NOT EXISTS STUDENTS (
            id integer primary key, id_group integer not null, name text, surname text,
            repeteated integer, n_date text ,
            tutor TEXT, address TEXT, phone text, e_phone text, nation text,
            FOREIGN KEY(group_id) REFERENCES groups(id));

    CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text);

      UPDATE t1 SET timeEnter = DATETIME('NOW')  WHERE rowid = new.rowid;

*/
        var sql = "SELECT GROUPS.id, STUDENTS.id_group, STUDENTS.id, STUDENTS.name, STUDENTS.surname, ";
        sql += " ATTENDANCE.id_group, ATTENDANCE.id_student, ATTENDANCE.type, ATTENDANCE.a_date FROM ";
        sql += " GROUPS, STUDENTS, ATTENDANCE ";
        sql += " WHERE (groups.id=students.id_group AND groups.id = ATTENDANCE.id_group ) AND (groups.id = " + id_global;
        sql += " AND students.id=ATTENDANCE.id_student )";
        sql += " GROUP BY groups.id ORDER BY students.id ; ";


        sql = "SELECT  STUDENTS.id_group, STUDENTS.id, STUDENTS.name, STUDENTS.surname, ";
        sql += " ATTENDANCE.id_group, ATTENDANCE.id_student, ATTENDANCE.a_type, ATTENDANCE.a_date FROM ";
        sql += " STUDENTS, ATTENDANCE ";
        sql += " WHERE (students.id_group= ATTENDANCE.id_group ) AND ( ATTENDANCE.id_group = " + id_global;
        sql += " AND students.id=ATTENDANCE.id_student )";
        sql += " GROUP BY ATTENDANCE.id_group ORDER BY students.id ; ";



        alert(sql);
       log(" queryStudentsAttendancByGroupeDB " + sql);
       tx.executeSql(sql,[], queryStudentsAttendanceByGroupSuccess,
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                alert(" There has been an error queryStudentsAttendanceByGroupDB: " + e);
                return false;
            });

   }



   function queryStudentsAttendanceDB(tx){

	   var sql ='SELECT * FROM STUDENTS WHERE id_group='+id_global;

	   log(" queryStudentsAttendanceDB " + sql);
	   tx.executeSql(sql,[], queryStudentsAttendanceSuccess,
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                alert("Error");
                alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
                return false;
            });

   }

   function queryActivitiesDB(tx) {
	   log("Query Activities \n");
	   tx.executeSql('SELECT * FROM ACTIVITIES');
	}

function queryGroupsSuccess(tx, results) {
    var len = results.rows.length;
    var html = "";
    var ul_list = $('#groups_to_edit_ul');

    ul_list.empty();
    for (var i = 0; i < len; i++) {
        html = "<li><h3> ";
        // listStudentsAttendance (id_group, -1), -1=> any session
        html += "<a onClick='id_global=" + results.rows.item(i).id + "; table_global=\"groups\"; ";
        html += " listStudentsAttendance(" + results.rows.item(i).id + ",-1 );'  ";
        html += " href='index.html#list_students_attendance' data-transition='slideup'>";
        html += results.rows.item(i).data + "</a></h3>";
        html += "<a onClick='id_global=" + results.rows.item(i).id + "; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
        html += "</a></li>";
        ul_list.append(html);
    }
    ul_list.listview('refresh');
}




function queryStudentsSuccess(tx, results) {
    var len = results.rows.length;
    var ul_list = $('#students_ul');
    log("Last inserted student - row ID = " + results.insertId);
    log("Number of student - rows inserted: " + len);

    ul_list.empty();
    var html;
    var id = 0;
    for (var i = 0; i < len; i++) {
        id = results.rows.item(i).id;

        html = "<li>";
        //		   html += "<div data-role='fieldcontain'>";
        // 		   html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
        // 		   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";

        html += "<a onClick='id_global=" + results.rows.item(i).id + "; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/" + results.rows.item(i).photo + "' alt='" + results.rows.item(i).surname + "' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
        html += "</a>";
        html += "<label>" + results.rows.item(i).surname + " " + results.rows.item(i).name + "</label>";
        html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
        //		   html += "</div>";
        html += "</li>";
        // html += results.rows.item(i).id+"</a> </li>";
        ul_list.append(html);

    }
    ul_list.listview('refresh');

}

/*
 *  Main Window
 * // XXX El trabajo está aquí
 * TODO     List of groups per day
 */
   function queryScheduleSuccess(tx, results) {

       var len = results.rows.length;

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
    var html="";
    var id=0;
    var photo="";
    var name="";
    var surname="";
    var id_group=0;
    var id_session=0;
    $('#students_attendance_ul').empty();

    for (var i=0;i<len;i++) {
        id = results.rows.item(i).id;
        photo = results.rows.item(i).photo;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;
        id_group = results.rows.item(i).id_group;

        id_session = global_session; //

        html = "<li>";

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






/*
 * Tabla con lista de alumnos y sus faltas de puntualidad, etc...
 * TODO: Falta la lista de alumnos, podría ir una ventana para gestionar las faltas de cada alumno...
 *  Como construyo una tabla?, anoto todos los días, o sólo los días en los que faltó el alumno en cuestión
 *  Se podría hacer una primera pasada para ver cuántas columnas tiene de máximo,
 * XXX: Any idea about table layout?
 *
 */



function queryStudentsAttendanceByGroupSuccess(tx, results) {
    var len = results.rows.length;
    var html = "";

    var id = 0;
    var name = "";
    var surname ="";
    var id_group =0;
    var id_session = global_session; //


    var table_list =$('#students_attendance_by_groups_table');



//    tmp_date = moment(global_actual_date);
//    var day_of_week = moment(tmp_date).day(); // Day of week 0-6
//    // moment.weekdaysMin = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//    var this_monday = tmp_date.substract('days', day_of_week );
//    var this_friday = tmp_date.add('days',4- day_of_week ); // Friday = 4

    var monday_date = clone(global_actual_date);
    var friday_date = clone(global_actual_date);

    $('#current_group_attendance_by_group').text("Group");

    monday_date= moment(monday_date).day(1); // Monday
    friday_date = moment(friday_date).day(5); // Friday


    $('#students_attendance_by_groups_li').text( textDateYear(monday_date.toDate()) + "- " + textDateYear(friday_date.toDate() ) );

    table_list.empty();
    html =' <thead><tr> <th><abbr title="Name">Name</abbr></th>';
    html +=' <th>M</th> <th>T</th> <th>W</th>   <th>T</th>  <th>F</th>   </tr> </thead> <tbody>';
    table_list.append(html);


    for (var i=0;i<len;i++) {
        id = results.rows.item(i).id;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;
        id_group = results.rows.item(i).id_group;

        html ="<tr>";
        html +="<td>"+surname + " "+ name+"</td>";
        html +="<td> 1 </td>"; // Faltas de lunes
        html +="<td> 1 </td>";// Faltas de martes
        html +="<td> 1 </td>";// Faltas de miércoles
        html +="<td> 0 </td>";// Faltas de jueves
        html +="<td> 1 </td>";// Faltas de viernes
        html +="</tr>";

        table_list.append(html);
    }



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
		   var sql = 'INSERT INTO GROUPS ( data, other_data) VALUES (';
		   sql  +=  '\"'  + name2 + '\" ,  \"'+ other_data2 + '\"  )' ;
		   tx.executeSql(sql);
	   });
	   $('#grupos_ul').listview('refresh');
   }
// TODO : insert new Student
   function 	insertNewStudent(db, name, surname, id_group) {
	   var db2= db;
	   var name2= name;
	   var surname2 = surname;
	   var group_id2 = id_group;

	   db2.transaction(function (tx) {
		   var sql = 'INSERT INTO STUDENTS ( id_group, name, surname) VALUES (';
		   sql += group_id2 +',';
		   sql +=  '\"'  + name2 + '\" ,  \"'+ surname2 + '\"  )' ;
		   tx.executeSql(sql );
	   });
	   $('#students_ul').listview('refresh');
}
//
// Write Student's state
// TODO: Define SQL query
function updateStudentState(db, id_student, id_group, id_session, state, actual_date ){

    var db2 = db;

    db2.transaction(function(tx) {
        var sql ="INSERT INTO ATTENDANCE ( id_group , id_student, id_session, type, date) VALUES (";
        sql += id_group + "," + id_student+ "," + id_session+ "," + state+ ",\" " + actual_date.toString()+"\" );";
        log("updateStudentState : " + sql + "\n");

        tx.executeSql(sql );
    });


}
//

function insertNewActivity(db, name, other_data) {// TODO
    var db2 = db;
    var name2 = name;
    var other_data2 = other_data;

    db2.transaction(function(tx) {
        var sql = 'INSERT INTO STUDENTS ( data, other_data) VALUES (';
        sql += '\"' + name2 + '\" ,  \"' + other_data2 + '\"  )';
        tx.executeSql(sql);
    });
    $('#students_ul').listview('refresh');

}

// delete
   function deleteRawRecord(db, table, id){
	   var db2 = db;
	   var id2 = id;
	   var table2 = table;

	   db2.transaction(function (tx) {
           var sql = 'DELETE FROM ' + table2 +' WHERE id=' + id2 ;
           tx.executeSql(sql);
	   });
   }

   //groups_day_ul
   // loadSchedule

   function loadSchedule(db, this_day) {
       global_db.transaction( querySchedulePerDayDB);
   }

// load all

   function loadGroups(db) {
       db.transaction(queryGroupsDB);
   }


   function loadGroupsAttendance(db) {
	   db.transaction(queryGroupsAttendanceDB);
   }

   function loadStudents(db) {
	   db.transaction(queryStudentsDB);
   }

   function loadStudentsByGroup(db) {
	   db.transaction(queryStudentsByGroupDB);
   }
/*
 * For Students Attendance Table
 */
    function loadStudentsAttendanceByGroup(db) {
       db.transaction(queryStudentsAttendanceByGroupDB);

   }


   function loadStudentAttendance(db) {
	   db.transaction(queryStudentsAttendanceDB);

   }

   function loadActivities(db) {
	   db.transaction(queryActivitiesDB, errorCB, queryActivitiesSuccess);
   }
 /*
  * loadTimeTable(db) {
  * }
  * + ...
  *
  * */

