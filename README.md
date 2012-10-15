EduXes
======

Classroom Management

 Management of groups of students, students, activities, marks, timetable.

 - Students -
 - Activities -

= Howto =
 Type date in "Month/Day/Year" format


= References =
    Siestta [http://siestta.sourceforge.net/index.html]

= Schema =
 - #daily_work calls to open_daily_page  opens:
 - #daily_schedule fills #groups_day_ul and calls to  listStudents() opens:
 - #list_students

queryStudentsSuccess

function listStudentsAttendance
 fills: #students_attendance_ul
loadStudentAttendance
    calls :-> queryStudentsAttendanceDB
        calls :-> queryStudentsAttendanceSuccess

