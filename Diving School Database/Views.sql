CREATE OR REPLACE VIEW students_with_courses AS
SELECT Students.student_id, Students.first_name, Students.last_name, Courses.course_name
FROM Students, Enrollments, Courses
WHERE Students.student_id = Enrollments.student_id AND Courses.course_id = Enrollments.course_id
ORDER BY Students.student_id;

--SELECT * FROM students_with_courses;

CREATE OR REPLACE VIEW teachers_with_courses AS
SELECT first_name, last_name, course_name
FROM Teachers, Courses
WHERE Teachers.teacher_id = Courses.teacher_id
ORDER BY Teachers.teacher_id
;

--SELECT * FROM teachers_with_courses;