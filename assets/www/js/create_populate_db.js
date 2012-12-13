/* Create and populate database
*/

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

// Create database and remove if  it exists
function createDB(tx) {
        var sql = "";
        var create_attendance ="";

        tx.executeSql('CREATE TABLE IF NOT EXISTS groups (id  integer primary key , data text , other_data text)',[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 1: " + e);
                return false;
                });

        var create_students="CREATE TABLE IF NOT EXISTS students ";
        create_students +=" (id integer primary key, id_group integer not null, name text, surname text,";
        create_students +=" repeated integer, n_date text , photo text, ";
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

        var create_attendance = "CREATE TABLE IF NOT EXISTS attendance (id integer primary key , ";
        create_attendance += " id_group integer, id_student integer, id_session integer, a_type integer, a_date text, ";
        create_attendance += " FOREIGN KEY (id_student) REFERENCES students (id), ";
        create_attendance += " FOREIGN KEY (id_group) REFERENCES groups(id), ";
        create_attendance += " FOREIGN KEY (id_session) REFERENCES sessions(id) );" ;

        tx.executeSql( create_attendance ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" Error:There has been an error create_attendance: " + e);
                return false;
                });

// Activities

        var create_activity = "CREATE TABLE IF NOT EXISTS activities (id integer primary key , ";
        create_activity += " name text, weight integer, date_init text, date_end text, final integer); ";

        tx.executeSql( create_activity ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" Error:There has been an error create_activity: " + e);
                return false;
                });

        create_a_student = " CREATE TABLE IF NOT EXISTS activities_student (id integer primary key , ";
        create_a_student += " id_student integer, id_activity integer, mark integer, a_date text, notes text, ";
        create_a_student += " FOREIGN KEY (id_student) REFERENCES students (id), ";
        create_a_student += " FOREIGN KEY (id_activity) REFERENCES activities(id) ); ";

//        log(create_a_student);
        tx.executeSql( create_a_student ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" Error:There has been an error create_a_student: " + e);
                return false;
                });

        create_a_group = " CREATE TABLE IF NOT EXISTS activities_group (id integer primary key , ";
        create_a_group += " id_group integer, id_activity integer, enabled integer, a_date text, notes text, ";
        create_a_group += " FOREIGN KEY (id_group) REFERENCES groups (id), ";
        create_a_group += " FOREIGN KEY (id_activity) REFERENCES activities(id) ); ";

        log("ACtivities_Group: " + create_a_group);
        tx.executeSql( create_a_group ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" Error:There has been an error create_a_group: " + e);
                return false;
                });

}
//
function drop_table_if_exist(tx)
{

    tx.executeSql('DROP TABLE IF EXISTS groups;',[],
        dbSuccessFunc = function(tx,rs){ return true; },
        dbErrorFunc = function(ttx, e) {
            if (ttx.message) e = ttx;
            alert(" There has been an error 0: " + e);
            return false;
            }
        );  // To be removed on production


    tx.executeSql('DROP TABLE IF EXISTS STUDENTS;',[],
        dbSuccessFunc = function(tx,rs){ return true;},
        dbErrorFunc = function(ttx, e) {
            if (ttx.message) e = ttx;
            alert(" There has been an error 2: " + e);
            return false;
            });  // To be removed on production


    tx.executeSql('DROP TABLE IF EXISTS teacher_schedule;',[],
            dbSuccessFunc = function(tx,rs){ return true;},
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error 2: " + e);
                return false;
                });  // To be removed on production

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



    var sql2 = " DROP TABLE IF EXISTS activities; ";
    tx.executeSql( sql2 ,[],
        dbSuccessFunc = function(tx,rs){
            return true;  },
        dbErrorFunc = function(ttx, e) {
            if (ttx.message) e = ttx;
            alert(" There has been an error sql2: " + e);
            return false;
            });
    var sql2  = "DROP TABLE IF EXISTS activities_student; ";
    tx.executeSql( sql2 ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error sql2: " + e);
                return false;
                });
    var sql2 = "DROP TABLE IF EXISTS activities_group; ";
    tx.executeSql( sql2 ,[],
            dbSuccessFunc = function(tx,rs){
                return true;  },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error sql2: " + e);
                return false;
                });
    tx.executeSql('DROP TABLE IF EXISTS sessions;',[],
            dbSuccessFunc = function(tx,rs){
        		return true;  },
			dbErrorFunc = function(ttx, e) {
    			if (ttx.message) e = ttx;
				alert(" There has been an error sql2: " + e);
					return false;
        		});

}

