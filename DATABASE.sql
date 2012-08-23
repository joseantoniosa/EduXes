--- Groups
		DROP TABLE IF EXISTS GROUPS
        CREATE TABLE IF NOT EXISTS GROUPS (id  integer primary key , data text , other_data text);
--  Data example        
        INSERT INTO GROUPS (id, data) VALUES (NULL, "First group  1");
        INSERT INTO GROUPS (id, data) VALUES (NULL, "Second group 2");
        INSERT INTO GROUPS (id, data) VALUES (NULL, "Third group  3" );
        INSERT INTO GROUPS (id, data) VALUES (NULL, "Fourth group 4");
        
-- Students    
    	DROP TABLE IF EXISTS STUDENTS;
    	CREATE TABLE IF NOT EXISTS STUDENTS 
    		id integer primary key, group_id integer not null, name text, surname text,
    		repeteated integer, n_date text ,
    		tutor TEXT, address TEXT, phone text, e_phone text, nation text,  
    		FOREIGN KEY(group_id) REFERENCES groups(id));
	--	e_phone,  is emergency phone
	--  repeteated, repeteated course 1= true, 0= false 		
--  Data example    	
        INSERT INTO STUDENTS (id, group_id, name, surname) VALUES (NULL,1, "First"," student")
        INSERT INTO STUDENTS (id, group_id, name, surname) VALUES (NULL,1, "Second"," student")

-- Activities        TODO 
    	DROP TABLE IF EXISTS ACTIVITIES
    	CREATE TABLE IF NOT EXISTS ACTIVITIES 
    		(id integer primary key, description text, date_init text, date_end text, weight real);     	
--  Data example        
    	INSERT INTO ACTIVITIES (id, description,date_init, date_end ,weight) VALUES (NULL,     
        	"Activity 1", "2012-01-01", "2012-02-01", 0.1 );

-- Timezone        TODO 
    	DROP TABLE IF EXISTS TIMEZONE
    	CREATE TABLE IF NOT EXISTS TIMEZONE 
    		(id integer primary key, description text, date_init text, date_end text);
    	
    	