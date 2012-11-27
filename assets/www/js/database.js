
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
// new API
var global_id;
var global_week_day=-1;
var global_db;
var global_session; // selected session
var global_actual_date=null ; // Date
var global_reports_date=null ; // Date for reports TODO: Date for reports
//
var global_exist = false; // if exist current record

// ENUM
var STATE_NONE = 0;
var STATE_ABSENCE = 1;
var STATE_UNPUNCTUAL = 2;
var STATE_EXCUSED = 3;
var STATE_BEHAVIOR = 4;
/*
 Error callback function
    @function errorCB
    @param {errcode} err - Error Struct

*/
function errorCB(err) {
    log("Error processing SQL code : "+err.code);
    alert("STOP! Error processing SQL ");
    log("Error processing SQL message: "+err.message);
}

function successCB() {
        log("Success ");
}
// Create database and remove if  it exists
function createDB(tx) {
        var sql = "";
        var create_attendance ="";

        tx.executeSql('DROP TABLE IF EXISTS GROUPS;',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 0: " + e);
                return false;
                }
            );  // To be removed on production
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 1: " + e);
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

//        -- Sessions (franja horaria)
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
        tx.executeSql(create_schedule,[],
            dbSuccessFunc = function(tx,rs){ return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 5: " + e);
                return false;
                });
//
        var sql2 = " DROP TABLE IF EXISTS attendance; ";
        tx.executeSql( sql2 ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error sql2: " + e);
                return false;
                });

        var create_attendance = "CREATE TABLE IF NOT EXISTS attendance (id integer primary key , ";
        create_attendance += " id_group integer, id_student integer, id_session integer, a_type integer, a_date text, ";
        create_attendance += " FOREIGN KEY (id_student) REFERENCES students (id), ";
        create_attendance += " FOREIGN KEY (id_group) REFERENCES groups(id), ";
        create_attendance += " FOREIGN KEY (id_session) REFERENCES sessions(id) );" ;
        log(create_attendance);
        tx.executeSql( create_attendance ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" Error:There has been an error create_attendance: " + e);
                return false;
                });
}
function populateDB(tx) {

    log("populateDB. Populate DB");

// Groups
        tx.executeSql('INSERT INTO GROUPS ( id, data) VALUES ( 0, "Second A")');
        tx.executeSql('INSERT INTO GROUPS ( id, data) VALUES ( 1, "Second B")');
        tx.executeSql('INSERT INTO GROUPS ( id, data) VALUES ( 2, "Third A" )');
        tx.executeSql('INSERT INTO GROUPS ( id, data) VALUES ( 3, "Third B")');
// Students
        var header="INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (";
        tx.executeSql(header +'0, "John",   "Doe",        "f001.png" )' );
        tx.executeSql(header +'0, "Daniel", "Mallice",    "f002.png" )' );
        tx.executeSql(header +'0, "Betty",   "Boo", "f008.png" )');
        tx.executeSql(header +'0, "Julian","Assange", "f003.png" )');
        tx.executeSql(header +'1, "Phillip",  "Morris",   "f004.png" )');
        tx.executeSql(header +'1, "John","Lee Hooker", "f005.png" )');
        tx.executeSql(header +'1, "Aretha","Franklin", "f006.png" )');
        tx.executeSql(header +'2, "Vito","Corleone", "f007.png" )');
        tx.executeSql(header +'2, "Alexandra","Milt", "f008.png" )');
        tx.executeSql(header +'3, "Julius","Caesar", "f009.png" )');
        tx.executeSql(header +'3, "Amanda","Hill", "f010.png" )');
        tx.executeSql(header +'3, "Paris","Hilton", "f011.png" )');

//        -- Sessions ( franja horaria)
        var header="INSERT INTO sessions (description, h_start, h_end) VALUES ( ";
        tx.executeSql(header +'"First", "09:00", "09:50" )');
        tx.executeSql(header +'"Second", "09:50", "10:40" )');
        tx.executeSql(header +'"Third", "10:40", "11:30" )');
        tx.executeSql(header +'"Recreation", "11:30", "12:00" )');
        tx.executeSql(header +'"Fourth", "12:00", "12:50" )');
        tx.executeSql(header +'"Fith", "12:50", "13:40" )');
        tx.executeSql(header +'"Sixth", "13:40", "14:30" )');

//        -- Teacher's schedule
        // populate:
        var header="INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (";
        tx.executeSql(header +'0, 1, 0 )'); // 1st hour (0), Monday (1)  1st group (0)
        tx.executeSql(header +'1, 1, 1 )'); // 2nd hour (1), Monday (1)  2nd group (1)
        tx.executeSql(header +'2, 1, 1 )'); // 3rd hour (2), Monday (1)  2nd group (1)
        tx.executeSql(header +'3, 1, 2 )'); // 4th hour (2), Monday (1)  3rd group (2)
        tx.executeSql(header +'0, 2, 0 )'); // 1st hour (0), Tuesday (2)  1st group (0)
        tx.executeSql(header +'5, 2, 1 )'); // 6th hour (2), Tuesday (2)  2nd group (1)
        tx.executeSql(header +'0, 3, 1 )'); // 1st hour (0), Wednesday (3)  2nd group (1)
        tx.executeSql(header +'1, 3, 2 )'); // 2nd hour (1), Wednesday (3)  3rd group (2)
        tx.executeSql(header +'2, 3, 0 )'); // 3rd hour (2), Wednesday (3)  1st group (0)
        tx.executeSql(header +'0, 4, 0 )'); // 1st hour (0), Thursday (4)  1st group (0)
        tx.executeSql(header +'2, 4, 1 )'); // 3rd hour (2), Thursday (4)  2nd group (1)

        tx.executeSql(header +'0, 5, 1 )'); // 1st hour (0), Friday (5)  2nd group (0)
        tx.executeSql(header +'1, 5, 2 )'); // 2nd hour (0), Friday (5)  3nd group (0)
        tx.executeSql(header +'3, 5, 2 )'); // 2nd hour (0), Friday (5)  3nd group (0)
        tx.executeSql(header +'2, 5, 0 )',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;

                alert(" There has been an error 00: " + e);
                return false;
                }); // 3rd hour (2), Friday (5)  1st group (1)

