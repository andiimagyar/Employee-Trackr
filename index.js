const connection = require('./connection')

const inquirer = require("inquirer");

require("console.table")

const mainPrompt = async () => {
    const { kittens } = await inquirer.prompt({
        type: "list",
        name: "kittens",
        message: "What would you like to do?",
        choices:["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update Employee Role", "Finish"]
    }) 

    switch(kittens) {
        case "Update Employee Role":
            updateEmployee()
            break;

        case "View All Departments":
            viewDepartments()
            break;

        case "View All Roles":
            viewRoles()
            break;

        case "View All Employees":
            viewEmployees()
            break;

        case "Add a Department":
            addDepartment()
            break;

        case "Add a Role":
            addRole()
            break;

        case "Add an Employee":
            addEmployees()
            break;
        
        default: 
        process.exit();
    }
}

mainPrompt();

const updateEmployee = async () => {
    const employees = connection.query("SELECT * FROM employee")
    const roles = connection.query("SELECT * FROM _roles")

    const employeeChoices = employees.map(employee => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    })

    const roleChoices = roles.map(roles => {
        return {
            name: roles.title,
            value: roles.id
        }
    })

    const { employeeChange, newRole } = await inquirer.prompt(
    [
        {
            type: "list",
            name: "employeeChange",
            message: "Please select an employee",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "newRole",
            message: "Please select a new role",
            choices: roleChoices
        }

    ])

    await connection.query("UPDATE employee SET role_id = ? where id = ?", [newRole, employeeChange])
    
    console.log("Success!")
    
    mainPrompt();
}

async function viewEmployees() {

    const employees = await connection.query("SELECT * FROM employee LEFT JOIN _role ON employee.role_id = _role.id");
  
    console.table(employees);
  
    mainPrompt();
  }

  async function viewDepartments() {

    const departments = await connection.query("SELECT * FROM department");
  
    console.table(departments);
  
    mainPrompt();
  }

  async function viewRoles() {

    const roles = await connection.query("SELECT * FROM _role");
  
    console.table(roles);
  
    mainPrompt();
  }