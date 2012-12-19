
Classroom Management

 This application is intended to be used by high school teachers.


 Management of groups of students, students, activities and marks.

 - Groups -
 - Students -
 - Activities -

 User can control attendance and assessment for several groups of students.

== Acknowledgments

Coded for  Master Software Libre Practicum 5th Edition Vigo

 http://www.mastersoftwarelibre.com


= Howto =
 Type date in "Month/Day/Year" format
 In your smart-phone or tablet:
  - Look up "EduXes" in google:
  - Go to "bin" folder 
  - open "EduXes.apk"
  - Click on "Raw"
  - Save and Install
  - Send bugs, complaints:
  https://github.com/joseantoniosa/EduXes/issues?state=open
  

 == Now is working:
- Insert and View Attendance, Excused for student.
- List Students and groups.
- Chage student's data but photo.
- Add Group. Goto Settings -> Groups-> Add
- Add Student. Goto Settings ->Groups -> Choose a group-> Add
- Add, Edit Activity
- Manage marks for students
- List of marks for groups, includes mean values for each activity.

 contact info : info@joseantonio.org

= References =
    Siestta [http://siestta.sourceforge.net/index.html]

= Schema =
 - #daily_work calls to open_daily_page  opens:
 - #daily_schedule fills #groups_day_ul and calls to  listStudents() opens:
 - #list_students

== Conventions =
onXXX is a function allways called from html code

