-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;

-- Creates the table "products" within bamazon_db for Customer--
CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
    ("Echo Dot", "Electronics", 49.99, 678),
    ("Outdoor Security Camera", "Electronics", 88.39, 244),
    ("V-neck Top", "Apparel", 7.64, 1200),
    ("Men's Slim Shorts", "Apparel", 15.99, 1438),
    ("Makeup Brushes Set", "Beauty", 7.21, 335),
    ("Lifewit Nightstand", "Furniture", 69.99, 986), 
    ("Embody Chair", "Furniture", 1185.75, 548),
    ("John Wick", "Film", 5.99, 879),
    ("A Quiet Place", "Film", 12.99, 1460),
    ("Catan", "Board Games", 42.96, 5496);

-- Creates the table "departments" within bamazon_db for Supervisor --
CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY Key (department_id)
);

INSERT INTO departments(department_name, over_head_costs) 
VALUES 
    ("Electronics", 10000),
    ("Apparel", 12000),
    ("Beauty", 7000),
    ("Furniture", 18000),
    ("Film", 5400),
    ("Board Games", 9000);

ALTER TABLE products
ADD product_sales DECIMAL(10,2) NOT NULL DEFAULT 0;

SELECT * FROM products;
SELECT * FROM departments;