// Attendance:
//  Careful with sessions, date, and id_group.  Should be enter by hand.
        var today = moment(); // today
        var today_str = today.toDate().toDateString();

        var header ="INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (";
        sql = header +'0, 0, 0,1, \''+today_str+'\'  );'; // 0,          0,          0,         1,   date('now')

        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error inserting data attendance: " + e);
                return false;
                });
        sql = header +'0, 0, 1,1,  \''+today_str+'\'   );';
        log(sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error inserting data attendance: " + e);
                return false;
                }
        );
        sql = header +'1, 0, 1,1, \''+today_str+'\' );';
        log(sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error attendance: " + e);
                return false;
                }
        );

        //
/*
//    Activities        TODO
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   function queryDB(tx) {
        tx.executeSql('SELECT * FROM GROUPS',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;

                log(" There has been an error Select * from groups : " + e);
                return false;
            });
    }


function queryGroupsDB(tx) {
    log("Query Groups \n");
    var ul_list =$('#groups_ul');
    tx.executeSql('SELECT * FROM GROUPS', [],
        dbSuccessFunc = function(tx, rs) {
            ul_list.empty();
            for (var i = 0; i < rs.rows.length; i++) {
                html = "<li><h3> ";
                html += "<a onClick='global_id=" + rs.rows.item(i).id + "; table_global=\"groups\"; ";
                html += " listStudentsByGroupAttendance(" + rs.rows.item(i).id + " );'  ";
                html += " href='#' >";
                html += rs.rows.item(i).data;
  //  html += "<a onClick='global_id="+ results.rows.item(i).id +"; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
                html += "</a></h3></li>";
                ul_list.append(html);
            }
            ul_list.listview('refresh'); },
        dbErrorFunc = function(ttx, e) {
            if (ttx.message)
                e = ttx;
            log(" There has been an error Select * from groups : " + e.message);
        return false;
    });
}

/*
 * For Students Attendance
 */
