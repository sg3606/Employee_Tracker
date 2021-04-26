const mysql = require("mysql");
const inquirer = require("inquirer");
const consoletable = require('console.table');

// connect to mysql db
const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
  
    user: 'root',
  
    password: 'password',

    database: 'employee_tracker_db',
});
  
connection.connect((err) => {
    if (err) throw err;
    init();
});

// start the app
const init = () => {
    inquirer
      .prompt({
        name: 'Selection',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
          'Check All',
          'Check All By Department',
          'Check All By Manager',
          'Add an Employee',
          'Remove an Employee',
          'Update Employee Role',
          'Update Employee Manager'
        ],
      })
      .then((answer) => {
        switch (answer.Selection) {
          case 'Check All':
            checkAll();
            break;
  
          case 'Check All By Department':
            checkByD();
            break;
  
          case 'Check All By Manager':
            checkByM();
            break;
  
          case 'Add an Employee':
            add();
            break;
  
          case 'Remove an Employee':
            remove();
            break;

          case 'Update Employee Role':
            updateRole();
            break;

          case 'Update Employee Manager':
            updateManager();
            break;
        
          default:
            console.log(`Invalid action: ${answer.Selection}`);
            break;
        }
    });
};

// check all employees
const checkAll = () => {
    const query =
        "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', CONCAT(e.first_name,' ',e.last_name) AS 'Manager' FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id ORDER BY employee.id";
    connection.query(query,(err, res) => {
        if (err) throw err
        console.table(res);
        init();
    })
};

// check employees by department
const checkByD = () => {
    inquirer
      .prompt({
        name: 'department',
        type: 'rawlist',
        message: 'Which department do you like to select?',
        choices: [
          'Sales',
          'Finance',
          'Engineering',
          'Legal',
        ]
      }).then((answer) => {
        const query =
            `SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', CONCAT(e.first_name,' ',e.last_name) AS 'Manager' FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id WHERE department.name = '${answer.department}'`;
        connection.query(query,(err, res) => {
        if (err) throw err
        console.table(res);
        init();
      })
    });
};

