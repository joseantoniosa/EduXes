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
        tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENTS (id integer primary key, data)');
        tx.executeSql('INSERT INTO STUDENTS (id, data) VALUES (NULL, "First student")');
        tx.executeSql('INSERT INTO STUDENTS (id, data) VALUES (NULL, "Second student")');
        tx.executeSql('INSERT INTO STUDENTS (id, data) VALUES (NULL, "Third student")');
        tx.executeSql('INSERT INTO STUDENTS (id, data) VALUES (NULL, "Fourth student")');
        
        
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
		   $('#grupos_ul').append("<li>"+results.rows.item(i).data +"</li>");
		   
	   }
	   $('#grupos_ul').listview('refresh');
	   
   }
   
   
   function queryStudentsSuccess(tx, results) {
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
		   $('#students_ul').append("<li>"+results.rows.item(i).data +"</li>");		  
	   }
	   $('#students_ul').listview('refresh');
	   
   }
   
   function loadGroups()
   {
	   
   }

   function loadStudents()
   {
	   
   }

 