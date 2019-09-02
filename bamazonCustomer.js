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
    if(err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayInventory();
});

function displayInventory(){
    console.log(chalk.bgMagenta.bold("\n                    Welcome to Bamazon!                    \n"));
    console.log("Products For Sale: \n")
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        // console.log(res);
        var table = new Table({
            head: [chalk.magenta('ID #'), chalk.cyan('Product Name'), chalk.cyan('Category'), chalk.cyan('Price')]
        });
        for(var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`]);
        }
        console.log(table.toString());
        console.log("\n");
        initiating();
        // connection.end();
    });
}

function initiating(){
    inquirer.prompt(
        {
            name: "confirmBuy",
            type: "confirm",
            message: "Would you like to purchase any products?"
        }
    ).then(function(answer){
        if(answer.confirmBuy){
            buying();
        }else{
            console.log(chalk.yellow("\nCome again and Enjoy the rest of your day!\n"));
            process.exit();
            return;
        }
    });
}

function buying(){
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the ID # of the product you would like to buy?",
            validate: function(value){
                if(isNaN(value) === false && parseInt(value) !== 0 && parseInt(value) <= 10){
                    return true;
                }
                return false;
            }
        },
        {
            name: "units",
            type: "input",
            message: "How many of this item?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        // answer is an object form
        // console.log(answer);
        if(parseInt(answer.units) === 0){
            console.log(chalk.red("\nThe amount of item can't be 0.\nPlease re-enter your product ID # and amount that you would like to purchase\n"));
            buying();
        }else{
            console.log(chalk.yellow("\nProcessing your order......\n"));
            placeOrder(answer);
        }
    });
}

function placeOrder(product){
    // console.log(product);
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

    connection.query(query, {item_id: product.id}, function(err,res){
        // res is in an array form
        if (err) throw err;
        // console.log(res);
        var item = res[0];
        // console.log(item);
        // console.log(parseInt(product.units));
        // console.log(item.stock_quantity);
        if(parseInt(product.units) > item.stock_quantity){
            console.log("--------------------------------------------------------");
            console.log(chalk.red("\nInsufficient quantity! Your order has been canceled.\n"));
            reorder();
        }else{
            var totalPrice = product.units * item.price;
            var updatedQty = item.stock_quantity - product.units;
            connection.query("UPDATE products SET ? WHERE ?", 
            [{stock_quantity: updatedQty}, {item_id: product.id}], function(err){
                if (err) throw err;
                // console.log("Updated Inventory!");
            });
            console.log("--------------------------------------------------------");
            console.log(chalk.green("\nSuccess! Your order has been processed!"));
            // console.log(item);
            console.log("The total of your order is: " + chalk.magenta("$" + totalPrice) + "\n");
            reorder();
        }
    });
}

function reorder(){
    inquirer.prompt(
        {
            name: "reorder",
            type: "confirm",
            message: "Would you like to reorder your previous product or place a new order?"
        }
    ).then(function(answer){
        if(answer.reorder){
            displayInventory();
        }else{
            console.log(chalk.yellow("\nCome again and Enjoy the rest of your day!\n"));
            connection.end();
        }
    });
}