# HR System API

A simple RESTful API for managing HR operations including employees and departments, built with Laravel.

## Features

-   **CRUD Operations**: Create, Read, Update, and Delete employees and departments.
-   **Department Management**: Manage organizational departments with full CRUD capabilities.
-   **Employee Management**: Manage employee records with department associations.
-   **Validation**: Robust validation for input data (e.g., required fields, data integrity).
-   **API Resources**: Uses Laravel's API resources for consistent JSON responses.

## Technologies Used

-   **Laravel**: The PHP framework used for building the API.
-   **SQLite**: The database used for storing HR information.
-   **PHP**: The server-side scripting language.

## API Endpoints

### Departments

#### 1. List All Departments

-   **URL**: `/api/departments`
-   **Method**: `GET`
-   **Description**: Retrieves a list of all departments.

#### 2. Create a Department

-   **URL**: `/api/departments`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "IT Department",
        "description": "Information Technology"
    }
    ```
-   **Description**: Adds a new department to the system.

#### 3. Get a Single Department

-   **URL**: `/api/departments/{id}`
-   **Method**: `GET`
-   **Description**: Retrieves details of a specific department by ID.

#### 4. Update a Department

-   **URL**: `/api/departments/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Updated IT Department",
        "description": "Updated Description"
    }
    ```
-   **Description**: Updates an existing department.

#### 5. Delete a Department

-   **URL**: `/api/departments/{id}`
-   **Method**: `DELETE`
-   **Description**: Removes a department from the system.

### Employees

#### 1. List All Employees

-   **URL**: `/api/employees`
-   **Method**: `GET`
-   **Description**: Retrieves a list of all employees.

#### 2. Create an Employee

-   **URL**: `/api/employees`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "position": "Software Engineer",
        "department_id": 1
    }
    ```
-   **Description**: Adds a new employee to the system.

#### 3. Get a Single Employee

-   **URL**: `/api/employees/{id}`
-   **Method**: `GET`
-   **Description**: Retrieves details of a specific employee by ID.

#### 4. Update an Employee

-   **URL**: `/api/employees/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "John Doe Updated",
        "email": "john.updated@example.com",
        "position": "Senior Software Engineer",
        "department_id": 2
    }
    ```
-   **Description**: Updates an existing employee.

#### 5. Delete an Employee

-   **URL**: `/api/employees/{id}`
-   **Method**: `DELETE`
-   **Description**: Removes an employee from the system.

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Install dependencies:
    ```bash
    composer install
    ```
3. Copy `.env.example` to `.env` and configure your database settings:
    ```bash
    cp .env.example .env
    ```
4. Generate the application key:
    ```bash
    php artisan key:generate
    ```
5. Run migrations:
    ```bash
    php artisan migrate
    ```
6. Serve the application:
    ```bash
    php artisan serve
    ```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
