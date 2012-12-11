
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
var table_global;
// new API
var global_id;
var global_id_group=0;
var global_id_student=0;
var global_id_activity=0;
var global_no_groups=0;
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

//
function queryNewStudentDB(tx) {

    sql = "SELECT id, data, other_data FROM GROUPS  ";
    log("queryNewStudentDB "+ sql);
    tx.executeSql(sql, [], dbSuccessFunc = function(ttx, rs) {
        var ul_select = $('#student_new_edit_group_list_ul');
        var html = "";
        for (var i = 0; i < rs.rows.length; i++) {
            html += "<option value='" + rs.rows.item(i).id + "' name='" + rs.rows.item(i).data + "' ";
            html += "  >" + rs.rows.item(i).data + "</option>";
        }
        ul_select.empty().append(html);
        ul_select[0].selectedIndex = global_id; // Pasa en la variable global el grupo al que pertenece
        // Set id_group $('#student_edit_group_list_ul')[0].selectedIndex
        ul_select.selectmenu('refresh', true);
    }, dbErrorFunc = function(ttx, e) {
        if (ttx.message) e = ttx;
        log("Error queryNewStudentDB . SQL  " + sql);
        alert(" There has been an error queryNewStudentDB : " + e.message);
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
    sql += ' STUDENTS.e_phone as e_phone, STUDENTS.repeated as repeated, STUDENTS.tutor as tutor ,';
    sql += ' STUDENTS.address as address , STUDENTS.nation as nation, STUDENTS.phone as phone,  ';
    sql += ' GROUPS.id as g_id, GROUPS.data as data  ';
    sql += ' FROM STUDENTS, GROUPS WHERE ';
    sql += ' STUDENTS.id_group = g_id AND id_group=' + global_id_group;
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

    //   log("querySchedulePerDayDB:" + query);
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

//    log("report queryReportAttendanceSuccess nº datos (" + len + ")");

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
            log(" queryReportAttendanceSuccess: [" + moment(global_reports_date).day(j).toDate().toDateString() + "] = [" + results.rows.item(i).a_date + "]");
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


function queryStudentSuccess(tx, results) {
    var len = results.rows.length;

    // log("queryStudentSuccess. Number of students - rows inserted: " + len);
    if(len>0) {
        $('#in_name_student').val(results.rows.item(0).name);
        $('#in_surname_student').val(results.rows.item(0).surname);
        $('#in_birth_date_student').val(results.rows.item(0).n_date);
        $('#in_tutor_student').val(results.rows.item(0).tutor);
        $('#in_address_student').val(results.rows.item(0).address); // TODO: To be filled!
        $('#in_phone_student').val(results.rows.item(0).phone); // TODO: To be filled!
        $('#in_e_phone_student').val(results.rows.item(0).e_phone); // TODO: To be filled!
        sql = "SELECT id, data, other_data FROM GROUPS  ";
        global_id = results.rows.item(0).id; //

        global_db.transaction(function(ttx) {
            ttx.executeSql(sql,[],
                dbSuccessFunc = function(ttx,rs){
                    var ul_select = $('#student_edit_group_list_ul');
                    var html ="";
                    for(var i=0;i<rs.rows.length; i++) {
                        html += "<option value='"+rs.rows.item(i).id + "' name='"+rs.rows.item(i).data +"' " ;
                        html += "  >"+ rs.rows.item(i).data+"</option>";
                    }
                    ul_select.empty().append(html);
                    ul_select[0].selectedIndex = results.rows.item(0).id_group; // Set id_group $('#student_edit_group_list_ul')[0].selectedIndex
                    ul_select.selectmenu('refresh', true);
                },
                dbErrorFunc = function(ttx, e) {
                    if (ttx.message) e = ttx;
                    log("Error. SQL  "+sql);
                    alert(" There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
        });

    }
}
function queryNewStudentSuccess(tx, results) {
    var len = results.rows.length;

    // log("queryStudentSuccess. Number of students - rows inserted: " + len);
    if(len>0) {
        $('#in_new_name_student').val(results.rows.item(0).name);
        $('#in_new_surname_student').val(results.rows.item(0).surname);
        $('#in_new_birth_date_student').val(results.rows.item(0).n_date);
        $('#in_new_tutor_student').val(results.rows.item(0).tutor);
        $('#in_new_address_student').val(results.rows.item(0).address); // TODO: To be filled!
        $('#in_new_phone_student').val(results.rows.item(0).phone); // TODO: To be filled!
        $('#in_new_e_phone_student').val(results.rows.item(0).e_phone); // TODO: To be filled!

//         $('#in_id_group_student').val('To be implemented');
        sql = "SELECT id, data, other_data FROM GROUPS  ";
        global_id = results.rows.item(0).id; //

        global_db.transaction(function(ttx) {
            ttx.executeSql(sql,[],
                dbSuccessFunc = function(ttx,rs){
                    var ul_select = $('#student_new_edit_group_list_ul');
                    var html ="";
                    for(var i=0;i<rs.rows.length; i++) {
                        html += "<option value='"+rs.rows.item(i).id + "' name='"+rs.rows.item(i).data +"' " ;
                        html += "  >"+ rs.rows.item(i).data+"</option>";
                    }
                    ul_select.empty().append(html);
                    ul_select[0].selectedIndex = results.rows.item(0).id_group; // Set id_group $('#student_edit_group_list_ul')[0].selectedIndex
                    ul_select.selectmenu('refresh', true);
                },
                dbErrorFunc = function(ttx, e) {
                    if (ttx.message) e = ttx;
                    log("Error. SQL  "+sql);
                    alert(" There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
        });

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
//    log("Last inserted student - row ID = " + results.insertId);
//    log("Number of student - rows inserted: " + len);

    ul_list.empty();
    var html;
    var id = 0;
    for (var i = 0; i < len; i++) {
        id = results.rows.item(i).id;

        html = "<li>";

        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"students\"; ' href='#' data-rel='dialog' data-transition='slideup'>";
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
 * TODO: To be filled with marks
 */
function queryScheduleSuccess(tx, results) {
    var len = results.rows.length;
    var html;
    var id=0;
    var description="";
    var start = "";
    var t_id_session=-1;
    $('#groups_day_ul').empty();

    log("queryScheduleSuccess number of sessions: "+len );

    for (var i=0;i<len;i++) {
           id = results.rows.item(i).id;
           t_id_session = results.rows.item(i).t_id_session;
           group = results.rows.item(i).t_id_group;
           description = results.rows.item(i).g_description;  //group_description

           html = "<li>";
           html += "<div data-role='fieldcontain' onClick='listStudentsAttendance(" + group + ","+t_id_session + ");' >";
           html += results.rows.item(i).s_h_start;  // s_h_end
           html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='#' ";
           html += " onClick='listStudentsAttendance(" + group + ","+t_id_session + ");'>" + description + "</a>";
           html += "</div>";
           html += "</li>";
           $('#groups_day_ul').append(html);
    }
    $('#groups_day_ul').listview('refresh');

}



//  Fill select option
//
function  fillSelectStudent(db, select_student_id, id_session, id) { /// #id to be filled, id_session, id_student

    var today = moment(global_actual_date);
    var today_str = today.toDate().toDateString();

    sql = "SELECT id, id_student, id_session, a_type, a_date  FROM ATTENDANCE WHERE id_student = ? AND ";
    sql+= " id_session=? AND a_date=? ;"

    db.transaction(function(tx) {
        tx.executeSql(sql,[id, id_session,today_str],
                dbSuccessFunc = function(tx,results){
                    var text_select = $('#' + select_student_id);
                    html = "<option value=''></option>";
                    html += "<option value='Absence' >Absence</option>";
                    html += "<option value='Unpunctuality' >Unpunctuality</option>";
                    html += "<option value='Excused'  >Excused</option>";
                    html += "<option value='Behavior' name='Behavior' >Behavior</option>";
                    text_select.empty().append(html);
                    if (results.rows.length>0) {
                        var state = results.rows.item(0).a_type;
                        log(" State => " + state);
                        text_select[0].selectedIndex = state;
                        return true;
                    } else {
                        log("No data");
                        return false;
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
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
// #id to be filled, id_session, id_student // Asynchronous
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

// ----------------------------------------------------------------------------------------------------------
//
//      GROUPS      Management:
//
// ----------------------------------------------------------------------------------------------------------
   // Insert new group
function insertNewGroup(db, name, other_data){
      db.transaction(function (tx) {
           var sql = 'INSERT INTO GROUPS ( data, other_data) VALUES (';
            sql  +=  '\"'  + name + '\" ,  \"'+ other_data + '\"  )' ;
            tx.executeSql(sql);
       });
       $('#grupos_ul').listview('refresh');
}
function updateGroup(db, name, other_data){
    db.transaction(function (tx) {
        var sql = 'UPDATE GROUPS SET data="' +name + '",  other_data="' +other_data +'"  WHERE id='+global_id; // Supongo que el ID...
        tx.executeSql(sql,[],
            dbSuccessFunc = function(ttx,rs){
                return true;
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error updateGroupDB: " + e.message);
                    alert(" There has been an error updateGroupDB: " + e.message);
                    return false;
            });
   });
   $('#grupos_ul').listview('refresh');
}

function deleteGroup(db) {
    db.transaction( queryDeleteGroup = function(tx) {
        if (confirm('Do you really want to remove this group?')) {
            var sql = "DELETE FROM  GROUPS WHERE";
            sql += " id=" + global_id;
            log("queryDeleteGRoup  (" + sql + ")");
            tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
                log("Ok, removed");
                return true;
            }, dbErrorFunc = function(tx, e) {
                if (tx.message)
                    e = tx;
                log(" There has been an error deleteGroup: " + e.message);
                alert(" There has been an error deleteGroup: " + e.message);
                return false;
            });
        }
    });
}
  // Load only one group!
function loadGroup(db, id_group){
    db.transaction(function (tx) {
        log("Query Group \n");
        var sql = 'SELECT * FROM GROUPS WHERE id ='+id_group;
        tx.executeSql(sql, [],
            dbSuccessFunc = function(ttx,rs){
                $('#in_nombre_grupo').val(rs.rows.item(0).data);
                $('#in_nivel_grupo').val(rs.rows.item(0).other_data);
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error queryGroupDB: " + e.message);
                    alert(" There has been an error queryGroupDB: " + e.message);
                    return false;
            });
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
                id = rs.rows.item(i).id ;
                html = "<li>";
                html += "<a onClick='global_id=" + id + "; global_id_group="+id+"; table_global=\"groups\"; ";
                html += " listStudentsByGroup(" + id + " );'  ";
                html += " href='#' >";
                html += rs.rows.item(i).data; // TODO: Add Settings button
                html += "</a>"; //  Add settings button
                html += "<a data-role='button'  data-position-to='window' ";
                html += " data-iconpos='notext' style='float:right;' href='#' ";
                html += " data-rel='dialog' data-theme='a' data-transition='slideup' ";
                html += " onClick=\"EditGroup(" + id + "); global_id_group="+id+"; global_id=" + id + "; \">Edit</a>";
                html +="</li>";
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
function loadAllGroups(db) {
    db.transaction(queryAllGroupsDB);
}


// ---------------------------------------------------------------------------------------------------------
//
//      STUDENTS    Management:
//
// ----------------------------------------------------------------------------------------------------------
    // Insert new Student
function insertNewStudent( db, name, surname, group_id, repeated, n_date, photo, tutor,address, phone, e_phone, nation) {
    db.transaction(function(tx) {
        var sql = 'INSERT INTO STUDENTS ( id_group ';
        if(name !=null) { sql +=', name '; }
        if(surname !=null) sql +=', surname ';
        if(repeated !=0) sql +=', repeated ';
        if(n_date !=null) sql +=', n_date ';
        if(photo !=null) sql +=', photo ';
        if(tutor !=null) sql +=', tutor ';
        if(address !=null) sql +=', address ';
        if(phone !=null) sql +=', phone ';
        if(e_phone !=null) sql +=', e_phone ';
        if(nation !=null) sql +=', nation ';
        sql +=' ) VALUES ( ';
        sql += group_id  ;
        if(name !=null) sql += ', "' + name + '" ';
        if(surname !=null) sql += ', "' + surname + '" ';
        if(repeated !=0) sql += ', ' + repeated + ' ';
        if(n_date !=null) sql += ', "' + n_date + '" ';
        if(photo !=null) sql += ', "' + photo + '" ';
        if(tutor !=null) sql += ', "' + tutor + '" ';
        if(address !=null) sql += ', "' + address + '\" ';
        if(phone !=null) sql += ', "' + phone + '" ';
        if(e_phone !=null) sql += ', "' + e_phone + '" ';
        if(nation !=null) sql += ', "' + nation + '" ';
        sql += ' )';
        log("insertNewStudent "+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx, rs) {
                log("Ok, saved");
            return false;
        },
        dbErrorFunc = function(tx, e) {
            if (tx.message) e = tx;
                log(" There has been an error insertNewStudent: " + e.message);
                alert(" There has been an error insertNewStudent: " + e.message);
                return false;
        });

    });
    $('#students_ul').listview('refresh');
}
// Update Student /
function querySaveStudentDB (tx){
    id_group=$('#student_edit_group_list_ul')[0].selectedIndex ;
    name = $('#in_name_student').val();
    surname = $('#in_surname_student').val();
    repeated = 0 ; // XXX To be implemented with a check box?
    n_date=$('#in_birth_date_student').val();
    photo="";// TODO: How to implement this?
    tutor=$('#in_tutor_student').val();
    address=$('#in_address_student').val();
    phone=$('#in_phone_student').val();
    e_phone=$('#in_e_phone_student').val();
    nation=$('#in_nation_student').val();

    var sql = "UPDATE STUDENTS ";
    sql += " SET id_group="+ id_group;
    if( name!=null) {sql += " , name='"+name +"'  "; }
    if( surname!=null ) {sql += ", surname='"+surname +"' "; }
    if( repeated!=0 ) {sql += ", repeated="+repeated ; }
    if( n_date!=null ) {sql += ", n_date='"+n_date +"' "; }
    if( photo!=null ) {sql += ", photo='"+photo +"' "; }
    if( tutor!=null ) {sql += ", tutor='"+tutor +"' "; }
    if( address!=null ) {sql += ", address='"+ address+"' ";  }
    if( phone!=null ) {sql += ", phone='"+phone +"' ";  }
    if( surname!=null ) {sql += ", e_phone='"+e_phone +"' ";    }
    if( nation!=null ) { sql += ", nation='"+nation +"' "; }
    sql += " WHERE id="+global_id;
    log("querySaveStudentDB  (" + sql + ")");
    tx.executeSql(sql, [],
        dbSuccessFunc = function(tx, rs) {
            log("Ok, saved");
        return false;
    },
       dbErrorFunc = function(tx, e) {
        if (tx.message) e = tx;
            log(" There has been an error querySaveStudentDB: " + e.message);
        alert(" There has been an error querySaveStudentDB: " + e.message);
        return false;
    });
 }


function deleteStudent(db) {
    db.transaction( queryDeleteStudent = function(tx) {
        if (confirm('Do you really want to remove this student?')) {
            var sql = "DELETE FROM  STUDENTS WHERE ";
            sql += " id=" + global_id;
            log("deleteStuden  (" + sql + ")");
            tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
                log("Ok, removed");
                return true;
            }, dbErrorFunc = function(tx, e) {
                if (tx.message)
                    e = tx;
                log(" There has been an error deleteStudent: " + e.message);
                alert(" There has been an error deleteStudent: " + e.message);
                return false;
            });
        }
    });

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
// Save Student info
   function saveStudent(db){
       db.transaction(querySaveStudentDB);
   }

   function loadStudents(db) {
       db.transaction(queryStudentsDB);
   }
   // Load only one student!
   function loadStudent(db){
       db.transaction(queryStudentDB);
   }


   function loadNewStudent(db){
       db.transaction(  queryNewStudentDB);
   }

   function loadAllStudents(db) {
          db.transaction(queryAllStudentsDB);
   }

   function loadStudentsByGroup(db,id_group) {
       db.transaction(
         function (tx) {
            var sql = 'SELECT STUDENTS.id as id,  STUDENTS.id_group as id_group, STUDENTS.name as name, ';
            sql += ' STUDENTS.surname as surname, STUDENTS.n_date as n_date, STUDENTS.photo as photo, ';
            sql += ' STUDENTS.e_phone as e_phone, STUDENTS.repeated as repeated, STUDENTS.tutor as tutor ,';
            sql += ' STUDENTS.address as address , STUDENTS.nation as nation, STUDENTS.phone as phone,  ';
            sql += ' GROUPS.id as g_id, GROUPS.data as data  ';
            sql += ' FROM STUDENTS, GROUPS WHERE ';
            sql += ' STUDENTS.id_group = g_id AND id_group=' + id_group;
            tx.executeSql(sql, [],
                dbSuccessFunc = function(tx, results) {
                    var len = results.rows.length;
                    log("loadStudentsByGroup. Number of students: " + len);
                    var ul_list = $('#list_students_by_group_ul');
                    $('#id_list_students_by_group').text( results.rows.item(0).data );
                    var html;
                    ul_list.empty();
                    var id = 0;
                    for (var i = 0; i < len; i++) {
                        id = results.rows.item(i).id;
                        html = "<li >";
                        html += "<a onClick='global_id=" + id + "; table_global=\"students\"; ' href='#' data-rel='dialog' data-transition='slideup'>";
                        html += "<img height='20px' src='photos/" + results.rows.item(i).photo + "' alt='" + results.rows.item(i).surname
                        html += "' style='float:left;' class='ui-li-icon ui-corner-none'>";
                        html += results.rows.item(i).surname + "," + results.rows.item(i).name;
                        html += "</a>";
                        html += "<a data-role='button' data-position-to='window' ";
                        html += " data-iconpos='notext' style='float:right;' href='#' ";
                        html += " data-rel='dialog' data-transition='slideup'  ";
                        html += " onClick=\"EditStudent(" + id + ");\">Edit</a>";
                        html += "</li>";
                        ul_list.append(html);
                    }
                    ul_list.listview('refresh');
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log(sql);
                    log(" There has been an error loadStudentsByGroup: "+e.message);
                    alert("There has been an error loadStudentsByGroup: " + e.message);
                      return false;
                });
            }
          );
}
//            queryStudentsByGroupDB);

///---------------------------------------------------------------------------------------------------------
//
//      Activities
//
// ----------------------------------------------------------------------------------------------------------


function queryActivitiesSuccess(tx, results) {
    var len = results.rows.length;

    $('#activities_ul').empty();
    var id=0;
    for (var i=0;i<len;i++) {
       id = results.rows.item(i).id;
       $('#activities_ul').append("<li onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");
   }0 ;
   $('#activities_ul').listview('refresh');
}

function queryAllActivitiesDB(tx) {
       log("Query Activities \n");
       tx.executeSql('SELECT * FROM ACTIVITIES',[],
        dbSuccessFunc = function(tx, results) {
                    var len = results.rows.length;
                    if(len>0) {
                        var ul_list = $('#activities_ul');
                        var html;
                        ul_list.empty();
                        var id = 0;
                        for (var i = 0; i < len; i++) {
                            id = results.rows.item(i).id;
                            html = "<li >";
                            html += "<a onClick='global_id=" + id + "; table_global=\"activities\";  onUpdateActivity("+id+") ' ";
                            html +=  " href='#' data-rel='dialog' data-transition='slideup'>";
                            html += results.rows.item(i).name ;
                            html += "</a>";
                            html += "<a data-role='button' data-position-to='window' ";
                            html += " data-iconpos='notext' style='float:right;' href='#' ";
                            html += " data-rel='dialog' data-transition='slideup'  ";
                            html += " onClick=\"EditActivity(" + id + ");\">Edit</a>";
                            html += "</li>";
                            ul_list.append(html);
                        }
                        ul_list.listview('refresh');
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log(sql);
                    log(" There has been an error loadStudentsByGroup: "+e.message);
                    alert("There has been an error loadStudentsByGroup: " + e.message);
                      return false;
                });
}

function loadAllActivities(db) {
       db.transaction(queryAllActivitiesDB );
   }
function loadActivity(db, id_activity ) {

    alert("Here it should populate Page #update_activity with data from database  ");

}
function  insertNewActivity( db, name , date_init , date_end , weight , e_final  ) {
    var last_inserted_row;
    db.transaction(function(tx) {
        var sql = 'INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES (';
        sql += '"' + name + '" ';
        sql += ', "' + date_init + '" ';
        sql += ', "' + date_end + '" ';
        sql += ', ' + weight;
        sql += ', ' + e_final;
        sql += ');';

        log("insertNewActivity :"+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx, results) {
                return true;
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error insertNewActivity: "+e.message);
                    alert("There has been an error insertNewActivity: " + e.message);
                    return false;
        });

        var sql = 'SELECT  last_insert_rowid() FROM activities;';

        log("insertNewActivity02 :"+sql); // SOLO funcionará para el primero
        tx.executeSql(sql ,[],
            dbSuccessFunc = function(tx, results) {
                var i_last_inserted_row=results.rows.length; // ahora ya sabe cual es la última actividad
                var enabled=0;
                var a_date = Date();
                for (var i=0;i<global_no_groups;i++) { // supone que los ids de grupo son correlativos
                        var checkbox=$('#in_group_activity_' + i );
                        enabled=0;
                        if(checkbox.is(':checked')) {
                             enabled=1;
                        }
                        notes ="";
                      //  alert("ID Group "+ i +" <-> "+enabled )
                        insertActivitiesGroup(db, i , i_last_inserted_row, enabled , a_date, notes);
                }
//
                return true;
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error insertNewActivity2: "+e.message);
                    alert("There has been an error insertNewActivity2: " + e.message);
                    return false;
        });
    });
}

function insertActivitiesGroup(db, id_group, last_inserted_row, enabled , a_date, notes){
    db.transaction(function(tx) {
        var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (';
        sql +=  id_group ;
        sql += ','+ last_inserted_row;
        sql += ', ' + enabled ; // 0/1
        sql += ', "' + a_date+'"';
        sql += ', "' + notes+'"';
        sql += ');';
        log(" insertActivitiesGroup  : "+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx, results) {
                return true;
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error  insertActivitiesGroup : "+e.message);
                    alert("There has been an error  insertActivitiesGroup : " + e.message);
                    return false;
        });

    });

}

    // TODO: Fill with  groups info: #list_groups_activities_ul
    // 'in_group_activity_" + id + "'
function loadGroupsActivitiesEdit(db){
    db.transaction(function(tx) {
        var sql = 'SELECT id, data, other_data FROM groups; ' ;

        log("loadGroupsActivitiesEdit : "+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx, results) {
                var len = results.rows.length;
                global_no_groups = len;
                if(len>0) {
                    var ul_list = $('#list_groups_activities_ul');
                    var html;
                        ul_list.empty();
                        var id = 0;
                        for (var i = 0; i < len; i++) {
                            id = results.rows.item(i).id;
                            html = "<li >";

                            html += "<input style='text-align=right' type='checkbox' ";
                            html += "name='in_group_activity_"+id + "'  id='in_group_activity_" + id + "' enabled='true'  />";
                            html +="<label for='in_group_activity_"+ id +"' >";
                            html += results.rows.item(i).data +"</label>";
                            html += " </li></br>";
                            ul_list.append(html);
                        }
                        ul_list.listview('refresh');
                    }

                return true;
            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error loadGroupsActivitiesEdit: "+e.message);
                    alert("There has been an error loadGroupsActivitiesEdit: " + e.message);
                    return false;
        });
    });




}

//
//------------- Assessment:
// TODO: Fill Student Assessment
// Aclarar todo este código
//

function fillSelectStudentAssessment(db, select_student_id, id_session, id_student) {
    // TODO: adaptar para Assessment
    // PRIMERO debe hacer un select de las notas que tiene el alumno, si el resultado es
    // len=0 -> no anota nada
    // len>0 -> debe escribir la nota, decir que tal nota es la seleccionada
    //
    // sql= "SELECT id_student, id_activity, mark FROM ACTIVITIES_STUDENT WHERE id_activity= AND id_student=
    //         CREATE TABLE IF NOT EXISTS activities_student
//                (id integer primary key ,  id_student integer, id_activity integer,
//                mark integer, a_date text, notes text,

/*
To get the text of the selected option

$("#your_select :selected").text();

To get the value of the selected option

$("#your_select").val();
//*/

    var id_activity= $('#list_assessment_select').val() ;// Activity selected
    global_id_activity= id_activity;

    var text_select = $('#' + select_student_id);
    var html="";
    for(var i=0;i<=10;i++) {
        html += "<option value='"+i+"'>"+ i+"</option>";
    }
    text_select.empty().append(html);

    var sql= "SELECT id_student, id_activity, mark FROM ACTIVITIES_STUDENT  ";
    sql += "WHERE id_activity="+id_activity+ " AND id_student="+ id_student ;

    db.transaction(function(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = function(tx,results){

                    if (results.rows.length>0) {
                        var state = results.rows.item(0).mark;
                        log(" Mark => " + state);
                        text_select[0].selectedIndex = state; // TODO: Set to the current mark
                        return true;
                    } else {
                        log("No data");
                        return false;
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });
}
function updateStudentAssessmentL(db,id_student,id_group, id_activity,mark){
    var sql ="UPDATE ACTIVITIES_STUDENT SET mark="+mark;
    sql += " WHERE id_activity="+ id_activity + "  AND id_student="+ id_student;
    db.transaction(function(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = function(tx,results){
                    alert("UPDATE");
                    return true;
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}
function insertStudentAssessmentL(db,id_student,id_group, id_activity,mark) {
    var sql ="INSERT INTO ACTIVITIES_STUDENT (id_student, id_activity,mark) VALUES ";
    sql += "( "+id_student +","+ id_activity +","+mark +" )";
    db.transaction(function(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = function(tx,results){
                    alert("INSERT");
                    return true;
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });
}

// TODO: List o students assessment
function onChangeStudentAssessment(id_student,id_group, id_activity){

// Debe hacer un insert o un update según existan datos
    var db= global_db;

    var sql= "SELECT id_student, id_activity, mark FROM ACTIVITIES_STUDENT  ";
    sql += "WHERE id_activity="+id_activity+ " AND id_student="+ id_student ;

    db.transaction(function(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = function(tx,results){

                    if (results.rows.length>0) {
                        var state = results.rows.item(0).mark;
// TODO get mark
// text_select[0].selectedIndex
//
                        var mark=$('#assessment_select_student_' + id_student).val();

                        // var mark=-1; // TODO obtener la nota
                        updateStudentAssessmentL(db,id_student,id_group, id_activity,mark);
                        alert("Update");
                        log(" Mark => " + state);
                        //text_select[0].selectedIndex = state; // TODO: Set to the current mark
                        return true;
                    } else {
                        var mark=-1;
// TODO get mark
// text_select[0].selectedIndex
                        var mark=$('#assessment_select_student_' + id_student).val();
                        insertStudentAssessmentL(db,id_student,id_group, id_activity,mark);

                        log("No data");

                        alert("Insert");
                        return false;
                    }
                },
                dbErrorFunc = function(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}


// TODO: Assessment:

function listStudentsByGroupAssessment(db, id_group, students_ul) {
    db.transaction(function(ttx) {
        var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group as id_group, STUDENTS.name as name, STUDENTS.surname as surname, STUDENTS.photo as photo, ";
        sql += " GROUPS.id, GROUPS.data FROM STUDENTS, GROUPS  WHERE GROUPS.id=id_group AND id_group=" + id_group;
        ttx.executeSql(sql, [], dbSuccessFunc = function(ttx, rs) {
            var html = "";
            var id = 0;
            var photo = "";
            var name = "";
            var surname = "";
            var id_session = 0;
            var no_students = rs.rows.length;

            students_ul.empty();
            for (var i = 0; i < no_students; i++) {
                id = rs.rows.item(i).id_student;
                photo = rs.rows.item(i).photo;
                name = rs.rows.item(i).name;
                surname = rs.rows.item(i).surname;
                id_session = global_session;
                //
                html = "<li data-role='fieldcontain'> ";
                html += "<label for='select_student_assessment_" + id + "' class='select'> ";
                html += "<img height='20px' src='photos/" + photo + "' alt='" + id + surname + "' >";
                html += surname + "," + name + "</label> ";
                html += "<select name='assessment_select_student_" + id + "' id='assessment_select_student_" + id + "' ";
                html += "  onchange='onChangeStudentAssessment(" + id + "," + id_group + "," + global_id_activity + ");'>";
                html += "</select> </li>";
                students_ul.append(html);
                fillSelectStudentAssessment(global_db, "assessment_select_student_" + id, id_session, id);
            }
            students_ul.listview('refresh');
        }, dbErrorFunc = function(ttx, e) {
            if (ttx.message)  e = ttx;
            log(" There has been an error  insertActivitiesGroup : " + e.message);
            alert("There has been an error  insertActivitiesGroup : " + e.message);
            return false;
        });
    });
}

function refreshGroupAssessment(){

    listStudentsByGroupAssessment( global_db, global_id_group, $('#students_assessment_ul'));
}
// TODO: assessment
// XXX:  Assessment

function loadGroupAssessment(db,id_group) {
    var html="";
    var list_asset=$('#list_assessment_select'); // list of activities for a group
//
//                enabled integer, a_date text, notes text,
    sql="SELECT ";
    sql += " ACTIVITIES_GROUP.a_date AS ag_date, ACTIVITIES_GROUP.id_group AS ag_group, ";
    sql += " ACTIVITIES_GROUP.id_activity AS ag_activity, ACTIVITIES_GROUP.enabled AS ag_enabled ,"; //
    sql += " ACTIVITIES.id AS a_id,  ACTIVITIES.name AS a_name,";
    sql += " ACTIVITIES.date_init AS a_date_init,  ACTIVITIES.final AS a_final,  ";
    sql += " GROUPS.data AS g_data,  GROUPS.id as g_id ";
    sql += " FROM  ACTIVITIES, ACTIVITIES_GROUP, GROUPS ";
    sql += " WHERE ag_group= "+ id_group;
    sql += " AND ag_activity=a_id AND g_id=ag_group  ORDER BY a_date_init ASC; ";

    db.transaction(function(tx) {
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx, results) {
                var html ="";
                for (var i=0;i<results.rows.length;i++) {
                    a_id = results.rows.item(i).a_id;
                    a_name = results.rows.item(i).a_name;
                    a_date_init  = results.rows.item(i).a_date_init;
                    a_final = results.rows.item(i).a_final;
                    html +=' <option value="'+a_id+'">'+a_name+'</option> ';
                }
                list_asset.empty().append(html);
                list_asset[0].selectedIndex = 0; // Selects the very first
        // Set id_group $('#student_edit_group_list_ul')[0].selectedIndex
                list_asset.selectmenu('refresh', true);
//      TODO:     List of students by group    students_assessment_ul
                if(results.rows.length>0) {
                    $('#current_group_assessment').text(results.rows.item(0).g_data); // Group Name
                }
                // Si se ha seleccionado una actividad :=>
                global_id_group = id_group;
                listStudentsByGroupAssessment( db, id_group, $('#students_assessment_ul'));

            },
            dbErrorFunc = function(tx, e) {
                if (tx.message) e = tx;
                log(" queryStudentsAttendanceDB " + sql);
                alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
                return false;
            }// dbErrorFunc = function(tx, e) {
            ); // tx.executeSql(sql,[],
        });


    } // end of function



// TODO: List of students Assessment
// studentAssesment
function queryStudentsAssessmentSuccess(tx, results) {
    var len = results.rows.length;
    var html="";
    var id=0;
    var photo="";
    var name="";
    var surname="";
    var id_group=0;
    var id_session=0;

    $('#students_assessment_ul').empty();
    if(len>0) {
        $('#current_group_assessment').text(results.rows.item(0).data);
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
        html += " onChange='studentAssesment("+id + "," +id_group + ","+id_session+ ");'>"; //  TO be Implemented studentAssesment
        html +="</select>";
        html += "</li>";
        $('#students_attendance_ul').append(html);
// #id to be filled, id_session, id_student // Asynchronous
        fillSelectStudent(global_db, "select_student_"+id, id_session, id);
    }
    $('#students_attendance_ul').listview('refresh');
}


function queryStudentsAssessmentDB(tx) {
    var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group, STUDENTS.name as name , STUDENTS.surname as surname, STUDENTS.photo as photo,";
    sql += " GROUPS.id as g_id, GROUPS.data as data ";
    sql += " ACTIVITIES.id a_id, ACTIVITIES.name,  " ;
    sql += " ACTIVITIES_STUDENT.id_student AS as_id_student, ACTIVITIES_STUDENT.id_activity AS as_id_activity, ACTIVITIES_STUDENT.mark as mark,  " ;
    sql += " FROM STUDENTS, GROUPS, ACTIVITIES, ACTIVITIES_STUDENT WHERE  ( g_id=STUDENTS.id_group  ";
    sql += " AND g_id=" + global_id ;
    sql += " AND a_id=as_id_activity  " ;
    sql += " AND id_student =as_id_activity  " ;

    /*        CREATE TABLE IF NOT EXISTS ACTIVITIES
                (id integer primary key, name text, date_init text, date_end text, weight integer, final integer );

        DROP TABLE IF EXISTS activities_student;
        CREATE TABLE IF NOT EXISTS activities_student
                (id integer primary key ,  id_student integer, id_activity integer,
                mark integer, a_date text, notes text,

    //*/
    sql += " ) ORDER BY id_student";

    tx.executeSql(sql, [], queryStudentsAttendanceSuccess,
        dbErrorFunc = function(tx, e) {
            if (tx.message) e = tx;
            log(" queryStudentsAttendanceDB " + sql);
            alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
        return false;
    });

}



// LoadGroupAssessment  :

//            CREATE TABLE IF NOT EXISTS ACTIVITIES
// id integer primary key, name text, date_init text, date_end text, weight integer, final integer );

/*
    html =' <option value="standard">Standard: 7 day</option> ';
    html +=' <option value="rush">Rush: 3 days</option>';
    html +=' <option value="express">Express: next day</option>';
    html +=' <option value="overnight">Overnight</option>';

    list_asset.append(html);
//*/
/*
    var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group, STUDENTS.name as name , STUDENTS.surname as surname, STUDENTS.photo as photo ,";
    sql += " GROUPS.id as g_id, GROUPS.data as data, ";
    sql += " GROUPS.id as g_id, GROUPS.data as data, ";
    sql += " FROM STUDENTS, GROUPS WHERE  ( g_id=STUDENTS.id_group  ";
    sql += " AND g_id=" + global_id + " ) ORDER BY id_student";

    tx.executeSql(sql, [], queryStudentsAttendanceSuccess,
        dbErrorFunc = function(tx, e) {
            if (tx.message) e = tx;
            log(" queryStudentsAttendanceDB " + sql);
            alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
        return false;
    });




    $('#current_group_assessment').text("Curso");
    var student_asset=$('#students_assessment_ul');

    student_asset.empty();

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
// #id to be filled, id_session, id_student // Asynchronous
        fillSelectStudent(global_db, "select_student_"+id, id_session, id);
    }
    $('#students_attendance_ul').listview('refresh');
//*/


//
// ----------------------------------------------------------------------------------------------------------



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

/*
 * For Students Attendance Table
 */
    function reportAttendanceDB(db) {
       db.transaction(queryReportAttendanceDB);
   }

   function loadStudentAttendance(db) {
       db.transaction(queryStudentsAttendanceDB);
   }

        //           html += "<div data-role='fieldcontain'>";
        //            html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
        //            html += "<a data-role='button' data-iconpos='notext' style='float: right;' href='index.html#show_student_activity'  onClick=\"Attendance(" + results.rows.item(i).id + ");\"></a>";

