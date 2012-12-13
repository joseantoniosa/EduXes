--- Groups
        DROP TABLE IF EXISTS GROUPS ;
        CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text);
--- Students
        DROP TABLE IF EXISTS STUDENTS;
        CREATE TABLE IF NOT EXISTS STUDENTS (
            id integer primary key, id_group integer not null, name text, surname text,
            repeated integer, n_date text , photo text,
            tutor TEXT, address TEXT, phone text, e_phone text, nation text,
            FOREIGN KEY(id_group) REFERENCES GROUPS(id));

-- Sessions ( franja horaria)
            DROP TABLE IF EXISTS SESSIONS;
            CREATE TABLE IF NOT EXISTS SESSIONS (id  integer primary key,
                description text, h_start text, h_end text);

-- Teacher's schedule
        DROP TABLE IF EXISTS TEACHER_SCHEDULE;
         CREATE TABLE IF NOT EXISTS TEACHER_SCHEDULE (id  integer primary key,
            id_session integer, day integer, id_group integer,
            FOREIGN KEY(id_group) REFERENCES GROUPS(id),
            FOREIGN KEY(id_session) REFERENCES SESSIONS(id));

-- Students Attendance
        DROP TABLE IF EXISTS ATTENDANCE;
        CREATE TABLE IF NOT EXISTS ATTENDANCE (id integer primary key ,
         id_group integer, id_student integer, id_session integer, a_type integer, a_date text,
        FOREIGN KEY (id_student) REFERENCES STUDENTS (id),
        FOREIGN KEY (id_group) REFERENCES GROUPS(id),
        FOREIGN KEY (id_session) REFERENCES SESSIONS(id) );

-- Activities
        DROP TABLE IF EXISTS ACTIVITIES ;
        CREATE TABLE IF NOT EXISTS ACTIVITIES
                (id integer primary key, name text, date_init text, date_end text, weight integer, final integer );

        DROP TABLE IF EXISTS activities_student;
        CREATE TABLE IF NOT EXISTS activities_student
                (id integer primary key ,  id_student integer, id_activity integer,
                mark integer, a_date text, notes text,
                FOREIGN KEY (id_student) REFERENCES students (id),
                FOREIGN KEY (id_activity) REFERENCES activities(id) );

        DROP TABLE IF EXISTS activities_group;
        CREATE TABLE IF NOT EXISTS activities_group
                (id integer primary key ,  id_group integer, id_activity integer,
                enabled integer, a_date text, notes text,
                FOREIGN KEY (id_group) REFERENCES groups (id),
                FOREIGN KEY (id_activity) REFERENCES activities(id) );

-- Timezone        TODO
        DROP TABLE IF EXISTS TIMEZONE;
        CREATE TABLE IF NOT EXISTS TIMEZONE
                (id integer primary key, description text, date_init text, date_end text);


--- Populate:

       INSERT INTO GROUPS ( id, data) VALUES ( 0, "Second A");
        INSERT INTO GROUPS ( id, data) VALUES ( 1, "Second B");
        INSERT INTO GROUPS ( id, data) VALUES ( 2, "Third A" );
        INSERT INTO GROUPS ( id, data) VALUES ( 3, "Third B");
-- Students

        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (0, "John",   "Doe",        "f001.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (0, "Daniel", "Mallice",    "f002.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (0, "Betty",   "Boo", "f008.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (0, "Julian","Assange", "f003.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (1, "Phillip",  "Morris",   "f004.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (1, "John","Lee Hooker", "f005.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (1, "Aretha","Franklin", "f006.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (2, "Vito","Corleone", "f007.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (2, "Alexandra","Milt", "f008.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (3, "Julius","Caesar", "f009.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (3, "Amanda","Hill", "f010.png" );
        INSERT INTO STUDENTS ( id_group, name, surname, photo) VALUES (3, "Paris","Hilton", "f011.png" );

//        -- Sessions ( franja horaria)

        INSERT INTO sessions (description, h_start, h_end) VALUES ( "First", "09:00", "09:50" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Second", "09:50", "10:40" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Third", "10:40", "11:30" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Recreation", "11:30", "12:00" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Fourth", "12:00", "12:50" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Fith", "12:50", "13:40" );
        INSERT INTO sessions (description, h_start, h_end) VALUES ( "Sixth", "13:40", "14:30" );

---       -- Teacher's schedule

        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (0, 1, 0 ); --  // 1st hour (0), Monday (1)  1st group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (1, 1, 1 ); --  // 2nd hour (1), Monday (1)  2nd group (1)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (2, 1, 1 ); --  // 3rd hour (2), Monday (1)  2nd group (1)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (3, 1, 2 ); --  // 4th hour (2), Monday (1)  3rd group (2)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (0, 2, 0 ); --  // 1st hour (0), Tuesday (2)  1st group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (5, 2, 1 ); --  // 6th hour (2), Tuesday (2)  2nd group (1)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (0, 3, 1 ); --  // 1st hour (0), Wednesday (3)  2nd group (1)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (1, 3, 2 ); --  // 2nd hour (1), Wednesday (3)  3rd group (2)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (2, 3, 0 ); --  // 3rd hour (2), Wednesday (3)  1st group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (0, 4, 0 ); --  // 1st hour (0), Thursday (4)  1st group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (2, 4, 1 ); -- // 3rd hour (2), Thursday (4)  2nd group (1)

        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (0, 5, 1 ); -- // 1st hour (0), Friday (5)  2nd group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (1, 5, 2 ); -- // 2nd hour (0), Friday (5)  3nd group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (3, 5, 2 );  --// 2nd hour (0), Friday (5)  3nd group (0)
        INSERT INTO teacher_schedule ( id_session, day , id_group ) VALUES (2, 5, 0 ); 

---Attendance:

        INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (0, 0, 0,1, date('now')  );
        INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (0, 0, 1,1,  date('now')  );
        INSERT INTO attendance ( id_group , id_student, id_session, a_type, a_date) VALUES (1, 0, 1,1, date('now') );

--  Activities (1):
        INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES ("been " , "12/11/2012" , "12/11/2012" , 0, 0);
        INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (0,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
        INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (1,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
        INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (2,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
        INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (3,1, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");

--- activities (2)

    INSERT INTO activities ( name , date_init , date_end , weight , final) VALUES ("polite " , "12/11/2012" , "12/15/2012" , 10, 0);
    INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (0,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
    INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (1,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
    INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (2,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");
    INSERT INTO activities_group ( id_group, id_activity, enabled , a_date, notes) VALUES (3,2, 1, "Tue Dec 11 2012 16:02:21 GMT+0000 (GMT)", "");