// check employees by role
const checkByM = () => {
    const query =
        "SELECT DISTINCT CONCAT(e.first_name,' ',e.last_name) AS 'Manager' FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id WHERE CONCAT(e.first_name,' ',e.last_name) IS NOT NULL";
    connection.query(query,(err, res) => {
        if (err) throw err
        var string = JSON.stringify(res).replace(/[{":}]/g,'');
        var convert = string.replace(/Manager/gi,"");
        var convert1 = convert.replace(/[[]/g,"");
        var convert2 = convert1.replace(/]/g,"");
        var convert3 = convert2.replace(/'/g,"");
        var out = convert3.split(',')
        inquirer
            .prompt({
                name: 'manager',
                type: 'rawlist',
                message: 'Which manager do you like to select?',
                choices: out
            }).then((answer) => {
                const query =
                    `SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', CONCAT(e.first_name,' ',e.last_name) AS 'Manager' FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id WHERE CONCAT(e.first_name,' ',e.last_name) = '${answer.manager}'`;
                connection.query(query,(err, res) => {
                    if (err) throw err
                    console.table(res)
                    init();
                })
            })
    })
}

// add an new employee
const add = () => {
    const query =
        "SELECT first_name, last_name FROM employee";
    connection.query(query,(err, res) => {
        if (err) throw err
        var string = JSON.stringify(res).replace(/[{":}]/g,'');
        var convert = string.replace(/,/g," ");
        var convert1 = convert.replace(/first_name/gi,",");
        var convert2 = convert1.replace(/last_name/gi,"");
        var convert3 = convert2.replace(",","");
        var convert4 = convert3.replace(/[[]/g,"");
        var convert5 = convert4.replace(/]/g,"");
        var convert6 = "Null ,"+convert5
        var out = convert6.split(',')
        var roles = [
            'Sales Lead',
            'Salesperson',
            'Lead Engineer',
            'Software Engineer',
            'Accountant',
            'Legal Team Lead',
            'Lawyer'
        ]
    inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "What is the employee's first name "
              },
              {
                name: "lastname",
                type: "input",
                message: "What is the employee's last name "
              },
              {
                name: "role",
                type: "rawlist",
                message: "What is the employee's role? ",
                choices: roles
              },
              {
                name: "manager",
                type: "rawlist",
                message: "Who is the employee's manager?",
                choices: out
              }
        ]).then((answer) => {
            const query =
                "INSERT INTO employee SET ?";
            var managerid = out.indexOf(answer.manager);
            var roleid = roles.indexOf(answer.role) + 1;
            const add_e = 
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                manager_id: managerid,
                role_id: roleid
            }
            connection.query(query,add_e,(err, res) => {
                if (err) throw err
                console.table(res)
                init();
            })
        })
    })
}

// remove an employee
const remove = () => {
    const query =
        "SELECT first_name, last_name FROM employee";
    connection.query(query,(err, res) => {
        if (err) throw err
        var string = JSON.stringify(res).replace(/[{":}]/g,'');
        var convert = string.replace(/,/g," ");
        var convert1 = convert.replace(/first_name/gi,",");
        var convert2 = convert1.replace(/last_name/gi,"");
        var convert3 = convert2.replace(",","");
        var convert4 = convert3.replace(/[[]/g,"");
        var convert5 = convert4.replace(/]/g,"");
        var out = convert5.split(',')
    inquirer
        .prompt([
              {
                name: "employees",
                type: "rawlist",
                message: "Which employee do you want to remove?",
                choices: out
              }
        ]).then((answer) => {
            var name = answer.employees.split(" ")
            const query =
                `DELETE FROM employee WHERE employee.first_name = '${name[0]}' AND employee.last_name = '${name[1]}'`;
            connection.query(query,(err, res) => {
                if (err) throw err
                console.log(res)
                init();
            })
        })
    })
}

// update an employee's role
const updateRole = () => {
    const query =
        "SELECT first_name, last_name FROM employee";
    connection.query(query,(err, res) => {
        if (err) throw err
        var string = JSON.stringify(res).replace(/[{":}]/g,'');
        var convert = string.replace(/,/g," ");
        var convert1 = convert.replace(/first_name/gi,",");
        var convert2 = convert1.replace(/last_name/gi,"");
        var convert3 = convert2.replace(",","");
        var convert4 = convert3.replace(/[[]/g,"");
        var convert5 = convert4.replace(/]/g,"");
        var out = convert5.split(',')
        var roles = [
            'Sales Lead',
            'Salesperson',
            'Lead Engineer',
            'Software Engineer',
            'Accountant',
            'Legal Team Lead',
            'Lawyer'
        ]
    inquirer
        .prompt([
              {
                name: "employeeRole",
                type: "rawlist",
                message: "Which employee do you want to change role?",
                choices: out
              },
              {
                name: "employeerole",
                type: "rawlist",
                message: "What is the employee's role? ",
                choices: roles
              }
        ]).then((answer) => {
            var name = answer.employeeRole.split(" ");
            var roleid = roles.indexOf(answer.employeerole) + 1;
            console.log(roleid)
            const query =
                `UPDATE employee SET role_id = ${roleid} WHERE employee.first_name = '${name[0]}' AND employee.last_name = '${name[1]}'`;
            connection.query(query,(err, res) => {
                if (err) throw err
                console.table(res)
                init();
            })
        })
    })
}

// update an employee's manager
const updateManager = () => {
    const query =
        "SELECT first_name, last_name FROM employee";
    connection.query(query,(err, res) => {
        if (err) throw err
        var string = JSON.stringify(res).replace(/[{":}]/g,'');
        var convert = string.replace(/,/g," ");
        var convert1 = convert.replace(/first_name/gi,",");
        var convert2 = convert1.replace(/last_name/gi,"");
        var convert3 = convert2.replace(",","");
        var convert4 = convert3.replace(/[[]/g,"");
        var convert5 = convert4.replace(/]/g,"");
        var convert6 = "Null ,"+convert5;
        var out = convert5.split(',');
        var out1 = convert6.split(',');
    inquirer
        .prompt([
              {
                name: "employeeRole",
                type: "rawlist",
                message: "Which employee do you want to change manager?",
                choices: out
              },
              {
                name: "employeerole",
                type: "rawlist",
                message: "Who is manager? ",
                choices: out1
              }
        ]).then((answer) => {
            var name = answer.employeeRole.split(" ");
            var managerid = out1.indexOf(answer.employeerole);
            const query =
                `UPDATE employee SET manager_id = ${managerid} WHERE employee.first_name = '${name[0]}' AND employee.last_name = '${name[1]}'`;
            connection.query(query,(err, res) => {
                if (err) throw err
                console.table(res)
                init();
            })
        })
    })
}