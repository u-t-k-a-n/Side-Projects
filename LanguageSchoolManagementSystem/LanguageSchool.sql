CREATE TABLE IF NOT EXISTS RegistrationPasswords(
    registration_password_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    registration_password_hash VARCHAR(100) NOT NULL
);

INSERT INTO RegistrationPasswords (username,registration_password_hash) VALUES ('tom','e1608f75c5d7813f3d4031cb30bfb786507d98137538ff8e128a6ff74e84e643');
INSERT INTO RegistrationPasswords (username,registration_password_hash) VALUES ('mitch','b4472cf9e37c221a956bbcde136b681f6e49402258993cf22f910f18d07e7382');
INSERT INTO RegistrationPasswords (username,registration_password_hash) VALUES ('david','07d046d5fac12b3f82daf5035b9aae86db5adc8275ebfbf05ec83005a4a8ba3e');

CREATE OR REPLACE FUNCTION get_password_hash(user_name VARCHAR(50)) RETURNS VARCHAR(100) AS $$
    BEGIN
        RETURN (SELECT registration_password_hash FROM RegistrationPasswords WHERE user_name = username);
    END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS Courses(
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    course_price NUMERIC(10,2) NOT NULL CHECK(course_price >= 0)
);

INSERT INTO Courses (course_name,course_price) VALUES ('Arabic',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('Chinese',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('English',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('French',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('German',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('Spanish',12000);
INSERT INTO Courses (course_name,course_price) VALUES ('Turkish',12000);

CREATE TABLE IF NOT EXISTS Students(
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    home_phone_number VARCHAR(20),
    business_phone_number VARCHAR(20),
    course_name VARCHAR(50) NOT NULL,
    course_level VARCHAR(50) NOT NULL CHECK(course_level IN ('A1','A2','B1','B2','C1','C2')),
    payment_method VARCHAR(50) NOT NULL CHECK(payment_method IN ('Cash','3 Installments','6 Installments','12 Installments'))
);

CREATE OR REPLACE FUNCTION save_student(FullName VARCHAR(100), HomeNumber VARCHAR(20), BusinessNumber VARCHAR(20), CourseName VARCHAR(50), CourseLevel VARCHAR(50), PaymentMethod VARCHAR(50)) 
RETURNS INTEGER AS $$
    BEGIN
        INSERT INTO Students (full_name,home_phone_number,business_phone_number,course_name,course_level,payment_method) 
        VALUES (FullName,HomeNumber,BusinessNumber,CourseName,CourseLevel,PaymentMethod);
        RETURN (SELECT student_id FROM Students ORDER BY student_id DESC LIMIT 1);
    END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_payment_method(ID INTEGER) RETURNS VARCHAR(50) AS $$
    BEGIN
        RETURN (SELECT payment_method FROM Students WHERE ID = student_id);
    END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS Payments(
    payment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    payment_amount NUMERIC(10,2) NOT NULL CHECK(payment_amount >= 0)
);

CREATE OR REPLACE FUNCTION get_course_price(StudentID INTEGER) RETURNS NUMERIC(10,2) AS $$
    BEGIN
        RETURN (SELECT course_price 
        FROM Courses as c INNER JOIN Students as s ON s.Course_name = c.Course_name
        WHERE s.student_id = StudentID);
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_paid_amount(StudentID INTEGER) RETURNS NUMERIC(10,2) AS $$
    BEGIN
        RETURN (SELECT SUM(payment_amount) FROM Payments WHERE student_id = StudentID);
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION accept_payment(StudentID INTEGER, PaymentAmount NUMERIC(10,2)) RETURNS BOOLEAN AS $$
    BEGIN
        IF (get_paid_amount(StudentID) + PaymentAmount) > get_course_price(StudentID) THEN
            RETURN FALSE;
        ELSE
            INSERT INTO Payments (student_id,payment_amount) VALUES (StudentID,PaymentAmount);
            RETURN TRUE;
        END IF;
    END;
$$ LANGUAGE plpgsql;