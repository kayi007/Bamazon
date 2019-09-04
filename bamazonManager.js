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
    promptManager();
});

function promptManager(){
    inquirer.prompt([
        {
            name: "command",
            type: "list", 
            message: "Welcome! What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer){
        switch(answer.command){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: [chalk.magenta("ID #"), chalk.cyan("Product Name"), chalk.cyan("Department"), chalk.cyan("Price"), chalk.cyan("Stock Quantity")]
        });
        for (var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log(`\n----------------------------------------------------------------------------\n`);
        promptManager();
    });
}

function viewLowInventory(){
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res){
        if (err) throw err; 
        var table = new Table({
            head: [chalk.magenta("ID #"), chalk.red("Product Name"), chalk.red("Stock Quantity")]
        });
        if(res.length > 0){
            console.log(chalk.yellow("\nHere is a list of products that are running low on stock: "));
            for(var i = 0; i < res.length; i++){
                table.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
            }
            console.log(table.toString());
            console.log(`\n------------------------------------------------------\n`);
        }else{
            console.log(chalk.yellow("\nDo Not Have Any Low Inventory."));
            console.log(`\n------------------------------------------------------\n`);
        }
        promptManager();
    });
}

function addToInventory(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        var table = new Table({
            head: [chalk.magenta("ID #"), chalk.cyan("Product Name"), chalk.cyan("Stock Quantity")]
        });
        for (var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
        }
        console.log(table.toString());

        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID # of the product you would like to add to inventory?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "addAmount",
                type: "input",
                message: "How many of this product?",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            // console.log(answer);
            if(parseInt(answer.addAmount) === 0){
                console.log(chalk.red("\nThe amount of item can't be 0.\nPlease re-enter your product ID # and amount that you would like to add\n"));
                addToInventory();
            }else{
                connection.query("SELECT stock_quantity, product_name FROM products WHERE ?", {item_id: answer.id}, function(err, res){
                    if (err) throw err;
                    // console.log(res);
                    var item = res[0];
                    var product = item.product_name;
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: item.stock_quantity + parseInt(answer.addAmount)}, {item_id: answer.id}], function(err, res){
                        if (err) throw err;
                        // console.log(res);
                        console.log(chalk.green("\nSUCCESS! ") + product + "'s stock quantity has increased by " + answer.addAmount + ".\nCurrent product stock quantity is: " + chalk.yellow(item.stock_quantity + parseInt(answer.addAmount)));
                        inquirer.prompt({
                            name: "keepAdding",
                            type: "confirm",
                            message: "Would you like to add more products?"
                        }).then(function(answer){
                            if(answer.keepAdding){
                                addToInventory();
                            }else{
                                promptManager();
                            }
                        });
                    });
                })
            }
        });
    })
}

function addNewProduct(){
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "What is the name of the product you are adding?"
        },
        {
            name: "department",
            type: "input",
            message: "What department does this product belong to?"
        }, 
        {
            name: "price",
            type: "input",
            message: "What is the price of this product?",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add in stock?",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        // console.log(answer);
        console.log(chalk.yellow("\nAdding new product in store......"));
        connection.query(
            "INSERT INTO products SET ?", 
            {
                product_name: answer.product,
                department_name: answer.department,
                price: parseFloat(answer.price),
                stock_quantity: parseInt(answer.quantity)
            },
            function(err, res){
                if (err) throw err;
                console.log(chalk.green("\nSUCCESS! ") + answer.product + " has been added in Bamazon.\n");
                inquirer.prompt({
                    name: "addNew",
                    type: "confirm",
                    message: "Would you likd to add more new products?"
                }).then(function(answer){
                    if(answer.addNew){
                        addNewProduct();
                    }else{
                        promptManager();
                    }
                })
            });
    });
}