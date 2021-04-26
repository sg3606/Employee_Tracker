DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

-- department
-- **id** - INT PRIMARY KEY
-- **name** - VARCHAR(30) to hold department name
CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- role
-- **id** - INT PRIMARY KEY
-- **title** -  VARCHAR(30) to hold role title
-- **salary** -  DECIMAL to hold role salary
-- **department_id** -  INT to hold reference to department role belongs to
CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

-- employee
-- **id** - INT PRIMARY KEY
-- **first_name** - VARCHAR(30) to hold employee first name
-- **last_name** - VARCHAR(30) to hold employee last name
-- **role_id** - INT to hold reference to role employee has
-- **manager_id** - INT to hold reference to another employee that manages the employee being Created. 
-- This field may be null if the employee has no manager
CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	manager_id INT,
	role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Legal");


INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ("Soft Engineer", 120000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("John", "Doe", 4, 1);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Mike", "Chan", 1, 2);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kevin", "Tupik", 4, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Ashley","Rodriguez", null, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Malia", "Brown", null, 5);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Sarah", "Lourd", null, 6);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Allen", 6, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
