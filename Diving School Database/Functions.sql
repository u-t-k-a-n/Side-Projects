CREATE OR REPLACE FUNCTION insert_teacher(fname VARCHAR(50),
                                          lname VARCHAR(50),
                                          pnumber VARCHAR(20),
                                          bdate DATE,
                                          sal NUMERIC(10,2),
                                          hdate DATE,
                                          ssno VARCHAR(11))
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Teachers WHERE ssn = ssno) > 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Change to custom exception
    END IF;
    IF (SELECT COUNT(*) FROM Teachers WHERE phone_number = pnumber) > 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF sal < 0 THEN
        RAISE EXCEPTION 'Teacher salary cannot be negative';
    END IF;
    INSERT INTO Teachers(first_name, last_name, phone_number, birth_date, salary, hire_date, ssn)
    VALUES(fname, lname, pnumber, bdate, sal, hdate, ssno);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_teacher(t_id INTEGER,
                                          pnumber VARCHAR(20),
                                          sal NUMERIC(10,2))
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Teachers WHERE phone_number = pnumber AND teacher_id != t_id) > 0 THEN
        RAISE EXCEPTION 'ERROR'; --Phone number must be unique TODO: Add error message
    END IF;
    IF sal < 0 THEN
        RAISE EXCEPTION 'Teacher salary cannot be negative';
    END IF;
    UPDATE Teachers SET phone_number = pnumber, salary = sal WHERE teacher_id = t_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_teacher(t_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Teachers WHERE teacher_id = t_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_student(fname VARCHAR(50),
                                          lname VARCHAR(50),
                                          pnumber VARCHAR(20),
                                          bdate DATE,
                                          ssno VARCHAR(11))
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Students WHERE ssn = ssno) > 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Change to custom exception
    END IF;
    IF (SELECT COUNT(*) FROM Students WHERE phone_number = pnumber) > 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    INSERT INTO Students(first_name, last_name, phone_number, birth_date, ssn)
    VALUES(fname, lname, pnumber, bdate, ssno);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_student(s_id INTEGER,
                                          pnumber VARCHAR(20))
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Students WHERE phone_number = pnumber AND student_id != s_id) > 0 THEN
        RAISE EXCEPTION 'ERROR'; --Phone number must be unique TODO: Add error message
    END IF;
    UPDATE Students SET phone_number = pnumber WHERE student_id = s_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_student(s_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Students WHERE student_id = s_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_course(cname VARCHAR(50),
                                         cdesc VARCHAR(100),
                                         ccost NUMERIC(10,2),
                                         c_start_date DATE,
                                         c_end_date DATE,
                                         c_teacher_id INTEGER)

RETURNS VOID AS $$
BEGIN
    IF c_start_date > c_end_date THEN -- TODO: change > to range
        RAISE EXCEPTION 'Start date cannot be before the end date '; -- TODO: Add error message
    END IF;
    IF ccost < 0 THEN
        RAISE EXCEPTION 'Course cost cannot be negative';
    END IF;
    INSERT INTO Courses(course_id,course_name, course_description, course_price, course_start_date, course_end_date, teacher_id)
    VALUES(nextval('course_id_seq'),cname, cdesc, ccost, c_start_date, c_end_date, c_teacher_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_course(c_id INTEGER,
                                         cname VARCHAR(50),
                                         cdesc VARCHAR(100),
                                         ccost NUMERIC(10,2),
                                         c_start_date DATE,
                                         c_end_date DATE,
                                         c_teacher_id INTEGER)
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Teachers WHERE teacher_id = c_teacher_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF c_start_date > c_end_date THEN -- TODO: change > to range
        RAISE EXCEPTION 'Start date cannot be before the end date '; -- TODO: Add error message
    END IF;
    IF ccost < 0 THEN
        RAISE EXCEPTION 'Course cost cannot be negative';
    END IF;
    UPDATE Courses SET course_name = cname, course_description = cdesc, course_price = ccost, 
                       course_start_date = c_start_date, course_end_date = c_end_date, 
                       teacher_id = c_teacher_id
                   WHERE course_id = c_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_course(c_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Courses WHERE course_id = c_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_student_course(s_id INTEGER,
                                                 c_id INTEGER)
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Students WHERE student_id = s_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF (SELECT COUNT(*) FROM Courses WHERE course_id = c_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    INSERT INTO Enrollments(student_id, course_id)
    VALUES(s_id, c_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_student_course(s_id INTEGER,
                                                 c_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Enrollments WHERE student_id = s_id AND course_id = c_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_equipment(e_name VARCHAR(50),
                                            e_desc VARCHAR(100),
                                            e_cost NUMERIC(10,2),
                                            e_purchase_date DATE,
                                            e_warranty_date DATE,
                                            e_count INTEGER)
RETURNS VOID AS $$
BEGIN
    IF e_cost < 0 THEN
        RAISE EXCEPTION 'Equipment cost cannot be negative';
    END IF;
    IF e_purchase_date > e_warranty_date THEN
        RAISE EXCEPTION 'Purchase date cannot be after the warranty date '; -- TODO: Add error message
    END IF;
    INSERT INTO Equipments(equipment_name, equipment_description, equipment_price, equipment_purchase_date, equipment_warranty_date, equipment_count)
    VALUES(e_name, e_desc, e_cost, e_purchase_date, e_warranty_date, e_count);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_equipment(e_id INTEGER,
                                            e_desc VARCHAR(100),
                                            e_cost NUMERIC(10,2),
                                            e_warranty_date DATE,
                                            e_count INTEGER)
RETURNS VOID AS $$
BEGIN
    IF e_cost < 0 THEN
        RAISE EXCEPTION 'Equipment cost cannot be negative';
    END IF;
    UPDATE Equipments SET equipment_description = e_desc, equipment_price = e_cost, 
                         equipment_warranty_date = e_warranty_date, 
                         equipment_count = e_count
                   WHERE equipment_id = e_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_equipment(e_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Equipments WHERE equipment_id = e_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_equipment_course(e_id INTEGER,
                                                   c_id INTEGER,
                                                   e_count INTEGER)
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Equipments WHERE equipment_id = e_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF (SELECT COUNT(*) FROM Courses WHERE course_id = c_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF e_count < 0 THEN
        RAISE EXCEPTION 'Equipment count cannot be negative';
    END IF;
    IF (SELECT equipment_count FROM Equipments WHERE equipment_id = e_id) < e_count THEN
        RAISE EXCEPTION 'Not enough equipment.'; -- TODO: Add error message
    END IF;
    INSERT INTO Equipment_Assignments(equipment_id, course_id, using_equipment_count)
    VALUES(e_id, c_id, e_count);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_equipment_course(e_id INTEGER,
                                                   c_id INTEGER,
                                                   e_count INTEGER)
RETURNS VOID AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Equipments WHERE equipment_id = e_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF (SELECT COUNT(*) FROM Courses WHERE course_id = c_id) = 0 THEN
        RAISE EXCEPTION 'ERROR'; -- TODO: Add error message
    END IF;
    IF e_count < 0 THEN
        RAISE EXCEPTION 'Equipment count cannot be negative';
    END IF;
    IF (SELECT equipment_count FROM Equipments WHERE equipment_id = e_id) < e_count THEN
        RAISE EXCEPTION 'Not enough equipment.'; -- TODO: Add error message
    END IF;
    UPDATE Equipment_Assignments SET using_equipment_count = e_count
                              WHERE equipment_id = e_id AND course_id = c_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delete_equipment_course(e_id INTEGER,
                                                   c_id INTEGER)
RETURNS VOID AS $$
BEGIN
    DELETE FROM Equipment_Assignments WHERE equipment_id = e_id AND course_id = c_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_teacher(t_name VARCHAR(50))
RETURNS VOID AS $$
DECLARE
    cursor1 CURSOR FOR SELECT *
                          FROM Teachers
                          WHERE first_name ILIKE ('%' || t_name || '%') OR last_name ILIKE ('%' || t_name || '%');
BEGIN
    FOR i IN cursor1 LOOP
        RAISE NOTICE 'Teacher id: % , teacher name: % , teacher surname: % , teacher phone number: % ,
                      teacher birth date: % , teacher salary: % , teacher hire date: % , teacher ssn: %',
                      i.teacher_id, i.first_name, i.last_name, i.phone_number, i.birth_date, i.salary, 
                      i.hire_date, i.ssn;
    END LOOP;

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION search_student(s_name VARCHAR(50))
RETURNS VOID AS $$
DECLARE
    cursor1 CURSOR FOR SELECT *
                          FROM Students
                          WHERE first_name ILIKE ('%' || s_name || '%') OR last_name ILIKE ('%' || s_name || '%');
BEGIN
    FOR i IN cursor1 LOOP
        RAISE NOTICE 'Student id: % , student name: % , student surname: % , student phone number: % ,
                      student birth date: % , student ssn: %',
                      i.student_id, i.first_name, i.last_name, i.phone_number, i.birth_date, i.ssn;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_course(c_name VARCHAR(50))
RETURNS TABLE(course_id INTEGER, course_name VARCHAR(50), course_description VARCHAR(100), course_price NUMERIC(10,2),
              course_start_date DATE, course_end_date DATE, course_teacher_id INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT *
               FROM Courses as c
               WHERE c.course_name ILIKE ('%' || c_name || '%');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_equipment(e_name VARCHAR(50))
RETURNS TABLE(equipment_id INTEGER, equipment_name VARCHAR(50), equipment_description VARCHAR(100), equipment_price NUMERIC(10,2),
              equipment_purchase_date DATE, equipment_warranty_date DATE, equipment_count INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT *
               FROM Equipments AS e
               WHERE e.equipment_name ILIKE ('%' || e_name || '%');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_student_course(s_id INTEGER, c_name VARCHAR(50))
RETURNS TABLE(student_first_name VARCHAR(50), student_last_name VARCHAR(50), course_name VARCHAR(50)) AS $$
BEGIN
    RETURN QUERY SELECT sc.first_name, sc.last_name, sc.course_name
               FROM students_with_courses AS sc
               WHERE sc.student_id = s_id AND LOWER(sc.course_name) = LOWER(c_name);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_teacher_course(t_name VARCHAR(50), t_last_name VARCHAR(50))
RETURNS TABLE(teacher_first_name VARCHAR(50), teacher_last_name VARCHAR(50), course_name VARCHAR(50), course_count BIGINT) AS $$
BEGIN
    RETURN QUERY SELECT tc.first_name, tc.last_name, tc.course_name, COUNT(*) AS course_count
               FROM teachers_with_courses AS tc
               WHERE tc.first_name ILIKE ('%' || t_name || '%') OR tc.last_name ILIKE ('%' || t_last_name || '%')
               GROUP BY tc.first_name, tc.last_name, tc.course_name;
END; 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION not_used_equipment()
RETURNS TABLE(equipment_id INTEGER, equipment_name VARCHAR(50), equipment_price NUMERIC(10,2), equipment_count INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT e.equipment_id, e.equipment_name, e.equipment_price, e.equipment_count
                 FROM Equipments AS e
                 WHERE e.equipment_id  IN (SELECT DISTINCT e2.equipment_id FROM Equipments AS e2
                                           EXCEPT
                                           SELECT DISTINCT ea.equipment_id FROM Equipment_Assignments AS ea);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION over_used_equipment(threshold INTEGER)
RETURNS TABLE(equipment_id INTEGER, equipment_name VARCHAR(50), number_of_used BIGINT) AS $$
BEGIN 
    RETURN QUERY SELECT e.equipment_id, e.equipment_name, COUNT(*) AS num_used
                 FROM Equipments AS e, Equipment_Assignments AS ea
                 WHERE e.equipment_id  = ea.equipment_id
                 GROUP BY e.equipment_id, e.equipment_name
                 HAVING COUNT(*) > threshold
                 ORDER BY num_used DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION student_with_equipment(s_id INTEGER)
RETURNS VOID AS $$
DECLARE
    cursor1 CURSOR FOR
        SELECT DISTINCT e.equipment_id, e.equipment_name
        FROM Equipments AS e,Enrollments as e2, Equipment_Assignments AS ea
        WHERE e.equipment_id = ea.equipment_id AND e2.student_id = s_id AND e2.course_id = ea.course_id;
BEGIN
    FOR i IN cursor1
    LOOP
        RAISE NOTICE 'equipment id: %  equipment name: %', i.equipment_id,i.equipment_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE course_type AS (
	course_id INTEGER,
    course_name VARCHAR(50),
    course_price NUMERIC(10,2),
    total_std_count BIGINT,
    total_eqp_count BIGINT,
    course_teacher_id INTEGER
);


CREATE OR REPLACE FUNCTION get_course_info(c_name VARCHAR(50))
RETURNS course_type AS $$
DECLARE
    course course_type;
BEGIN
    SELECT c.course_id,c.course_name, c.course_price, COUNT(*) AS total_std_count, c.teacher_id 
    INTO course.course_id, course.course_name, course.course_price, course.total_std_count, course.course_teacher_id
    FROM Courses AS c, Enrollments AS e, Equipment_Assignments AS ea
    WHERE c.course_id = e.course_id AND e.course_id = ea.course_id AND c.course_name ILIKE ('%' || c_name || '%')
    GROUP BY c.course_id, c.course_name, c.course_price, course.total_std_count, course.total_eqp_count, c.teacher_id;
    
	SELECT SUM(ea.using_equipment_count) AS total_eqp_count
	INTO course.total_eqp_count
	FROM Equipment_Assignments AS ea
	WHERE course.course_id = ea.course_id;
	
	
	RAISE NOTICE 'course id: % course name: %  course price: %  total student count: %  total equipment count: %  teacher id: %',
               course.course_id, course.course_name, course.course_price, course.total_std_count, course.total_eqp_count, course.course_teacher_id;
    RETURN course;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE teacher_type AS (
    teacher_id INTEGER,
    teacher_first_name VARCHAR(50),
    teacher_last_name VARCHAR(50),
    teacher_phone_number VARCHAR(20),
    teacher_working_days INTEGER,
    teacher_std_count BIGINT,
    total_course_count BIGINT
);

CREATE OR REPLACE FUNCTION get_teacher_info(t_name VARCHAR(50), t_last_name VARCHAR(50))
RETURNS teacher_type AS $$
DECLARE
    teacher teacher_type;
BEGIN
    SELECT t.teacher_id, t.first_name, t.last_name, t.phone_number, NOW()::DATE - t.hire_date AS teacher_working_days, COUNT(*) AS teacher_std_count, COUNT(DISTINCT c.course_id) AS total_course_count
    INTO teacher.teacher_id, teacher.teacher_first_name, teacher.teacher_last_name, teacher.teacher_phone_number, teacher.teacher_working_days, teacher.teacher_std_count, teacher.total_course_count
    FROM Teachers AS t, Courses AS c, Enrollments AS e
    WHERE t.teacher_id = c.teacher_id AND c.course_id = e.course_id AND (t.first_name ILIKE ('%' || t_name || '%') OR t.last_name ILIKE ('%' || t_last_name || '%'))
    GROUP BY t.teacher_id, t.first_name, t.last_name, t.phone_number;
    
    RAISE NOTICE 'teacher id: % teacher first name: % teacher last name: % teacher phone number: % teacher working days: % teacher student count: % teacher course count: %',
               teacher.teacher_id, teacher.teacher_first_name, teacher.teacher_last_name, teacher.teacher_phone_number, teacher.teacher_working_days, teacher.teacher_std_count, teacher.total_course_count;
    RETURN teacher;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE equipment_type AS (
    equipment_id INTEGER,
    equipment_name VARCHAR(50),
    total_course_count BIGINT,
    total_used_count BIGINT,
    warranty_period INTEGER
);

CREATE OR REPLACE FUNCTION get_equipment_info(e_name VARCHAR(50))
RETURNS equipment_type AS $$
DECLARE
    equipment equipment_type;
BEGIN
    SELECT e.equipment_id, e.equipment_name, COUNT(DISTINCT ea.course_id) AS total_course_count, (e.equipment_warranty_date - e.equipment_purchase_date) AS warranty_period
    INTO equipment.equipment_id, equipment.equipment_name, equipment.total_course_count, equipment.warranty_period
    FROM Equipments AS e, Equipment_Assignments AS ea
    WHERE e.equipment_id = ea.equipment_id AND e.equipment_name ILIKE ('%' || e_name || '%')
    GROUP BY e.equipment_id, e.equipment_name;

    SELECT SUM(ea.using_equipment_count) AS total_used_count
    INTO equipment.total_used_count
    FROM Equipment_Assignments AS ea
    WHERE equipment.equipment_id = ea.equipment_id;
    
    RAISE NOTICE 'equipment id: % equipment name: % total course count: % total used count: % warranty period: %',
               equipment.equipment_id, equipment.equipment_name, equipment.total_course_count, equipment.total_used_count, equipment.warranty_period;
    RETURN equipment;
END;
$$ LANGUAGE plpgsql;



