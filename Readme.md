# User Personal Todo Management API

This API provides user registration, authentication, and personal todo management functionalities. Each user's todos are stored in their dedicated personal databases. Users can sign up, sign in, create todos, and fetch their todos from their personal databases.

## Installation

1. Clone the repository and install dependencies:

2. Create a `.env` file with:
   JWT_SECRET=your_jwt_secret

## Usage

1. Start the server:

2. Access the API at `http://localhost:3000`.

## API Endpoints

### Signup

- **POST** `/signup`: Create a new user and their personal database.

### Signin

- **POST** `/signin`: Authenticate user and connect to their personal database.

### Create Todo

- **POST** `/dashboard/create-todo`: Create a new todo in the user's personal database.

### Fetch Todos

- **GET** `/dashboard/todos`: Fetch todos from the user's personal database.

### Authentication

- Include JWT token as Bearer Token in `Authorization` header.

### Error Handling

- API responds with appropriate error messages and status codes.

## Personal Databases

- Each user's personal todos are stored in their dedicated databases.
- User's personal database is created on signup and connected on signin.

## Dependencies

- Express.js
- Sequelize
- Bcrypt
- JSON Web Token (JWT)

## Note

- Basic user authentication and personal todo management using Express and Sequelize.
- User-specific databases are created and connected for personal todo storage.
- Implement security measures in production.
