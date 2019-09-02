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
    console.log("\nWelcome to Bamazon!\n");
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}