function queryGroupsAttendanceDB(tx) {
    log("Query Groups Attendance \n");
    var ul_list = $('#groups_attendance_ul');
    tx.executeSql('SELECT * FROM GROUPS', [], dbSuccessFunc = function(tx, rs) {
        ul_list.empty();
        table_global="groups";
        for (var i = 0; i < rs.rows.length; i++) {
            html = "<li><h3> ";
            html += "<a onClick='global_id=" + rs.rows.item(i).id + "; table_global=\"groups\"; ";
            html += " listStudentsByGroupAttendance(" + rs.rows.item(i).id + " );'  ";
            html += " href='#' >";
            html += rs.rows.item(i).data  ;
            html += "</a></h3></li>";
            ul_list.append(html);
        }
        ul_list.listview('refresh');

    }, dbErrorFunc = function(ttx, e) {
        if (ttx.message)
            e = ttx;

        log(" There has been an error Select * from groups : " + e);
        return false;
    });
}



function queryAllGroupsDB(tx) {
    log("Query All Groups \n");
    var ul_list =$('#groups_ul');
    tx.executeSql('SELECT * FROM GROUPS', [],
        dbSuccessFunc = function(tx, rs) {
            ul_list.empty();
            var html ="";
            for (var i = 0; i < rs.rows.length; i++) {
                html = "<li><h3> ";
                html += "<a onClick='global_id=" + rs.rows.item(i).id + "; table_global=\"groups\"; ";
                html += " listStudentsByGroup(" + rs.rows.item(i).id + " );'  ";
                html += " href='#' >";
                html += rs.rows.item(i).data;
                html += "</a></h3></li>";
                ul_list.append(html);
            }
            ul_list.listview('refresh'); },
        dbErrorFunc = function(ttx, e) {
            if (ttx.message)
                e = ttx;
            log(" There has been an error Select * from groups : " + e.message);
        return false;
    });
}

///
/// queryAll Students
   function queryAllStudentsDB(tx) {
        log("Query All Students \n");
       var sql = 'SELECT * FROM STUDENTS';
       tx.executeSql(sql, [],
        queryAllStudentsSuccess,
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;

                log(" There has been an error queryAllStudentsDB: " + e);
                return false;
            });
    }

   function queryStudentDB(tx) {
       log("Query Student \n");
       var sql = 'SELECT * FROM STUDENTS WHERE id ='+global_id;
       tx.executeSql(sql, [],
        queryStudentSuccess,
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                log(" There has been an error queryStudentDB: " + e.message);
                alert(" There has been an error queryStudentDB: " + e.message);
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

                log(" There has been an error queryStudentsDB: " + e);
                return false;
            });
    }

/*
 *   id integer primary key, id_group integer not null, name text, surname text,
            repeteated integer, n_date text ,
            tutor TEXT, address TEXT, phone text, e_phone text, nation text,
 */


function queryStudentsByGroupDB(tx) {

    var sql = 'SELECT STUDENTS.id as id,  STUDENTS.id_group as id_group, STUDENTS.name as name, ';
    sql += ' STUDENTS.surname as surname, STUDENTS.n_date as n_date, STUDENTS.photo as photo, ';
    sql += ' STUDENTS.e_phone as e_phone, STUDENTS.repeteated as repeteated, STUDENTS.tutor as tutor ,';
    sql += ' STUDENTS.address as address , STUDENTS.nation as nation, STUDENTS.phone as phone,  ';
    sql += ' GROUPS.id as g_id, GROUPS.data as data  ';
    sql += ' FROM STUDENTS, GROUPS WHERE ';
    sql += ' STUDENTS.id_group = g_id AND id_group=' + global_id;
    tx.executeSql(sql, [], queryStudentsByGroupSuccess, dbErrorFunc = function(tx, e) {
        if (tx.message)
            e = tx;
        log(sql);
        log(" There has been an error queryStudentsByGroupDB: " + e.message);
        alert("There has been an error queryStudentsByGroupDB: " + e.message);
        return false;
    });
}

/*
* Query groups per day - Main Window -
*/
   function querySchedulePerDayDB(tx){
       var query = "SELECT  teacher_schedule.day as week_day, teacher_schedule.id_group as t_id_group, teacher_schedule.id_session as t_id_session,";
       query += " groups.id as g_id, groups.data as g_description, ";
       query += " sessions.id as s_id, sessions.h_start as s_h_start, sessions.h_end as s_h_text ";
       query += " FROM teacher_schedule, groups, sessions ";
       query += " WHERE week_day=" +global_week_day + " AND g_id=t_id_group AND t_id_session=s_id  ORDER BY t_id_session;";

       log("querySchedulePerDayDB:" + query);
       tx.executeSql(query,[],
            dbSuccessFunc = function(tx,rs){
                queryScheduleSuccess(tx, rs);
                },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                alert(" There has been an error QuerySchedulePerDayDB: " + e);
                return false;
            });
   }

