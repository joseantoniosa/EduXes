// Cordova is ready
//

    function errorCB(err) {
 	   console.log("Error processing SQL: "+err.code);
 	   alert("Error processing SQL: "+err.code);
    }

    function successCB() {
//        alert("success!");
    	console.log("Success ");
    }

    function populateDB(tx) {
    	
//    	tx.executeSql('DROP TABLE IF EXISTS GROUPS');
//        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text)');
//        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "First group  1")');
//        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Second group 2")');
//        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Third group  3" )');
//        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Fourth group 4")');
// Students        
    	tx.executeSql('DROP TABLE IF EXISTS STUDENTS');
    	var create_students="CREATE TABLE IF NOT EXISTS STUDENTS ";
    	create_students +="(id integer primary key, group_id integer not null, data text , FOREIGN KEY(group_id) REFERENCES groups(id))";
    	console.log(create_students);
        tx.executeSql(create_students);        
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "First student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "Second student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "Third student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,2, "Fourth student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,2, "Fith student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,3, "Sixth student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,3, "Seventh student")');
//
//	Activities        
    	tx.executeSql('DROP TABLE IF EXISTS ACTIVITIES');
    	var create_activities="CREATE TABLE IF NOT EXISTS ACTIVITIES ";
    	create_activities +="(id integer primary key, description text, date_init text, date_end text, weight real ";
    	console.log(create_activities);
        tx.executeSql(create_activities);
        
    	var header = "INSERT INTO GROUPS (id, description,date_init, date_end ,weight) VALUES (NULL,";
     
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
	   for (var i=0;i<len;i++) {
		   $('#grupos_ul').append("<h3 onClick='"+"' >"+results.rows.item(i).data +"</h3>");
		   
	   }
	   $('#grupos_ul').listview('refresh');	   
   }
   
   
   function queryStudentsSuccess(tx, results) {

	   var len = results.rows.length;
	   console.log("Last inserted student - row ID = " + results.insertId);
	   console.log("Number of student - rows inserted: " +  len)

	   var id=0;
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;
		   $('#students_ul').append("<li   onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");		  
	   }
	   $('#students_ul').listview('refresh');
	   
   }
   
   function queryActivitiesSuccess(tx, results) {
	   var len = results.rows.length;
	   console.log("Last inserted activity - row ID = " + results.insertId);
	   console.log("Number of activity - rows inserted: " +  len)

	   var id=0;
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;
		   $('#activities_ul').append("<li   onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");		  
	   }
	   $('#activities_ul').listview('refresh');	   
	   
	   
   }
   
   // Insert new
   
   function insertNewGroup(db, name, other_data){
	   var db2= db;
	   var name2= name;
	   var other_data2 = other_data;
	   	   
	   db2.transaction(function (tx) {
		   var sql = 'INSERT INTO GROUPS (id, data, other_data) VALUES (NULL,';		   
		   sql  +=  '\"'  + name2 + '\" ,  \"'+ other_data2 + '\"  )' ;
		   tx.executeSql(sql, [], function (tx, results) {
			   console.log("Exito insertando datos \n");
			   alert("Exito insertando grupo " + data);	 

		   }, errorCB );
	   });
// refresh de la GUI?	   
	   $('#grupos_ul').listview('refresh');	   

	   
	   
	   /*db.transaction(function (tx) {
	   tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
	    var len = results.rows.length, i;
	    msg = "<p>Found rows: " + len + "</p>";
	    document.querySelector('#status').innerHTML +=  msg;  
	  }, null);
	 });
	 */
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

   function loadActivities(db) {
	   
	   db.transaction(queryActivitiesDB, errorCB, successCB);	   	   
   }
 /*
  * loadTimeTable(db) {
  * }
  * + ...
  * 
  * */
  
   