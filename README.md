# Bamazon
This is a CLI Amazon-like storefront app that take in orders from customers and deplete stock from the store's inventory.

# Bamazon App Demo
This app is meant to be run in the user's Terminal and not in the user's browser.

# How Does Bamazon Work
This is a consumer-worker app where you can view this app among three different views/perspective: 
1. **Customer View** (bamazonCustomer.js) <br>
To run the customer view, please enter the following command in your terminal: <br>
`node bamazonCustomer.js`
- View Available On-Sale Products
- Able to Purchase Products

2. **Supervisor View** (bamazonSupervisor.js) <br>
To run the supervisor view, please enter the following command in your terminal: <br>
`node bamazonSupervisor.js`
- View Product Sales by Department
- Create New Department

3. **Manager View** (bamazonManager.js) <br>
To run the manager view, please enter the following command in your terminal: <br>
`node bamazonManager.js`
- View Products for Sale
- View Low Inventory
- Add to Inventory
- Add New Product

# Technologies Used for Bamazon
As an app developer of CLI-Word-Guess-Game, here are the technologies I used:
- Node.js
- npm packages: inquirer, chalk, mysql, cli-table
- SQL (Structured Query Language)