// => REPORT <==
// XXX:  SESSIONS.id left

function queryReportAttendanceSuccess(tx, results) {
    var html = "";
    var id = 0;
    var name = "";
    var surname = "";
    var id_group = 0;
    var len = results.rows.length;
    if (len == 0) {
        help("no_data");
    }

    var table_list = $('#students_attendance_by_groups_table');
    var from_to = moment(global_reports_date).day(1).format("MM/DD") + "-" + moment(global_reports_date).day(5).format("MM/DD");

    log("report queryReportAttendanceDB from_to (" + from_to + ")");

    $('#students_attendance_by_groups_li').text(from_to);

    if (len != 0)
        $('#current_group_attendance_by_group').text(results.rows.item(0).g_description);

    table_list.empty();
    html = ' <thead><tr> <th><abbr title="Name">Name</abbr></th>';
    html += ' <th>M</th> <th>T</th> <th>W</th>   <th>T</th>  <th>F</th>   </tr> </thead> <tbody>';
    table_list.append(html);

//    log("report queryReportAttendanceDB nº datos (" + len + ")");

    for (var i = 0; i < len; i++) {
        id = results.rows.item(i).id;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;
        id_group = results.rows.item(i).id_group;
        log("report queryReportAttendanceDB name surname (" + name + " " + surname + ")");
        html = "<tr>";
        html += "<td>" + surname + " " + name + "</td>";
        for (var j = 1; j < 6; j++) {// recorremos la semana, 0 es domingo
            html += "<td>";
            log(" queryStudentsAttendanceByGroupSuccess: [" + moment(global_reports_date).day(j).toDate().toDateString() + "] = [" + results.rows.item(i).a_date + "]");
            if (moment(global_reports_date).day(j).toDate().toDateString() == results.rows.item(i).a_date) {
                html += results.rows.item(i).a_type;
                // Falta indicar la sessión
            } else {
                html += "-";
            }
            html += "</td>";
        }
        html += "</tr>";
        table_list.append(html);
    }
}

