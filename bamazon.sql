-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;

-- Creates the table "products" within bamazon_db --
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
    ("Echo Dot", "Electronics", 49.99, 68),
    ("Outdoor Security Camera", "Electronics", 88.39, 24),
    ("V-neck Top", "Apparel", 7.64, 120),
    ("Men's Slim Shorts", "Apparel", 15.99, 138),
    ("Makeup Brushes Set", "Beauty", 7.21, 35),
    ("Lifewit Nightstand", "Furniture", 69.99, 98), 
    ("Embody Chair", "Furniture", 1185.75, 8),
    ("John Wick", "Film", 5.99, 89),
    ("A Quiet Place", "Film", 12.99, 10),
    ("Catan", "Board Games", 42.96, 54);
