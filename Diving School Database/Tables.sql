CREATE TABLE IF NOT EXISTS Teachers(
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    salary NUMERIC(10,2),
    hire_date DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    CONSTRAINT t_ssn_unique UNIQUE(ssn),
    CONSTRAINT t_phone_number_unique UNIQUE(phone_number),
    CONSTRAINT min_salary CHECK(salary >= 0)
);

CREATE TABLE IF NOT EXISTS Students(
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    CONSTRAINT ssn_unique UNIQUE(ssn),
    CONSTRAINT phone_number_unique UNIQUE(phone_number)
);

CREATE TABLE IF NOT EXISTS Courses(
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    course_description VARCHAR(200),
    course_price NUMERIC(10,2),
    course_start_date DATE,
    course_end_date DATE,
    teacher_id INTEGER NOT NULL,
    CONSTRAINT t_id FOREIGN KEY(teacher_id) REFERENCES Teachers(teacher_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Enrollments(
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    CONSTRAINT s_id FOREIGN KEY(student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT c_id FOREIGN KEY(course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Equipments(
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(50) NOT NULL,
    equipment_description VARCHAR(200),
    equipment_price NUMERIC(10,2) NOT NULL,
    equipment_purchase_date DATE NOT NULL,
    equipment_warranty_date DATE NOT NULL,
    equipment_count INTEGER NOT NULL 
    CONSTRAINT e_count CHECK(equipment_count >= 0),
    CONSTRAINT e_price CHECK(equipment_price >= 0)
);

CREATE TABLE IF NOT EXISTS Equipment_Assignments(
    equipment_assignment_id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL, 
    using_equipment_count INTEGER NOT NULL,
    FOREIGN KEY(equipment_id) REFERENCES Equipments(equipment_id),
    CONSTRAINT c_id FOREIGN KEY(course_id) REFERENCES Courses(course_id)
);
