var mysql = require('mysql');
var inquirer = require('inquirer');
var chalk = require('chalk');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
    promptSupervisor();
});

function promptSupervisor(){
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "Welcome! What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(answer){
        switch(answer.command){
            case "View Product Sales by Department":
                viewProducts();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

// function viewProducts(){

// }

function createDepartment(){
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the name of the new department that you plan to add?"
        },
        {
            name: "overhead",
            type: "input",
            message: "What is the over head costs for this new department?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        console.log(chalk.yellow("\nAdding a new department in store......"));
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answer.department,
                over_head_costs: answer.overhead
            },
            function(err, res){
                if (err) throw err;
                console.log(chalk.green("\nSUCCESS! " + "A new department " + chalk.green(answer.department) + " has been added in Bamazon!\n"));
                inquirer.prompt([
                    {
                        name: "addMore",
                        type: "confirm",
                        message: "Would you like to add more departments?"
                    }
                ]).then(function(answer){
                    if(answer.addMore){
                        createDepartment();
                    }else{
                        promptSupervisor();
                    }
                });
            });
    });
}