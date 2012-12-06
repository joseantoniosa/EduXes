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
        DROP TABLE IF EXISTS TIMEZONE
        CREATE TABLE IF NOT EXISTS TIMEZONE
                (id integer primary key, description text, date_init text, date_end text);

