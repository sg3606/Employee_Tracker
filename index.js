const mysql = require("mysql");
const inquirer = require("inquirer");
const consoletable = require('console.table');

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

const checkAll = () => {
    const query =
        "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', CONCAT(e.first_name,' ',e.last_name) AS 'Manager' FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id ORDER BY employee.id";
    connection.query(query,(err, res) => {
        if (err) throw err
        console.table(res);
        init();
    })
};

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
        var departments = [
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
                choices: departments
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
            var roleid = departments.indexOf(answer.role);
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
        console.log(out)
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