//
// Fake data:
//
function populateDB(tx) {

    log("populateDB. Populate DB");

// Groups -
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
// Activities (1):
        var sql='INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES ("been " , "12/11/2012" , "12/11/2012" , 0, 0);'
    	log(sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error attendance: " + e);
                return false;
                }
        );


        var sql='INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (0,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
    	log(sql);
        tx.executeSql(sql,[],
            dbSuccessFunc = function(tx,rs){ return true; },
            dbErrorFunc = function(ttx, e) {
                if (ttx.message) e = ttx;
                alert(" There has been an error attendance: " + e);
                return false;
                }
        );
        var sql='INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (1,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
        	log(sql);
            tx.executeSql(sql,[],
                dbSuccessFunc = function(tx,rs){ return true; },
                dbErrorFunc = function(ttx, e) {
                    if (ttx.message) e = ttx;
                    alert(" There has been an error attendance: " + e);
                    return false;
                    }
            );
        var sql='INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (2,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
            	log(sql);
                tx.executeSql(sql,[],
                    dbSuccessFunc = function(tx,rs){ return true; },
                    dbErrorFunc = function(ttx, e) {
                        if (ttx.message) e = ttx;
                        alert(" There has been an error attendance: " + e);
                        return false;
                        }
                );
        var sql='INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (3,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
                	log(sql);
                    tx.executeSql(sql,[],
                        dbSuccessFunc = function(tx,rs){ return true; },
                        dbErrorFunc = function(ttx, e) {
                            if (ttx.message) e = ttx;
                            alert(" There has been an error attendance: " + e);
                            return false;
                            }
                    );
//  activities (2)
     var sql = 'INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES ("polite " , "12/11/2012" , "12/15/2012" , 10, 0);'
	log(sql);
	tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
		return true;
	}, dbErrorFunc = function(ttx, e) {
		if (ttx.message)
			e = ttx;
		alert(" There has been an error attendance: " + e);
		return false;
	});
	var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (0,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
	log(sql);
	tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
		return true;
	}, dbErrorFunc = function(ttx, e) {
		if (ttx.message)
			e = ttx;
		alert(" There has been an error attendance: " + e);
		return false;
	});
	var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (1,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
	log(sql);
	tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
		return true;
	}, dbErrorFunc = function(ttx, e) {
		if (ttx.message)
			e = ttx;
		alert(" There has been an error attendance: " + e);
		return false;
	});
	var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (2,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
	log(sql);
	tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
		return true;
	}, dbErrorFunc = function(ttx, e) {
		if (ttx.message)
			e = ttx;
		alert(" There has been an error attendance: " + e);
		return false;
	});
	var sql = 'INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (3,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");'
	log(sql);
	tx.executeSql(sql, [], dbSuccessFunc = function(tx, rs) {
		return true;
	}, dbErrorFunc = function(ttx, e) {
		if (ttx.message)
			e = ttx;
		alert(" There has been an error attendance: " + e);
		return false;
	});

/*
//    Activities        TODO


        var header = "INSERT INTO ACTIVITIES ( description,date_init, date_end ,weight) VALUES (";

        tx.executeSql( header + '"Activity 1", "2012-01-01", "2012-02-01", 10 )');
        tx.executeSql( header + '"Activity 2", "2012-01-01", "2012-02-01", 7 )');
        tx.executeSql( header + '"Activity 3", "2012-01-01", "2012-02-01", 3 )');
        tx.executeSql( header + '"Activity 4", "2012-01-01", "2012-02-01", 10 )');
        tx.executeSql( header + '"Activity 5", "2012-01-01", "2012-02-01", 10 )');
        tx.executeSql( header + '"Activity 6", "2012-01-01", "2012-02-01", 10 )');
        tx.executeSql( header + '"Activity 7", "2012-01-01", "2012-02-01", 10 )');
        tx.executeSql( header + '"Activity 8", "2012-01-01", "2012-02-01", 20 )');
        tx.executeSql( header + '"Activity 9", "2012-01-01", "2012-02-01", 20 )');
**/

   }