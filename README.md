# User Role Management API

## Overview

This is a RESTful API built with Node.js, Express, and MongoDB (using Mongoose) for managing users and roles in a system. The API supports user authentication using JWT and enforces role-based access control.

## Features

- User authentication with JWT
- Role-based access control
- CRUD operations for users and roles
- Secure password hashing
- Input validations
- Centralized error handling


## Prerequisites

- Node.js (>=14.x)
- MongoDB (local or Atlas)
- npm (Node package manager)

## Setup
    ```

1. **Configure environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```plaintext
    JWT_SECRET=your_jwt_secret
    ```



## API Endpoints

### Authentication

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "emailId": "user@example.com",
        "password": "yourpassword"
    }
    ```
- **Response**:
    ```json
    {
        "token": "jwt_token"
    }
    ```

### Users

#### Get all users
- **URL**: `/api/users`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    [
        {
            "_id": "user_id",
            "emailId": "user@example.com",
            "status": "Active",
            "firstName": "John",
            "mobile": "1234567890",
            "employeeId": "EMP001",
            "role": {
                "_id": "role_id",
                "name": "Admin",
                "accessLevels": {}
            }
        }
    ]
    ```

#### Get a user by ID
- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    {
        "_id": "user_id",
        "emailId": "user@example.com",
        "status": "Active",
        "firstName": "John",
        "mobile": "1234567890",
        "employeeId": "EMP001",
        "role": {
            "_id": "role_id",
            "name": "Admin",
            "accessLevels": {}
        }
    }
    ```

#### Create a new user
- **URL**: `/api/users`
- **Method**: `POST`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Body**:
    ```json
    {
        "emailId": "newuser@example.com",
        "status": "Active",
        "firstName": "Jane",
        "mobile": "0987654321",
        "employeeId": "EMP002",
        "role": "role_id",
        "password": "newuserpassword"
    }
    ```
- **Response**:
    ```json
    {
        "_id": "user_id",
        "emailId": "newuser@example.com",
        "status": "Active",
        "firstName": "Jane",
        "mobile": "0987654321",
        "employeeId": "EMP002",
        "role": "role_id"
    }
    ```

#### Update a user
- **URL**: `/api/users/:id`
- **Method**: `PATCH`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Body** (any fields you want to update):
    ```json
    {
        "status": "Inactive"
    }
    ```
- **Response**:
    ```json
    {
        "_id": "user_id",
        "emailId": "user@example.com",
        "status": "Inactive",
        "firstName": "John",
        "mobile": "1234567890",
        "employeeId": "EMP001",
        "role": "role_id"
    }
    ```

#### Delete a user
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    {
        "message": "Deleted user"
    }
    ```

### Roles

#### Get all roles
- **URL**: `/api/roles`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    [
        {
            "_id": "role_id",
            "name": "Admin",
            "accessLevels": {}
        }
    ]
    ```

#### Get a role by ID
- **URL**: `/api/roles/:id`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    {
        "_id": "role_id",
        "name": "Admin",
        "accessLevels": {}
    }
    ```

#### Create a new role (Admin only)
- **URL**: `/api/roles`
- **Method**: `POST`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Body**:
    ```json
    {
        "name": "CustomRole",
        "accessLevels": {
            "page1": { "read": true, "write": false },
            "page2": { "read": true, "write": true }
        }
    }
    ```
- **Response**:
    ```json
    {
        "_id": "role_id",
        "name": "CustomRole",
        "accessLevels": {
            "page1": { "read": true, "write": false },
            "page2": { "read": true, "write": true }
        }
    }
    ```

#### Update a role (Admin only)
- **URL**: `/api/roles/:id`
- **Method**: `PATCH`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Body** (any fields you want to update):
    ```json
    {
        "accessLevels": {
            "page1": { "read": true, "write": true }
        }
    }
    ```
- **Response**:
    ```json
    {
        "_id": "role_id",
        "name": "CustomRole",
        "accessLevels": {
            "page1": { "read": true, "write": true },
            "page2": { "read": true, "write": true }
        }
    }
    ```

#### Delete a role (Admin only)
- **URL**: `/api/roles/:id`
- **Method**: `DELETE`
- **Headers**:
    - `Authorization`: `Bearer <jwt_token>`
- **Response**:
    ```json
    {
        "message": "Deleted role"
    }
    ```

## Middleware

### Authentication Middleware

- **File**: `middleware/auth.js`
- **Purpose**: Verifies JWT token and checks user roles for protected routes.

### Error Handling Middleware

- **File**: `middleware/errorHandler.js`
- **Purpose**: Centralizes error handling for the application.

## Models

### User Model

- **File**: `models/user.js`
- **Fields**:
    - `emailId`: String (required, unique)
    - `status`: String (enum: ['Active', 'Inactive'], default: 'Active')
    - `firstName`: String (required)
    - `mobile`: String (required, valid mobile number)
    - `employeeId`: String (required, unique)
    - `role`: ObjectId (reference to Role model)
    - `password`: String (required, hashed)

### Role Model

- **File**: `models/role.js`
- **Fields**:
    - `name`: String (required, unique)
    - `accessLevels`: Map (read and write access for different pages)

## Configuration

### Database Configuration

- **File**: `config/db.js`
- **Purpose**: Connects to MongoDB using Mongoose.

## Running the Application

1. **Start the server**:
    ```bash
    node app.js
    ```

2. **Testing**:
    - Use Postman or any other API testing tool to test the routes.
    - Make sure to use the JWT token generated from the login route to authenticate protected routes.

## License

This project is licensed under the MIT License.
#   A S S S I G N M E N T _ S U B M I S S I O N  
 