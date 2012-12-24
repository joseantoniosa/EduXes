
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

\emph { loadGroupsAssessment() } Report->Assessment ->  Group\\

\emph { Peers () } Activities object

\emph { loadStudentsAssessment() } Report->Assessment ->  Students\\

//

\emph {  fillSelectStudent() } {  Fill attendance student page with options } \\



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

\emph { insertNewGroup(db, name, other_data)} {    \\
\emph { updateGroup(db, name, other_data)}{  Update Group  \\
\emph { deleteGroup(db) }{ Delete Group } \\
  // 
\emph { loadGroup(db, id_group){ Load only one group!

\emph { queryAllGroupsDB(tx) { List all groups }
\emph { loadAllGroups(db) { { List all groups }


// ---------------------------------------------------------------------------------------------------------
//
//      STUDENTS    Management:
//
// ----------------------------------------------------------------------------------------------------------
    // Insert new Student
\emph { insertNewStudent() } { Insert new Student  }
}

\emph { querySaveStudentDB (tx){ // Update Student /

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
\emph { updateStudentAssessmentL(db,id_student,id_group, id_activity,mark){  Update Student Assessment

\emph { insertStudentAssessmentL(db,id_student,id_group, id_activity,mark) { Insert Student Assessment  

\emph { onChangeStudentAssessment(id_student,id_group, id_activity){ Select Update or Insert 

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


