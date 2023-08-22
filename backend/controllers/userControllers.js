// userController.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

router.post("/signup", async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the Primary Database
    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Sanitize the user's name to create a valid database name
    const sanitizedDatabaseName = name.replace(/\s+/g, "_"); // Replace spaces with underscores

    // Create a separate database (sanitizedDatabaseName_db) for the user
    await sequelize.query(`CREATE DATABASE ${sanitizedDatabaseName}_db;`);

    // Connect to the user's database
    const userDb = new Sequelize(name + "_db", "root", "", {
      host: "localhost",
      dialect: "mysql",
    });

    // Respond with the user object (optional)
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
});

// Route for user sign-in
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({
      where: { email },
    });

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // If the password is valid, generate a JWT token
    const token = jwt.sign(
      {
        userId: user.email,
        userDb: user.userDatabaseName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // You can adjust the expiration time as needed
      }
    );

    // Set the JWT token as an HttpOnly cookie in the response
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // Token expires in 1 hour (in milliseconds)
    });

    // Disconnect from the primary database (user_primary_db)
    // await sequelize.close();

    // Connect to the user's specific database
    const userDb = new Sequelize(user.userDatabaseName, "root", "", {
      host: "localhost",
      dialect: "mysql",
    });

    // Define the Todo model with the user's database connection
    const Todo = userDb.define("Todo", {
      // Define the same properties as in the 'todo.js' model
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });

    // Check if the "todos" table already exists in the user's database
    const todosTableExists = await userDb.query(`SHOW TABLES LIKE 'Todos';`, {
      type: QueryTypes.SELECT,
      logging: false, // Set logging to false to suppress console output
    });

    // If the "todos" table does not exist, then sync it
    if (todosTableExists.length === 0) {
      await Todo.sync();
    }

    // Respond with the token
    res.json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Failed to sign in." });
  }
});

// Route for creating a todo
router.post("/dashboard/create-todo", authenticateJWT, async (req, res) => {
  const { title, description } = req.body;

  try {
    const userDb = req.user.userDb;
    const connectUserDb = new Sequelize(userDb, "root", "", {
      host: "localhost",
      dialect: "mysql",
    });

    const Todo = connectUserDb.define("Todo", {
      // Define the same properties as in the 'todo.js' model
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });

    // Create the todo in the user's database (userDatabaseName + "_db")
    const todo = await Todo.create({
      title,
      description,
    });

    // Respond with the created todo
    res.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo." });
  }
});

// Route for fetching all todos
router.get("/dashboard/todos", authenticateJWT, async (req, res) => {
  try {
    const userDb = req.user.userDb;
    const connectUserDb = new Sequelize(userDb, "root", "", {
      host: "localhost",
      dialect: "mysql",
    });

    // Set up the Todo model for the user's database (userDatabaseName + "_db")
    const Todo = connectUserDb.define("Todo", {
      // Define the same properties as in the 'todo.js' model
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });

    // Fetch all the todos from the user's database (userDatabaseName + "_db")
    const todos = await Todo.findAll();

    // Respond with the fetched todos
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos." });
  }
});

// // Route for fetching all users (requires authentication with JWT)
// router.get("/getallusers", authenticateJWT, async (req, res) => {
//   try {
//     // Fetch all users from the database (excluding their passwords)
//     const users = await User.findAll({
//       attributes: { exclude: ["password"] }, // Exclude the 'password' column
//     });

//     // Respond with the list of users
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Failed to fetch users." });
//   }
// });

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token." });
  }

  const authToken = token.split(" ")[1]; // Extract the token without the "Bearer " prefix

  jwt.verify(authToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(403).json({ error: "Forbidden: Invalid token." });
    }

    req.user = decodedToken;
    next();
  });
}

module.exports = router;

//===============================================================================================================
