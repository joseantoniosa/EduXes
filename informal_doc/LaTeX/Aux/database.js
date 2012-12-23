
\emph{ errorCB() }     & Error handler \\
\emph{  successCB() &  Error handler \\

\emph{ queryDB(tx) } & List groups \footnote{Deprecated} \\

\emph { queryGroupsAttendanceDB(tx) } & List filled with group information \\

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


\emph { queryReportAttendanceDB() } & report->Attendance->Group \\
\emph { queryReportAttendanceSuccess() }& report->Attendance->Group \\

//
\emph { loadGroupsAssessment(db){
    var sql="SELECT id, data, other_data FROM groups;";
    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    var len = results.rows.length;
                    var ul_list=$('#groups_assessment_ul');
                    ul_list.empty();
                    for (var i = 0; i < len; i++) {
                        var id = results.rows.item(i).id;
                        html = "<li>";
                        // html += "<a onClick='global_id_group="+id +"  global_id=" + id + "; table_global=\"groups\"; ";
                        html += " <a onClick='onListStudentsAssessment(" + id + ");' ";
                        html += " href='#' data-transition='slideup'>";
                        html += results.rows.item(i).data + "</a>";
                        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"groups\";' href='#' data-rel='dialog' data-transition='slideup'>";
                        html += "</a></li>";
                        ul_list.append(html);
                    }
                    ul_list.listview('refresh');
                    return true;
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    }  );
}
//
//
// >> var a = [[{mark: 23, weight: 5}, {mark: 12, weight: 3}], [{mark: 9, weight: 12}]];a[1][0].mark;
//
//Brady = new Array (3);
//for (i = 0; i < Brady . length; ++ i) {
//    Brady [i] = new Array (3);
//    for (j = 0; j < Brady[i] . length; ++ j) {
//        Brady[i][j] = new  Peers(1,2) ;
//    }
//}
//
////*/
\emph { Peers (mark, weight, activity){
    this.mark = mark;
    this.weight = weight;
    this.activity = activity;
}

// XXX: Warning with 1 begining indexes  Adjust
// Assessment - List Students
// http://www.w3schools.com/js/js_objects.asp
//      activity-1  activity-3  activity-5
// A                    8           7
// B         7          5
// C         3
// Max actividades => 3
// Max students => 3 !
// act_id_1. act_id_3, act_id_5
//
// var a = [[{mark: 23, weight: 5}, {mark: 12, weight: 3}], [{mark: 9, weight: 12}]];a[1][0].mark;

\emph { loadStudentsAssessment(db, id_group){

// var text_select = $('#' + select_student_id); //
    $('#current_group_assessment_reports').text("Name of the group");

    var sql=" SELECT DISTINCT students.id as s_id, students.name as s_name, students.surname as s_surname, students.id_group, " ;
    sql +="  GROUPS.id,  groups.data, activities.id, activities.weight as a_weight, activities.name as a_name, " ;
    sql +="  activities_student.id_student, activities_student.id_activity as a_id , activities_student.mark as a_mark" ;
    sql +="  FROM groups, students, activities, activities_student " ;
    sql +="  WHERE students.id=activities_student.id_student " ;
    sql +="  AND activities.id=activities_student.id_activity " ;
    sql +="  AND GROUPS.id=students.id_group AND GROUPS.id="+id_group;
    sql +="  ORDER BY students.id ; " ;

    log("loadStudentsAssessment SQL: "+sql )
    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    var html="";
                    var ul_list=$('#students_assessment_reports_ul');
                    var table = $('#students_assessment_reports_table');
                    var student_a = new Array();
                    var activity_name_a = new Array(global_max_activities+1);
                    var no_students =-1;
                    var no_activities=0;
                    var a_no_activities=0;
                    var measure =0.00;
                    var is_new=1;
                    var s_id =0;
                    var old_s_id=-1;
                    var len = results.rows.length; // max number of students
                    var max_activities = global_max_activities;

                    if (len<1) {return false;}

                    //  Initialize to zero Students-Activities Matrix
                    var SActivity = new Array (len+1);
                    for (var i = 0; i < SActivity.length; ++ i) {
                        SActivity[i] = new Array (max_activities+1);
                            for (var j = 0; j < SActivity[i].length; ++ j) {
                                SActivity[i][j] = new  Peers(0,0,0) ;
                            }
                    }
                    old_s_id=-1;
                    a_no_activities=0;
                    no_activities=0;
                    var k=0;

                    for (var i = 0; i < len; i++) {
                        s_id = results.rows.item(i).s_id;
                        s_name = results.rows.item(i).s_name;
                        s_surname = results.rows.item(i).s_surname;
                        activity_name = results.rows.item(i).a_name;
                        weight = results.rows.item(i).a_weight;
                        mark = results.rows.item(i).a_mark;
                        activity_id = results.rows.item(i).a_id;

                        if(s_id!=old_s_id) {// Es nuevo, meter en el array los datos
                            if (is_new==1){
                                is_new=0;
                            } else {
                                no_activities=Math.max(no_activities, a_no_activities);
                            }
                            no_students ++; // si es nuevo estudiante
                            student_a.push(s_surname+", "+s_name);
                            a_no_activities=1;
                            k=0;
                        } else { // Viejo
                            a_no_activities++;
                            k++;
                        }

                        SActivity[no_students][activity_id].mark =  mark;
                        SActivity[no_students][activity_id].weight =  weight;
                        SActivity[no_students][activity_id].activity = activity_id;

                        activity_name_a[activity_id] = activity_name ;

                        old_s_id=s_id;
                    }
                    max_students = no_students;

                    html ="";
                    for(var i=0;i<=max_students; i++) {
                        html +="<tr><td>"+student_a[i]+"</td>";
                        measure=0.0;
// XXX: Check DB ID's, if it begins in 0 or 1 (assumed 1)
                        for(j=1;j<global_max_activities+1;j++) {
                            html += "<td>" + SActivity[i][j].mark  +"</td>";
// XXX: Weight sum should return 100
                            measure +=SActivity[i][j].mark*SActivity[i][j].weight/100.0;

                        }
                        html += "<td>("+measure +")</td>";
                        html +="</tr>";

                    }

                    html_pre ="<tr>";
                    html_pre +="<th> Name </th>";
// XXX: Check DB ID's, if it begins in 0 or 1 (assumed 1)
                    for(var j=1;j<global_max_activities+1 ; j++) {
                        html_pre +="<th>"+activity_name_a[j]+"</th>";
                    }
                    html_pre +="<th>Mean</th></tr>";

                    table.empty().append("<thead>"+html_pre+"</thead><tbody>"+html+"<tbody>");

                    return true;
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    }  );

}

