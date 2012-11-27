#-------------------------------------------------------------------------------
# Copyright (c) 2012 jantonio.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the GNU Public License v3.0
# which accompanies this distribution, and is available at
# http://www.gnu.org/licenses/gpl.html
# 
# Contributors:
#     jantonio - initial API and implementation
#-------------------------------------------------------------------------------
EduXes
======

Classroom Management

 Management of groups of students, students, activities, marks, timetable.

 - Students -
 - Activities -

= Howto =
 Type date in "Month/Day/Year" format
 Works Insert and View Attendance, Excused for student.


 contact info : info@joseantonio.org

= References =
    Siestta [http://siestta.sourceforge.net/index.html]

= Schema =
 - #daily_work calls to open_daily_page  opens:
 - #daily_schedule fills #groups_day_ul and calls to  listStudents() opens:
 - #list_students


= Functions' Tree =
queryStudentsSuccess

function listStudentsAttendance
 fills: #students_attendance_ul
loadStudentAttendance
    calls :-> queryStudentsAttendanceDB
        calls :-> queryStudentsAttendanceSuccess:
            Genera el código html que se mostrará como lista de estudiantes.


