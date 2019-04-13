DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(30),
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INTEGER(30) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blender", "Kitchen", 29.99, 30), ("TV", "Electronics", 149.99, 50), ("Laptop", "Electronics", 300.00, 80), ("Towel", "Bathroom", 10.00, 100), ("Shower Curtain", "Bathroom", 19.99, 30), 
("Microwave", "Kitchen", 49.99, 40), ("Comforter", "Bedroom", 35.00, 20), ("Night Stand", "Bedroom", 80.00, 15), ("Gym Shorts", "Clothing", 9.99, 100), ("Joggers", "Clothing", 18.99, 40);