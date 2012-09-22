== Database Design ==
    ASAP
    As simple as possible!:
        1 teacher
        Same timetable for every day of week
        1 subject per teacher
        1 only one classroom

    - Design timetable. Siestta version:
     --       horario:
       ---         id_profe
       ---         id_franja
       ---         dia
       ---         sesión.

       --     franjas:
        ---        id_profe
        ---        h_inicio
        ---        h_fin.

       --     periodos:
        ---        nombre
        ---        h_inicio
        ---        h_fin

      --      agenda:
        ---         id_profe
        ---         id_franja
        ---         dia
        ---         fecha
        ---         cita
        ---         tipo.
        (franja1)(franja2)...
    horario (de profe):
        id_franja
        dia (tiny integer) (0-6) (1-5)
        id_subject

    - Design idea (1), from teacher's point of view
        [1]-h_start,  h_end
                ->Group, subject, (id_teacher), id_appointment

        [2]-h_start,  h_end
                ->Group, subject
        [3]-h_start,  h_end
                ->Group, subject
        [4]-h_start,  h_end
                ->Group, subject
        [5]-h_start,  h_end
                ->Group, subject
        [6]-h_start,  h_end
                ->Group, subject
        ...
    - Implementation idea (2), from teacher's point of view

        ** ("franja") / sessions
            id  integer
            h_start text
            h_end   text

            DROP TABLE IF EXISTS sessions
            CREATE TABLE IF NOT EXISTS sessions (id  integer primary key , h_start text , h_end text);

        ** "horario_profesor"/teacher_schedule ""
       ---          id
       ---         (id_teacher (now only 1 teacher))
       ---         id_session / (id_franja )
       ---         day (day of week) integer
       ---         (id_subject  integer)
       ---          id_group
       ---          (id_classroom)

            DROP TABLE IF EXISTS teacher_schedule
            CREATE TABLE IF NOT EXISTS teacher_schedule (id  integer primary key ,
                 id_session integer, day integer, id_group integer,
                 FOREIGN KEY(id_group) REFERENCES groups(id),
                 FOREIGN KEY(id_session) REFERENCES sessions(id)
                 );


--todo later:


    -- Appointments
        id
        date
        text

    -- Subjects
        id
        id_teacher integer (to add more teachers)
        name    text


    periods
        **
                    id_profe
       ---         id_franja
       ---         dia
       ---         sesión.
        FOREIGN KEY(trackartist) REFERENCES artist(artistid)