function queryReportAttendanceDB(tx) {// report->Attendance->Group

    var sql = "SELECT GROUPS.id, GROUPS.data as g_description, STUDENTS.id_group AS s_g_id, STUDENTS.id as s_id, STUDENTS.name as name , STUDENTS.surname as surname, ";
    sql += " ATTENDANCE.id_group AS a_g_id, ATTENDANCE.id_student, ATTENDANCE.a_type as a_type , ATTENDANCE.a_date as a_date FROM ";
    sql += " STUDENTS, ATTENDANCE, GROUPS ";
    sql += " WHERE (GROUPS.id=s_g_id";
    sql += " AND s_g_id=a_g_id ) AND ( ATTENDANCE.id_group = " + global_id;
    sql += " AND students.id=ATTENDANCE.id_student )";
    sql += " ORDER BY s_id ; ";
// global_reports_date
///    var actual_date = global_actual_date;

    var actual_date = global_reports_date;

    log("report queryReportAttendanceDB (" + sql + ")");

    tx.executeSql(sql, [],
        queryReportAttendanceSuccess,
       dbErrorFunc = function(tx, e) {
        if (tx.message)
            e = tx;
            log(" There has been an error queryReportAttendanceDB: " + e.message);
        alert(" There has been an error queryReportAttendanceDB: " + e.message);
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
        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"groups\"; ";
        html += " listStudentsAttendance(" + results.rows.item(i).id + ",-1 );'  ";
        html += " href='#' data-transition='slideup'>";
//        html += " href='index.html#list_students_attendance' data-transition='slideup'>";
        html += results.rows.item(i).data + "</a></h3>";
        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
        html += "</a></li>";
        ul_list.append(html);
    }
    ul_list.listview('refresh');
}


// Complete list of students
function queryAllStudentsSuccess(tx, results) {
    var len = results.rows.length;
    var ul_list = $('#full_students_ul');
    log("Number of students: " + len);

    ul_list.empty();
    var html;
    var id = 0;
    for (var i = 0; i < len; i++) {
        id = results.rows.item(i).id;
        html = "<li>";
        html += "<a onClick='global_id=" + id + "; table_global=\"students\"; ' href='#' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/" + results.rows.item(i).photo + "' alt='" + results.rows.item(i).surname + "' style='float:left;' class='ui-li-icon ui-corner-none'>";
        html += results.rows.item(i).surname + "," + results.rows.item(i).name;
        html += "</a>";
        html += "<a data-role='button'  data-position-to='window'  data-iconpos='notext' style='float:right;' href='#' data-rel='dialog' data-transition='slideup' onClick=\"EditStudent(" + id + ");\">Edit</a>";
        html += "</li>";
        ul_list.append(html);
    }
    ul_list.listview('refresh');
/*
 * <ul data-role="listview" data-split-icon="gear" data-split-theme="d">
 * <li><a href="index.html">
                <img src="images/album-ws.jpg" />
                <h3>Elephant</h3>
                <p>The White Stripes</p>
                </a><a href="#purchase" data-rel="popup" data-position-to="window" data-transition="pop">Purchase album</a>
            </li>
 */

}
//
// TODO: Edit Student
//      Also Save into database
function queryStudentSuccess(tx, results) {
    var len = results.rows.length;
    var ul_list = $('#full_students_ul');
    log("queryStudentSuccess. Number of students - rows inserted: " + len);
    if(len>0) {
        $('#in_name_student').val(results.rows.item(0).name);
        $('#in_surname_student').val(results.rows.item(0).surname);
        $('#in_id_group_student').val('To be implemented'); // TODO To be implemented
        $('#in_id_group_student').val('To be implemented');
        $('#in_birth_date_student').val(results.rows.item(0).n_date);
    }
// if change:  -> update
// if new -> insert
}

// Settings->Group->Students
function queryStudentsByGroupSuccess(tx, results) {
    var len = results.rows.length;
    log("queryStudentsByGroupSuccess. Number of students - rows inserted: " + len);
    var ul_list = $('#list_students_by_group_ul');
    $('#id_list_students_by_group').text( results.rows.item(0).data );
    var html;
    ul_list.empty();
    var id = 0;
    for (var i = 0; i < len; i++) {
        id = results.rows.item(i).id;
        html = "<li >";
        html += "<a onClick='global_id=" + id + "; table_global=\"students\"; ' href='#' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/" + results.rows.item(i).photo + "' alt='" + results.rows.item(i).surname + "' style='float:left;' class='ui-li-icon ui-corner-none'>";
        html += results.rows.item(i).surname + "," + results.rows.item(i).name;
        html += "</a>";
        html += "<a data-role='button'  data-position-to='window'  data-iconpos='notext' style='float:right;' href='#' data-rel='dialog' data-transition='slideup' onClick=\"EditStudent(" + id + ");\">Edit</a>";
        html += "</li>";
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
        //           html += "<div data-role='fieldcontain'>";
        //            html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
        //            html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";

        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"students\"; ' href='#' data-rel='dialog' data-transition='slideup'>";
// html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
        html += "<img height='20px' src='photos/" + results.rows.item(i).photo + "' alt='" + results.rows.item(i).surname + "' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
        html += "</a>";
        html += "<label>" + results.rows.item(i).surname + " " + results.rows.item(i).name + "</label>";
        html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='#'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
//        html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
        //           html += "</div>";
        html += "</li>";
        // html += results.rows.item(i).id+"</a> </li>";
        ul_list.append(html);

    }
    ul_list.listview('refresh');

}

/*
 *  Main Window
 */
   function queryScheduleSuccess(tx, results) {

       var len = results.rows.length;

         $('#groups_day_ul').empty();

       var html;
       var id=0;
       var description="";
       var start = "";
       var t_id_session=-1;
       log("queryScheduleSuccess number of sessions: "+len );
       for (var i=0;i<len;i++) {
           id = results.rows.item(i).id;
           t_id_session = results.rows.item(i).t_id_session;

//           html += "<div data-role='fieldcontain'>";
//            html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
//            html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";
// TODO: fill with correct fields vvv
        //   html += "<a onClick='global_id="+ results.rows.item(i).id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
        //   html += "<img height='20px' src='photos/"+results.rows.item(i).photo +"' alt='"+results.rows.item(i).surname +"' style='float: left;' class='ui-li-icon ui-corner-none'>  ";
        //   html += "</a>";
        //   html += "<label>"+ results.rows.item(i).surname +" "+ results.rows.item(i).name +"</label>";
        //   html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\">Attendance</a>";
//           html += "</div>";
// query = "SELECT id_session, day, id_group FROM teacher_schedule WHERE day=" +week_day_global + " ORDER BY id_session;";
//
//            var create_session="CREATE TABLE IF NOT EXISTS sessions (id  integer primary key,";
//            create_session +="description text, h_start text, h_end text);";


           start = results.rows.item(i).s_h_start;  // s_h_end
           description = results.rows.item(i).g_description;  // description=group_description
           html = "<li>";
           html += "<div data-role='fieldcontain'>";
           html += start;

           html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='#' ";
//           html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#list_students_attendance' ";
           html += " onClick=\"listStudentsAttendance(" + results.rows.item(i).t_id_group + ","+t_id_session + ");\">" + description + "</a>";

           html += "";
           html += "</div>";
           html += "</li>";
           $('#groups_day_ul').append(html);
       }
       $('#groups_day_ul').listview('refresh');

   }

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


//  Fill select option
//
function  fillSelectStudent(db, select_student_id, id_session, id) { /// #id to be filled, id_session, id_student

    var today = moment(global_actual_date);
    var today_str = today.toDate().toDateString();

    sql = "SELECT id, id_student, id_session, a_type, a_date  FROM ATTENDANCE WHERE id_student = ? AND ";
    sql+= "id_session=? AND a_date=? ;"

    db.transaction(function(tx) {
        tx.executeSql(sql,[id, id_session,today_str],
                dbSuccessFunc = function(tx,results){
                    var text_select = $('#' + select_student_id);
                    selected = "";
                    html = "<option value=''></option>";
                    html += "<option value='Absence' " + selected + ">Absence</option>";
                    html += "<option value='Unpunctuality'" + selected + ">Unpunctuality</option>";
                    html += "<option value='Excused'" + selected + ">Excused</option>";
                    html += "<option value='Behavior' name='Behavior' " + selected + " >Behavior</option>";
                    text_select.empty().append(html);

                    if (results.rows.length>0) {
                        var state = results.rows.item(0).a_type;
                        log(" State => " + state);
                        text_select[0].selectedIndex = state;
                        return true;
                    } else {
                        // log("No data");
                        return false;
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("SQL  "+sql);
                    alert(" There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}

/*

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
    if(len>0) {
        $('#current_group_attendance').text(results.rows.item(0).data);
    }
    for (var i=0;i<len;i++) {
        id = results.rows.item(i).id_student;
        photo = results.rows.item(i).photo;
        name = results.rows.item(i).name;
        surname = results.rows.item(i).surname;
        id_group = results.rows.item(i).g_id;

        id_session = global_session; //

        html = "<li data-role='fieldcontain'> ";
        html += "<label for='select_student_"+id+"' class='select'> ";
        html += "<img height='20px' src='photos/"+photo +"' alt='" + id+surname + "' >";
        html += surname + "," + name + "</label> " ;
        html +="<select name='select_student_"+id+"' id='select_student_"+id+"' ";
        html += " onChange='studentState("+id + "," +id_group + ","+id_session+ ");'>";
        html +="</select>";
        html += "</li>";
        $('#students_attendance_ul').append(html);
// #id to be filled, id_session, id_student // Asyncrhonous
        fillSelectStudent(global_db, "select_student_"+id, id_session, id);
    }
    $('#students_attendance_ul').listview('refresh');
}


function queryStudentsAttendanceDB(tx) {
    var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group, STUDENTS.name as name , STUDENTS.surname as surname, STUDENTS.photo as photo,";
    sql += " GROUPS.id as g_id, GROUPS.data as data ";
    sql += " FROM STUDENTS, GROUPS WHERE  ( g_id=STUDENTS.id_group  ";
    sql += " AND g_id=" + global_id + " ) ORDER BY id_student";

    tx.executeSql(sql, [], queryStudentsAttendanceSuccess,
        dbErrorFunc = function(tx, e) {
            if (tx.message) e = tx;
            log(" queryStudentsAttendanceDB " + sql);
            alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
        return false;
    });

}

////////////////////


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

      db.transaction(function (tx) {
           var sql = 'INSERT INTO GROUPS ( data, other_data) VALUES (';
            sql  +=  '\"'  + name + '\" ,  \"'+ other_data + '\"  )' ;
            tx.executeSql(sql);
       });
       $('#grupos_ul').listview('refresh');
}

    // Insert new Student
    function insertNewStudent(db, name, surname, id_group) {

        db.transaction(function(tx) {
            var sql = 'INSERT INTO STUDENTS ( id_group, name, surname) VALUES (';
            sql += group_id + ',';
            sql += '\"' + name + '\" ,  \"' + surname + '\"  )';
            tx.executeSql(sql);
        });
        $('#students_ul').listview('refresh');
    }

// Low level insert
function insertStudentStateL(db, id_student, id_group, id_session, state, actual_date ){
    var today = moment(actual_date);
    var today_str = today.toDate().toDateString();
    var sql ="INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (";
    sql += id_group + "," + id_student+ "," + id_session+ "," + state+ ",\"" + today_str+"\" );";

    db.transaction(function(tx) {
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){  return true;     },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                log("insertStudentState2 : " + sql + "\n");
                alert(" There has been an error updateStudentState: " + e);
                return false;
            } );
    });
}

// Low level update
function updateStudentStateL(db, id_student, id_group, id_session, state, actual_date ) {
        var today = moment(actual_date);
        var today_str = today.toDate().toDateString();

        var sql ="UPDATE attendance  SET a_type=?";
        sql += " WHERE id_student=? AND id_session=? AND a_date=? ;";

        db.transaction(function(tx) {
            tx.executeSql(sql, [state,id_student,id_session,today_str],
                dbSuccessFunc = function(tx,rs){  return true;  },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("updateStudentState : " + sql + "\n");
                    alert(" There has been an error updateStudentState2: " + e);
                    return false;
                } );
        });
}

// Check whether student state changes
// @id_student student id
function stateCheck(db, id_student, id_group, id_session, state, actual_date){
    // check if it is new
    // if new:
    var today = moment(actual_date);
    var today_str = today.toDate().toDateString();

    var sql_check= "SELECT id_student, id_session, a_type, a_date FROM attendance ";
    sql_check += " WHERE "; //a_type="+state+ " AND ";
    sql_check += " id_session="+id_session+" AND a_date ='"+today_str +"' ";
    sql_check +=  " AND id_student="+ id_student +" ;";
    var exist = false;
    db.transaction(function(tx) {

        tx.executeSql(sql_check,[],
                dbSuccessFunc = function(tx,results){
                    if (results.rows.length>0) {
                       exist=true;
                        updateStudentStateL(db, id_student, id_group, id_session, state, actual_date );
                        return true;
                    } else {
                        exist = false;
                        insertStudentStateL(db, id_student, id_group, id_session, state, actual_date );
                        return false;
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("SQL check "+sql_check);
                    alert(" There has been an error SELECT  stateCheck: " + e);
                    return false;
                } );
    });

    return exist;
}

// Write Student state
function updateStudentState(db, id_student, id_group, id_session, state, actual_date ){
    var exist =false;
    exist = stateCheck(db, id_student, id_group, id_session, state, actual_date); // Is asynchronous

}
//
// POR_HACER
function insertNewActivity(db, name, other_data) {
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


   function loadGroupsAttendance(db) {
       db.transaction(queryGroupsAttendanceDB);
   }
//

//
//
  function loadAllGroups(db) {
       db.transaction(queryGroupsDB);
   }

   function loadStudents(db) {
       db.transaction(queryStudentsDB);
   }
   // Load only one student!
   function loadStudent(db){
       db.transaction(queryStudentDB);
   }
//
//
  function loadAllGroups(db) {
       db.transaction(queryAllGroupsDB);
   }


   function loadAllStudents(db) {
          db.transaction(queryAllStudentsDB);
   }

   function loadStudentsByGroup(db) {
       db.transaction(queryStudentsByGroupDB);
   }
/*
 * For Students Attendance Table
 *  => REPORT <=  Works (?)
 */
    function reportAttendanceDB(db) { // reportAttendance
       db.transaction(queryReportAttendanceDB);
   }

   function loadStudentAttendance(db) {
       db.transaction(queryStudentsAttendanceDB);
   }

   function loadActivities(db) {
       db.transaction(queryActivitiesDB, errorCB, queryActivitiesSuccess);
   }

