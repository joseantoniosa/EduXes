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
    	tx.executeSql('DROP TABLE IF EXISTS GROUPS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data)');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "First group  1")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Second group 2")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Third group  3" )');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (NULL, "Fourth group 4")');
        
    	tx.executeSql('DROP TABLE IF EXISTS STUDENTS');
    	create_students="CREATE TABLE IF NOT EXISTS STUDENTS ";
    	create_students +="(id integer primary key, group_id integer not null, data, FOREIGN KEY(group_id) REFERENCES groups(id))";
    	console.log(create_students);
        tx.executeSql(create_students);        
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "First student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "Second student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,1, "Third student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,2, "Fourth student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,2, "Fith student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,3, "Sixth student")');
        tx.executeSql('INSERT INTO STUDENTS (id, group_id, data) VALUES (NULL,3, "Seventh student")');
        
        
   }

   function queryDB(tx) {
	    tx.executeSql('SELECT * FROM GROUPS', [], querySuccess, errorCB);
	}
   function queryGroupsDB(tx) {
	    tx.executeSql('SELECT * FROM GROUPS', [], querySuccess, errorCB);
	}

   
   function queryStudentsDB(tx) {
	    tx.executeSql('SELECT * FROM STUDENTS', [], queryStudentsSuccess, errorCB);
	}

   function querySuccess(tx, results) {
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
	   // this will be true since it was a select statement and so rowsAffected was 0
//	   if (!resultSet.rowsAffected) {
//		   console.log('No rows affected!');
//		   return false;
//	   }
	   // for an insert statement, this property will return the ID of the last inserted row
	   console.log("Last inserted student - row ID = " + results.insertId);
	   console.log("Number of student - rows inserted: " +  len)
// How to populate a List ?
	   var id=0;
	   for (var i=0;i<len;i++) {
		   id = results.rows.item(i).id;
		   $('#students_ul').append("<li   onClick='"+"' >"+id +" "+results.rows.item(i).data +"</li>");		  
	   }
	   $('#students_ul').listview('refresh');
	   
   }
   
   function loadGroups(db)
   {
	   db.transaction(queryGroupsDB, errorCB, successCB);
   }

   function loadStudents(db)
   {
	   db.transaction(queryStudentsDB, errorCB, successCB);
   }

 