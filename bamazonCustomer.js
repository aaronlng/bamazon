var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    //show connected
    //console.log("connected as id " + connection.threadId);
    queryAllProducts();
});

//function to display all products
function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + "\n$" + res[i].price);
            console.log("-----------------------------------");
        }
        promptCustomer(res);
    });
}

var purchasePrompt = {
    type: "input",
    message: "Type in the ID of the product you would like to purchase:",
    name: "item_id"
};

var quantityPrompt = {
    type: "input",
    message: "How many units of the product would you like to purchase?",
    name: "quantity"
};

var restartPrompt = {
    type: "list",
    message: "Would you like to shop again?",
    choices: ["Yes", "No"],
    name: "restart"
};

//Create a function to prompt the customer after products load
function promptCustomer(res) {
    inquirer.prompt([purchasePrompt]).then(function (inquirerResponse) {
        // turn user answer into integer and store as variable
        //console.log(res.item_id);
        var chosenProductID = parseInt(inquirerResponse.item_id);
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === chosenProductID) {
                // stores the i number of this loop into a variable so that it can be called in the next inquirer prompt
                var id = i;
                // prompt how many they would like to buy
                inquirer.prompt([quantityPrompt]).then(function (inquirerResponse) {
                    // turn user answer into integer and store as variable
                    var chosenQuantity = parseInt(inquirerResponse.quantity);
                    // if that number is less than or equal to the current inventory number for that product
                    if ((res[id].stock_quantity - chosenQuantity) >= 0) {
                        // subtract the inputted number from the product's stock_quantity and set as variable
                        var newQuantity = res[id].stock_quantity - chosenQuantity;
                        //total cost
                        var totalCost = res[id].price * chosenQuantity;
                        // update value in database with newQuantity
                        var sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
                        var values = ['products', 'stock_quantity', newQuantity, 'item_id', chosenProductID];
                        connection.query(sql, values, function (err, res) {
                            if (err) {
                                console.log(err);
                                connection.end();
                            }
                            // alert the user the total cost of the transaction (price * inputted quantity) and that they have bought the product
                            console.log("Product(s) bought!" + "\n" + "Total Cost of Transaction: $" + totalCost);
                            // ask user if they want to restart the process
                            inquirer.prompt(restartPrompt).then(function (res) {
                                if (res.restart === "Yes") {
                                    queryAllProducts();
                                } else {
                                    console.log("Thank You!");
                                    connection.end();
                                }
                            });
                        });
                    }
                    // if the number is greater than the product's stock_quantity amount, alert the user & restart the promptCustomer function
                    else {
                        console.log("Insufficient Quantity! Please enter a number less than or equal to the selected item's available quantity.");
                        promptCustomer(res);
                    }
                });
            }
        }
    });
};