// ----------------------------------------------------------------------------------------------------------
//
//
//

//



//
//
//
\emph { queryGroupsSuccess(tx, results) {
    var len = results.rows.length;
    var html = "";
    var ul_list = $('#groups_to_edit_ul');

    ul_list.empty();
    for (var i = 0; i < len; i++) {
        html = "<li> ";
        // listStudentsAttendance (id_group, -1), -1=> any session
        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"groups\"; ";
        html += " listStudentsAttendance(" + results.rows.item(i).id + ",-1 );'  ";
        html += " href='#' data-transition='slideup'>";
//        html += " href='index.html#list_students_attendance' data-transition='slideup'>";
        html += results.rows.item(i).data + "</a>";
        html += "<a onClick='global_id=" + results.rows.item(i).id + "; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
        html += "</a></li>";
        ul_list.append(html);
    }
    ul_list.listview('refresh');
}


\emph { queryNewStudentSuccess(tx, results) {
    var len = results.rows.length;

    // log("queryStudentSuccess. Number of students - rows inserted: " + len);
    if(len>0) {
        $('#in_new_name_student').val(results.rows.item(0).name);
        $('#in_new_surname_student').val(results.rows.item(0).surname);
        $('#in_new_birth_date_student').val(results.rows.item(0).n_date);
        $('#in_new_tutor_student').val(results.rows.item(0).tutor);
        $('#in_new_address_student').val(results.rows.item(0).address);
        $('#in_new_phone_student').val(results.rows.item(0).phone);
        $('#in_new_e_phone_student').val(results.rows.item(0).e_phone);

//         $('#in_id_group_student').val('To be implemented');
        sql = "SELECT id, data, other_data FROM GROUPS  ";
        global_id = results.rows.item(0).id; //

        global_db.transaction(\emph {(ttx) {
            ttx.executeSql(sql,[],
                dbSuccessFunc = \emph {(ttx,rs){
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
                dbErrorFunc = \emph {(ttx, e) {
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







//  Fill select option
//
\emph {  fillSelectStudent(db, select_student_id, id_session, id) { /// #id to be filled, id_session, id_student

    var today = moment(global_actual_date);
    var today_str = today.toDate().toDateString();

    sql = "SELECT id, id_student, id_session, a_type, a_date  FROM ATTENDANCE WHERE id_student = ? AND ";
    sql+= " id_session=? AND a_date=? ;"

    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[id, id_session,today_str],
                dbSuccessFunc = \emph {(tx,results){
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
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}

/*
 */
\emph { queryStudentsAttendanceSuccess(tx, results) {
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


\emph { queryStudentsAttendanceDB(tx) {
    var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group, STUDENTS.name as name , STUDENTS.surname as surname, STUDENTS.photo as photo,";
    sql += " GROUPS.id as g_id, GROUPS.data as data ";
    sql += " FROM STUDENTS, GROUPS WHERE  ( g_id=STUDENTS.id_group  ";
    sql += " AND g_id=" + global_id + " ) ORDER BY id_student";

    tx.executeSql(sql, [], queryStudentsAttendanceSuccess,
        dbErrorFunc = \emph {(tx, e) {
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
\emph { insertNewGroup(db, name, other_data){
      db.transaction(\emph { (tx) {
           var sql = 'INSERT INTO GROUPS ( data, other_data) VALUES (';
            sql  +=  '\"'  + name + '\" ,  \"'+ other_data + '\"  )' ;
            tx.executeSql(sql);
       });
       $('#grupos_ul').listview('refresh');
}
\emph { updateGroup(db, name, other_data){
    db.transaction(\emph { (tx) {
        var sql = 'UPDATE GROUPS SET data="' +name + '",  other_data="' +other_data +'"  WHERE id='+global_id; // Supongo que el ID...
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(ttx,rs){
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error updateGroupDB: " + e.message);
                    alert(" There has been an error updateGroupDB: " + e.message);
                    return false;
            });
   });
   $('#grupos_ul').listview('refresh');
}

\emph { deleteGroup(db) {
    db.transaction( queryDeleteGroup = \emph {(tx) {
        if (confirm('Do you really want to remove this group?')) {
            var sql = "DELETE FROM  GROUPS WHERE";
            sql += " id=" + global_id;
            log("queryDeleteGRoup  (" + sql + ")");
            tx.executeSql(sql, [], dbSuccessFunc = \emph {(tx, rs) {
                log("Ok, removed");
                return true;
            }, dbErrorFunc = \emph {(tx, e) {
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
\emph { loadGroup(db, id_group){
    db.transaction(\emph { (tx) {
        log("Query Group \n");
        var sql = 'SELECT * FROM GROUPS WHERE id ='+id_group;
        tx.executeSql(sql, [],
            dbSuccessFunc = \emph {(ttx,rs){
                $('#in_nombre_grupo').val(rs.rows.item(0).data);
                $('#in_nivel_grupo').val(rs.rows.item(0).other_data);
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error queryGroupDB: " + e.message);
                    alert(" There has been an error queryGroupDB: " + e.message);
                    return false;
            });
    });
}

\emph { queryAllGroupsDB(tx) {
    log("Query All Groups \n");
    var ul_list =$('#groups_ul');
    tx.executeSql('SELECT * FROM GROUPS', [],
        dbSuccessFunc = \emph {(tx, rs) {
            ul_list.empty();
            var html ="";
            for (var i = 0; i < rs.rows.length; i++) {
                id = rs.rows.item(i).id ;
                html = "<li>";
                html += "<a onClick='global_id=" + id + "; global_id_group="+id+"; table_global=\"groups\"; ";
                html += " listStudentsByGroup(" + id + " );'  ";
                html += " href='#' >";
                html += rs.rows.item(i).data;
                html += "</a>";
                html += "<a data-role='button'  data-position-to='window' ";
                html += " data-iconpos='notext' style='float:right;' href='#' ";
                html += " data-rel='dialog' data-theme='a' data-transition='slideup' ";
                html += " onClick=\"EditGroup(" + id + "); global_id_group="+id+"; global_id=" + id + "; \">Edit</a>";
                html +="</li>";
                ul_list.append(html);

            }
            ul_list.listview('refresh'); },
        dbErrorFunc = \emph {(ttx, e) {
            if (ttx.message)
                e = ttx;
            log(" There has been an error Select * from groups : " + e.message);
        return false;
    });
}
\emph { loadAllGroups(db) {
    db.transaction(queryAllGroupsDB);
}


// ---------------------------------------------------------------------------------------------------------
//
//      STUDENTS    Management:
//
// ----------------------------------------------------------------------------------------------------------
    // Insert new Student
\emph { insertNewStudent( db, name, surname, group_id, repeated, n_date, photo, tutor,address, phone, e_phone, nation) {
    db.transaction(\emph {(tx) {
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
            dbSuccessFunc = \emph {(tx, rs) {
                log("Ok, saved");
            return false;
        },
        dbErrorFunc = \emph {(tx, e) {
            if (tx.message) e = tx;
                log(" There has been an error insertNewStudent: " + e.message);
                alert(" There has been an error insertNewStudent: " + e.message);
                return false;
        });

    });
    $('#students_ul').listview('refresh');
}
// Update Student /
\emph { querySaveStudentDB (tx){
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
        dbSuccessFunc = \emph {(tx, rs) {
            log("Ok, saved");
        return false;
    },
       dbErrorFunc = \emph {(tx, e) {
        if (tx.message) e = tx;
            log(" There has been an error querySaveStudentDB: " + e.message);
        alert(" There has been an error querySaveStudentDB: " + e.message);
        return false;
    });
 }


\emph { deleteStudent(db) {
    db.transaction( queryDeleteStudent = \emph {(tx) {
        if (confirm('Do you really want to remove this student?')) {
            var sql = "DELETE FROM  STUDENTS WHERE ";
            sql += " id=" + global_id;
            log("deleteStuden  (" + sql + ")");
            tx.executeSql(sql, [], dbSuccessFunc = \emph {(tx, rs) {
                log("Ok, removed");
                return true;
            }, dbErrorFunc = \emph {(tx, e) {
                if (tx.message)
                    e = tx;
                log(" There has been an error deleteStudent: " + e.message);
                alert(" There has been an error deleteStudent: " + e.message);
                return false;
            });
        }
    });

}



// Low level insert
\emph { insertStudentStateL(db, id_student, id_group, id_session, state, actual_date ){
    var today = moment(actual_date);
    var today_str = today.toDate().toDateString();
    var sql ="INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (";
    sql += id_group + "," + id_student+ "," + id_session+ "," + state+ ",\"" + today_str+"\" );";

    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx,rs){  return true;     },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                log("insertStudentState2 : " + sql + "\n");
                alert(" There has been an error updateStudentState: " + e);
                return false;
            } );
    });
}

// Low level update
\emph { updateStudentStateL(db, id_student, id_group, id_session, state, actual_date ) {
        var today = moment(actual_date);
        var today_str = today.toDate().toDateString();

        var sql ="UPDATE attendance  SET a_type=?";
        sql += " WHERE id_student=? AND id_session=? AND a_date=? ;";

        db.transaction(\emph {(tx) {
            tx.executeSql(sql, [state,id_student,id_session,today_str],
                dbSuccessFunc = \emph {(tx,rs){  return true;  },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("updateStudentState : " + sql + "\n");
                    alert(" There has been an error updateStudentState2: " + e);
                    return false;
                } );
        });
}

// Check whether student state changes
// @id_student student id
\emph { stateCheck(db, id_student, id_group, id_session, state, actual_date){
    var today = moment(actual_date);
    var today_str = today.toDate().toDateString();

    var sql_check= "SELECT id_student, id_session, a_type, a_date FROM attendance ";
    sql_check += " WHERE "; //a_type="+state+ " AND ";
    sql_check += " id_session="+id_session+" AND a_date ='"+today_str +"' ";
    sql_check +=  " AND id_student="+ id_student +" ;";
    var exist = false;
    db.transaction(\emph {(tx) {

        tx.executeSql(sql_check,[],
                dbSuccessFunc = \emph {(tx,results){
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
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("SQL check "+sql_check);
                    alert(" There has been an error SELECT  stateCheck: " + e);
                    return false;
                } );
    });

    return exist;
}

// Write Student state
\emph { updateStudentState(db, id_student, id_group, id_session, state, actual_date ){
    var exist =false;
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

   \emph { loadStudentsByGroup(db,id_group) {
       db.transaction(
         \emph { (tx) {
            var sql = 'SELECT STUDENTS.id as id,  STUDENTS.id_group as id_group, STUDENTS.name as name, ';
            sql += ' STUDENTS.surname as surname, STUDENTS.n_date as n_date, STUDENTS.photo as photo, ';
            sql += ' STUDENTS.e_phone as e_phone, STUDENTS.repeated as repeated, STUDENTS.tutor as tutor ,';
            sql += ' STUDENTS.address as address , STUDENTS.nation as nation, STUDENTS.phone as phone,  ';
            sql += ' GROUPS.id as g_id, GROUPS.data as data  ';
            sql += ' FROM STUDENTS, GROUPS WHERE ';
            sql += ' STUDENTS.id_group = g_id AND id_group=' + id_group;
            tx.executeSql(sql, [],
                dbSuccessFunc = \emph {(tx, results) {
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
                dbErrorFunc = \emph {(tx, e) {
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


\emph { queryActivitiesSuccess(tx, results) {
    var len = results.rows.length;

    $('#activities_ul').empty();
    var id=0;
    for (var i=0;i<len;i++) {
       id = results.rows.item(i).id;
       $('#activities_ul').append("<li onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");
   }0 ;
   $('#activities_ul').listview('refresh');
}

\emph { queryLoadAllActivitiesDB(tx) {
       log("Query Activities \n");
       tx.executeSql('SELECT * FROM ACTIVITIES',[],
        dbSuccessFunc = \emph {(tx, results) {
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
                            html += " onClick=\"onUpdateActivity(" + id + ");\">Edit</a>";
                            html += "</li>";
                            ul_list.append(html);
                        }
                        ul_list.listview('refresh');
                        global_max_activities = results.rows.length;
                    }
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log(sql);
                    log(" There has been an error loadStudentsByGroup: "+e.message);
                    alert("There has been an error loadStudentsByGroup: " + e.message);
                      return false;
                });
}

\emph { loadAllActivities(db) {
       db.transaction(queryLoadAllActivitiesDB );
   }

//  populate update_activity page
\emph { loadActivity(db, id_activity ) {
    var sql = " SELECT  id, name , date_init , date_end , weight , final FROM ACTIVITIES WHERE id="+id_activity;

    db.transaction(\emph {(tx) {
        log("getActivity :"+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                if(results.rows.length>0 ){
                    $('#in_name_activity').val(results.rows.item(0).name);
                    $('#in_date_init_activity_scroller').val(results.rows.item(0).date_init);
                    $('#in_date_end_activity_scroller').val(results.rows.item(0).date_end);
                    $('#in_weight_activity').val(results.rows.item(0).weight);
                    $('#in_final_activity').val(results.rows.item(0).final);

                    var sql= "SELECT id, data, other_data FROM groups;";

                    tx.executeSql(sql,[],
                        dbSuccessFunc = \emph {(ttx, rs) {
                        global_no_groups = rs.rows.length;

                        if(global_no_groups>0) {
                            var ul_list = $('#list_groups_activities_ul');
                            var html;
                            ul_list.empty();
                            var id = 0;
                            for (var i = 0; i < global_no_groups; i++) {
                                id = rs.rows.item(i).id;
                                html = "<li >";
                                html += "<input style='text-align=right' type='checkbox' ";
                                html += "name='in_group_activity_"+id + "'  id='in_group_activity_" + id + "' enabled='true'  />";
                                html +="<label for='in_group_activity_"+ id +"' >";
                                html += rs.rows.item(i).data +"</label>";
                                html += " </li></br>";

                                ul_list.append(html);
                            }

                            var sql = "SELECT  activities_group.id_group, activities_group.id_activity, ";
                            sql += " activities_group.enabled AS enabled, groups.id , groups.data as data ";
                            sql += " FROM activities_group, groups WHERE activities_group.id_activity="+id_activity ;
                            sql += "  AND   activities_group.id_group=groups.id";
                            //log("SQL : "+ sql); // VIP query
                            tx.executeSql(sql,[],
                            dbSuccessFunc = \emph {(txx, rrs) {
                                var len=  rrs.rows.length;
                                log("Len : "+ len);
                                for (var i = 0; i < len; i++) { // ¿por que 16?
                                    var id_group = rrs.rows.item(i).id_group;
                                    var in_act = $("#in_group_activity_" + id_group );
                                    if(rrs.rows.item(i).enabled !=0) {
                                         in_act.attr("checked",true); //.checkboxradio("refresh");
                                         //in_act.checkboxradio("refresh");
                                    }
                                }
                                return true;
                            },
                            dbErrorFunc = \emph {(txx, e) {
                                if (txx.message) e = txx;
                                    log(" There has been an error insertNewActivity: "+e.message);
                                    alert("There has been an error insertNewActivity: " + e.message);
                                    return false;
                            });
                            //ul_list.listview('refresh');
                        }
                        return true;
                    },
                    dbErrorFunc = \emph {(ttx, e) {
                    if (ttx.message) e = ttx;
                        log(" There has been an error loadGroupsActivitiesEdit: "+e.message);
                        alert("There has been an error loadGroupsActivitiesEdit: " + e.message);
                        return false;
                });
//
                }
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error insertNewActivity: "+e.message);
                    alert("There has been an error insertNewActivity: " + e.message);
                    return false;
        });

    });


}
// Update activity
\emph { updateActivity(db, name , date_init , date_end , weight , e_final  ){
    var id_activity = global_id_activity;
    var e_name= name;
    var e_date_init = date_init;
    var e_date_end = date_end;
    var e_weight = weight;
    var e_e_final = e_final;

    db.transaction(\emph {(tx) {
        var sql = 'UPDATE activities SET ';
        sql += 'name="' + e_name + '" ';
        if ( e_date_init!=null) { sql += ', date_init="' + e_date_init + '" '; }
        if ( e_date_end!=null) {sql += ', date_end="' + e_date_end + '" ';  }
        sql += ', weight=' + e_weight;
        if(e_final!=0 ){     sql += ', e_final=' + e_e_final; }
        sql += ' WHERE  id=' +id_activity+ ';';

        log("updateActivity :"+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                var enabled=0;
                // alert("Nº groups "+ global_no_groups);
                for (var i=0;i<global_no_groups;i++) { // XXX: supone que los ids de grupo son correlativos
                        var checkbox=$('#in_group_activity_' + i );
                        var date_init=$('#in_date_init_activity_scroller').val();
                        var date_end=$('#in_date_end_activity_scroller').val();
                        enabled=0;
                        if(checkbox.is(':checked')) {
                             enabled=1;
                        }
                        notes ="";
                        log("UPDATE.  updateActivity ID Group id="+ i +" <-> "+enabled )
                        updateActivitiesGroup(db, i , id_activity, enabled , date_init, notes);
                }
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error updateActivity: "+e.message);
                    alert("There has been an error updateActivity: " + e.message);
                    return false;
        });

    });
//


}

//
// Update Activities for each group
\emph { updateActivitiesGroup(db, id_group, id_activity, enabled , a_date, notes){
    db.transaction(\emph {(tx) {
        var sql = 'UPDATE activities_group  SET ';
        sql += 'enabled=' + enabled;
        if(a_date!=null) { sql += ', a_date="' + a_date + '" '; }
        if(notes!=null) { sql += ', notes="' + notes + '" '; }
        sql += ' WHERE id_activity='+id_activity+' AND id_group='+id_group+' ;';

        log("UPDATE. updateActivitiesGroup  : "+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error updateActivitiesGroup : "+e.message);
                    alert("There has been an error  updateActivitiesGroup : " + e.message);
                    return false;
        });

    });

}


\emph { insertActivitiesGroup(db, id_group, last_inserted_row, enabled , a_date, notes){
    db.transaction(\emph {(tx) {
        var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (';
        sql +=  id_group ;
        sql += ','+ last_inserted_row;
        sql += ', ' + enabled ; // 0/1
        sql += ', "' + a_date+'"';
        sql += ', "' + notes+'"';
        sql += ');';
        log(" insertActivitiesGroup  : "+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                global_max_activities ++; // A new activity
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error  insertActivitiesGroup : "+e.message);
                    alert("There has been an error  insertActivitiesGroup : " + e.message);
                    return false;
        });

    });
}

\emph {  insertNewActivity( db, name , date_init , date_end , weight , e_final  ) {
    var last_inserted_row;
    db.transaction(\emph {(tx) {
        var sql = 'INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES (';
        sql += '"' + name + '" ';
        sql += ', "' + date_init + '" ';
        sql += ', "' + date_end + '" ';
        sql += ', ' + weight;
        sql += ', ' + e_final;
        sql += ');';

        log("insertNewActivity :"+sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error insertNewActivity: "+e.message);
                    alert("There has been an error insertNewActivity: " + e.message);
                    return false;
        });

        var sql = 'SELECT  last_insert_rowid() FROM activities;';

        log("insertNewActivity02 :"+sql); // SOLO funcionará para el primero
        tx.executeSql(sql ,[],
            dbSuccessFunc = \emph {(tx, results) {
                var i_last_inserted_row=results.rows.length; // ahora ya sabe cual es la última actividad
                var enabled=0;
                var a_date = Date();
                for (var i=0;i<global_no_groups;i++) { // XXX: supone que los ids de grupo son correlativos
                        var checkbox=$('#in_group_activity_' + i );
                        enabled=0;
                        if(checkbox.is(':checked')) {
                             enabled=1;
                        }
                        notes ="";
                        insertActivitiesGroup(db, i , i_last_inserted_row, enabled , a_date, notes);
                }
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error insertNewActivity2: "+e.message);
                    alert("There has been an error insertNewActivity2: " + e.message);
                    return false;
        });
    });
}



\emph { loadGroupsActivitiesEdit(db){
    db.transaction(\emph {(tx) {
        var sql = 'SELECT id, data, other_data FROM groups; ' ;
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
                global_no_groups = results.rows.length;
                //alert("Nº Groups: "+ global_no_groups);
                if(global_no_groups>0) {
                    var ul_list = $('#list_groups_activity_ul');
                    var html;
                    ul_list.empty();
                    var id = 0;
                    for (var i = 0; i < results.rows.length; i++) {
                        id = results.rows.item(i).id;
                        html = "<li >";
                        html += "<input style='text-align=right' type='checkbox' ";
                        html += "name='in_group_activity_"+id + "'  id='in_group_activity_" + id + "' enabled='true'  />";
                        html +="<label for='in_group_activity_"+ id +"' >";
                        html += results.rows.item(i).data +"</label>";
                        html += " </li></br>";

                       // alert("HTML: "+ html);
                        ul_list.append(html);
                    }
                    //ul_list.listview('refresh');
                }
                return true;
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                    log(" There has been an error loadGroupsActivitiesEdit: "+e.message);
                    alert("There has been an error loadGroupsActivitiesEdit: " + e.message);
                    return false;
        });
    });


}

//
//------------- Assessment:

// TODO: clean this code!
//

\emph { fillSelectStudentAssessment(db, select_student_id, id_session, id_student) {
    var html="";
    var id_activity= $('#list_assessment_select').val() ;// Activity selected
    global_id_activity= id_activity;

    var text_select = $('#' + select_student_id);

    html += "<option value=' ' selected='selected' > </option>";
    for(var i=10;i>=0;i--) {
        html += "<option value='"+i+"'>"+ i+"</option>";
    }
    text_select.empty().append(html);

    var sql= "SELECT id_student, id_activity, mark FROM ACTIVITIES_STUDENT  ";
    sql += "WHERE id_activity="+id_activity+ " AND id_student="+ id_student ;

    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    if (results.rows.length>0) {
                        var state = results.rows.item(0).mark;
                        text_select.val(state);
                        return true;
                    } else {
                        log("No data");
                        return false;
                    }
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });
}
\emph { updateStudentAssessmentL(db,id_student,id_group, id_activity,mark){
    var sql ="UPDATE ACTIVITIES_STUDENT SET mark="+mark;
    sql += " WHERE id_activity="+ id_activity + "  AND id_student="+ id_student;
    log("updateStudentAssessmentL SQL : " + sql);
    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    return true;
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}
\emph { insertStudentAssessmentL(db,id_student,id_group, id_activity,mark) {
    var sql ="INSERT INTO ACTIVITIES_STUDENT (id_student, id_activity,mark) VALUES ";
    sql += "( "+id_student +","+ id_activity +","+mark +" )";
    log("insertStudentAssessmentL SQL : " + sql);
    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    return true;
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });
}


\emph { onChangeStudentAssessment(id_student,id_group, id_activity){
    var db = global_db;

    var sql= "SELECT id_student, id_activity, mark FROM ACTIVITIES_STUDENT  ";
    sql += "WHERE id_activity="+id_activity+ " AND id_student="+ id_student ;

    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
                dbSuccessFunc = \emph {(tx,results){
                    var mark=$('#assessment_select_student_' + id_student).val();
                    if (results.rows.length>0) {
                        var state = results.rows.item(0).mark;

                        updateStudentAssessmentL(db,id_student,id_group, id_activity,mark);
                        log(" Mark => " + mark);
                        return true;
                    } else {
                        insertStudentAssessmentL(db,id_student,id_group, id_activity,mark);
                        return false;
                    }
                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("fillSelectStudent. SQL  "+sql);
                    alert("fillSelectStudent. There has been an error SELECT  stateCheck: " + e.message);
                    return false;
                } );
    });

}

// Assessment. List Students
\emph { listStudentsByGroupAssessment(db, id_group, students_ul) {
    db.transaction(\emph {(ttx) {
        var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group as id_group, STUDENTS.name as name, STUDENTS.surname as surname, STUDENTS.photo as photo, ";
        sql += " GROUPS.id, GROUPS.data FROM STUDENTS, GROUPS  WHERE GROUPS.id=id_group AND id_group=" + id_group;
        ttx.executeSql(sql, [], dbSuccessFunc = \emph {(ttx, rs) {
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
        }, dbErrorFunc = \emph {(ttx, e) {
            if (ttx.message)  e = ttx;
            log(" There has been an error  insertActivitiesGroup : " + e.message);
            alert("There has been an error  insertActivitiesGroup : " + e.message);
            return false;
        });
    });
}

\emph { refreshGroupAssessment(){

    listStudentsByGroupAssessment( global_db, global_id_group, $('#students_assessment_ul'));
}
// Assessment

\emph { loadGroupAssessment(db,id_group) {
    var html="";
    var list_asset=$('#list_assessment_select'); // list of activities for a group
//
//                enabled integer, a_date text, notes text,
    sql="SELECT ";
    sql += " ACTIVITIES_GROUP.a_date AS ag_date, ";
    sql += " ACTIVITIES_GROUP.id_group AS ag_group, ";
    sql += " ACTIVITIES_GROUP.id_activity AS ag_activity, ";
    sql += " ACTIVITIES_GROUP.enabled AS ag_enabled ,"; //
    sql += " ACTIVITIES.id AS a_id, ";
    sql +="  ACTIVITIES.name AS a_name,";
    sql += " ACTIVITIES.date_init AS a_date_init, ";
    sql += " ACTIVITIES.final AS a_final,  ";
    sql += " GROUPS.data AS g_data,  GROUPS.id as g_id ";
    sql += " FROM  ACTIVITIES, ACTIVITIES_GROUP, GROUPS ";
    sql += " WHERE  ACTIVITIES_GROUP.id_group = "+ id_group;
    sql += " AND ACTIVITIES_GROUP.id_activity = ACTIVITIES.id ";
    sql += " AND  GROUPS.id =  ACTIVITIES_GROUP.id_group  ";
    sql += " ORDER BY  ACTIVITIES.date_init  ASC; ";

    log("loadGroupAssessment SQL: "+sql);

    db.transaction(\emph {(tx) {
        tx.executeSql(sql,[],
            dbSuccessFunc = \emph {(tx, results) {
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
               // list_asset.selectmenu('refresh', true);

                if(results.rows.length>0) {
                    $('#current_group_assessment').text(results.rows.item(0).g_data); // Group Name
                }
                global_id_group = id_group;
                listStudentsByGroupAssessment( db, id_group, $('#students_assessment_ul'));
            },
            dbErrorFunc = \emph {(tx, e) {
                if (tx.message) e = tx;
                log(" queryStudentsAttendanceDB " + sql);
                alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
                return false;
            }// dbErrorFunc = \emph {(tx, e) {
            ); // tx.executeSql(sql,[],
        });

}

//
// studentAssesment
\emph { queryStudentsAssessmentSuccess(tx, results) {
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


\emph { queryStudentsAssessmentDB(tx) {
    var sql = "SELECT STUDENTS.id as id_student, STUDENTS.id_group, STUDENTS.name as name , STUDENTS.surname as surname, STUDENTS.photo as photo,";
    sql += " GROUPS.id as g_id, GROUPS.data as data ";
    sql += " ACTIVITIES.id a_id, ACTIVITIES.name,  " ;
    sql += " ACTIVITIES_STUDENT.id_student AS as_id_student, ACTIVITIES_STUDENT.id_activity AS as_id_activity, ACTIVITIES_STUDENT.mark as mark,  " ;
    sql += " FROM STUDENTS, GROUPS, ACTIVITIES, ACTIVITIES_STUDENT WHERE  ( g_id=STUDENTS.id_group  ";
    sql += " AND g_id=" + global_id ;
    sql += " AND a_id=as_id_activity  " ;
    sql += " AND id_student =as_id_activity  " ;

    sql += " ) ORDER BY id_student";

    tx.executeSql(sql, [], queryStudentsAttendanceSuccess,
        dbErrorFunc = \emph {(tx, e) {
            if (tx.message) e = tx;
            log(" queryStudentsAttendanceDB " + sql);
            alert(" There has been an error queryStudentsAttendanceDB: " + e.message);
        return false;
    });

}
////

\emph { queryListMaxActivities(tx) {
       tx.executeSql('SELECT id FROM ACTIVITIES',[],
        dbSuccessFunc = \emph {(tx, results) {
                    global_max_activities = results.rows.length;

                },
                dbErrorFunc = \emph {(tx, e) {
                    if (tx.message) e = tx;
                    log("queryListMaxActivities: " +sql);
                    log(" There has been an error queryListMaxActivities: "+e.message);
                    alert("There has been an error queryListMaxActivities: " + e.message);
                    return false;
                });
}
///
\emph { listMaxActivities(db) {

    global_max_activities=0;
    db.transaction(queryListMaxActivities);

}

// ----------------------------------------------------------------------------------------------------------
// delete
   \emph { deleteRawRecord(db, table, id){
       var db2 = db;
       var id2 = id;
       var table2 = table;

       db2.transaction(\emph { (tx) {
           var sql = 'DELETE FROM ' + table2 +' WHERE id=' + id2 ;
           tx.executeSql(sql);
       });
   }

   //groups_day_ul
   // loadSchedule

   \emph { loadSchedule(db, this_day) {
       global_db.transaction( querySchedulePerDayDB);
   }

// load all


   \emph { loadGroupsAttendance(db) {
       db.transaction(queryGroupsAttendanceDB);
   }
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


