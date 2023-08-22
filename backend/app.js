const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db"); // Import the sequelize instance
const User = require("./models/user");
const cors = require("cors");
// const Todo = require("./models/todo");

const corsOptions = {
  origin: "*",
};

const cookieParser = require("cookie-parser");

// Import the user controller
const userController = require("./controllers/userControllers");

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use cookie-parser middleware
app.use(cookieParser());
//Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database and table created!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Use the user controller
app.use(userController);

// Start the server
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
