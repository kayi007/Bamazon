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

function viewProducts(){
    connection.query(
        "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales, (SUM(product_sales) - over_head_costs) AS total_profit FROM departments AS d INNER JOIN products AS p ON d.department_name = p.department_name GROUP BY department_name ORDER BY department_id;", 
        function(err,res){
            if (err) throw err;
            console.log(chalk.yellow("\n Department Product Sales and Total Revenue\n"));
            // console.log(res);
            var table = new Table({
                head: [chalk.cyan("department_id"), chalk.cyan("department_name"), chalk.cyan("over_head_costs"), chalk.magenta('product_sales'), chalk.magenta('total_profit')]
            });
            for(var i = 0; i < res.length; i++){
                if(res[i].product_sales === null){
                    res[i].product_sales = 0;
                }
                table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
            }
            console.log(table.toString());
            console.log("\n");
            promptSupervisor();
        });
}

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
                console.log(chalk.green("\nSUCCESS! ") + "A new department " + chalk.green(answer.department) + " has been added in Bamazon!\n");
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