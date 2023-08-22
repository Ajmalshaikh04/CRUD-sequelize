# User Todo Management API

This API provides user registration, authentication, and todo management functionalities. Users can sign up, sign in, create todos, and fetch todos from their personal databases.

## Installation

1. Clone the repository and install dependencies:

git clone <repository-url>
npm install

2. Create a `.env` file with:

JWT_SECRET=your_jwt_secret

## Usage

1. Start the server:

npm start

2. Access the API at `http://localhost:3000`.

## API Endpoints

### Signup

- **POST** `/signup`: Create a new user and database.

### Signin

- **POST** `/signin`: Authenticate user and get JWT token.

### Create Todo

- **POST** `/dashboard/create-todo`: Create a new todo.

### Fetch Todos

- **GET** `/dashboard/todos`: Fetch todos for the user.

### Authentication

- Include JWT token as Bearer Token in `Authorization` header.

### Error Handling

- API responds with appropriate error messages and status codes.

## Dependencies

- Express.js
- Sequelize
- Bcrypt
- JSON Web Token (JWT)

## Note

- Basic user authentication and todo management using Express and Sequelize.
- Implement security measures in production.
