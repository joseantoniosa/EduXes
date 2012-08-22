// Referencia á base de datos
//
var db;
var id_global;
var table_global;
//
//


    function errorCB(err) {
  	   console.log("Error processing SQL: "+err);
 	   alert("Error processing SQL: "+err);
// 	   console.log("Error processing SQL: "+err.code);
// 	   alert("Error processing SQL: "+err.code);
    }

    function successCB() {
//        alert("success!");
    	console.log("Success ");
    }

    function populateDB(tx) {

    	tx.executeSql('DROP TABLE IF EXISTS GROUPS;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)');
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
        var header="INSERT INTO STUDENTS (id, id_group, name, surname, photo) VALUES (";
        tx.executeSql(header +'NULL,0, "0First"," student 0", "f001.png" )');
        tx.executeSql(header +'NULL,0, "0Second"," student 0", "f002.png" )');
        tx.executeSql(header +'NULL,0, "0Third "," student 0", "f003.png" )');
        tx.executeSql(header +'NULL,1, "First",  " student",   "f004.png" )');
        tx.executeSql(header +'NULL,1, "Second"," student", "f005.png" )');
        tx.executeSql(header +'NULL,1, "Third "," student", "f006.png" )');
        tx.executeSql(header +'NULL,2, "Fourth"," student", "f007.png" )');
        tx.executeSql(header +'NULL,2, "Fith"," student", "f008.png" )');
        tx.executeSql(header +'NULL,3, "Sixth"," student", "f009.png" )');
        tx.executeSql(header +'NULL,3, "Seventh ","student", "f010.png" )');
        tx.executeSql(header +'NULL,3, "Eighth ","student 11 ", "f011.png" )');
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
	   console.log("Query Students \n");
	   tx.executeSql('SELECT * FROM STUDENTS', [], queryStudentsSuccess, errorCB);
	}
   function queryStudentsByGroupDB(tx) {
	   // pass from and global id!!
	   log = "Query Students from STUDENTS WHERE id_group="+id_global+ "\n";
	   //alert("Log  queryStudentsByGroupDB "+ log);
	   console.log(log);
	   tx.executeSql('SELECT * FROM STUDENTS WHERE id_group='+id_global, [], queryStudentsSuccess, errorCB);
	}

   function queryActivitiesDB(tx) {
	   console.log("Query Activities \n");
	   tx.executeSql('SELECT * FROM ACTIVITIES', [], queryActivitiesSuccess, errorCB);
	}

// console.log("Query Groups \n");
   function queryGroupsSuccess(tx, results) {
	   console.log("Returned rows = " + results.rows.length);
	   var len = results.rows.length;
	   // this will be true since it was a select statement and so rowsAffected was 0
//	   if (!resultSet.rowsAffected) {
//		   console.log('No rows affected!');
//		   return false;
//	   }
	   // for an insert statement, this property will return the ID of the last inserted row
	   console.log("Last inserted row ID = " + results.insertId);
	   console.log("Number of rows inserted: " +  len)
// How to populate a List ?
  	   $('#groups_ul').empty();
//  <ul data-role="listview" data-inset="true" data-split-theme="d" data-split-icon="delete">
// 	    data-rel="dialog" data-transition="slideup"
//	   <a href="lists-split-purchase.html" data-rel="dialog" data-transition="slideup">Purchase album
//		</a>
	   var html;
	   for (var i=0;i<len;i++) {
		   html = "<li><h3> ";
		   html +="<a onClick='id_global="+ results.rows.item(i).id + "; table_global=\"groups\"; listStudents("+results.rows.item(i).id  +");' href='index.html#list_students' >";
		   html +=results.rows.item(i).data +"</a></h3>";
		   html +="<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
		   html += "</a></li>";
// <a data-role="button" data-icon="info" data-iconpos="notext" style="float: right;" onClick="help('alias');">Axuda</a>
//		   html +="<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"groups\";' href='remove.html' data-rel='dialog' data-transition='slideup'>";
//		   html += "</a></li>";


//		   html += results.rows.item(i).id+"</a> </li>";
		   $('#groups_ul').append(html);
	   }
	   $('#groups_ul').listview('refresh');
   }

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
// 		   html = "<li><h3 >"+results.rows.item(i).surname +" "+ results.rows.item(i).name+"</h3>";
		   html += "<a onClick='id_global="+ results.rows.item(i).id +"; table_global=\"students\"; ' href='index.html#show_student_activity' data-rel='dialog' data-transition='slideup'>";
		   html += "</a>";
		   html += "<img src='photos/"+results.rows.item(i).photo +"' alt='"+results.rows.item(i).surname +"' class='ui-li-icon ui-corner-none'>  ";
		   html += "<p>"+ results.rows.item(i).surname +" "+ results.rows.item(i).name +"</p>";
		   html += "</li>";
		  // html += results.rows.item(i).id+"</a> </li>";
		   $('#students_ul').append(html);

	   }
	   $('#students_ul').listview('refresh');

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

   function 	insertNewStudent(db, name, surname, group_id) { // TODO
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


   function loadActivities(db) {

	   db.transaction(queryActivitiesDB, errorCB, successCB);
   }
 /*
  * loadTimeTable(db) {
  * }
  * + ...
  *
  * */

