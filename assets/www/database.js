// Cordova is ready
//

    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }

    function successCB() {
        alert("success!");
    }

    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS GROUPS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id unique, data)');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO GROUPS (id, data) VALUES (2, "Second row")');
   }

   function queryDB(tx) {
	    tx.executeSql('SELECT * FROM GROUPS', [], querySuccess, errorCB);
	}

   function querySuccess(tx, results) {
	   console.log("Returned rows = " + results.rows.length);
	   // this will be true since it was a select statement and so rowsAffected was 0
	   if (!resultSet.rowsAffected) {
		   console.log('No rows affected!');
		   return false;
	   }
	   // for an insert statement, this property will return the ID of the last inserted row
	   console.log("Last inserted row ID = " + results.insertId);
   }

 