# University System API

A simple RESTful API for managing university operations including students and courses, built with Laravel.

## Features

-   **CRUD Operations**: Create, Read, Update, and Delete students and courses.
-   **Course Management**: Manage university courses with full CRUD capabilities.
-   **Student Management**: Manage student records with course enrollment.
-   **Course Registration**: Register students for courses and manage enrollments.
-   **Validation**: Robust validation for input data (e.g., required fields, data integrity).
-   **API Resources**: Uses Laravel's API resources for consistent JSON responses.

## Technologies Used

-   **Laravel**: The PHP framework used for building the API.
-   **SQLite**: The database used for storing university information.
-   **PHP**: The server-side scripting language.

## API Endpoints

### Students

#### 1. List All Students

-   **URL**: `/api/students`
-   **Method**: `GET`
-   **Description**: Retrieves a list of all students.

#### 2. Create a Student

-   **URL**: `/api/students`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "Jane Smith",
        "email": "jane@university.edu",
        "student_id": "STU123456",
        "major": "Computer Science"
    }
    ```
-   **Description**: Adds a new student to the system.

#### 3. Get a Single Student

-   **URL**: `/api/students/{id}`
-   **Method**: `GET`
-   **Description**: Retrieves details of a specific student by ID.

#### 4. Update a Student

-   **URL**: `/api/students/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Jane Smith Updated",
        "email": "jane.updated@university.edu",
        "student_id": "STU123456",
        "major": "Software Engineering"
    }
    ```
-   **Description**: Updates an existing student.

#### 5. Delete a Student

-   **URL**: `/api/students/{id}`
-   **Method**: `DELETE`
-   **Description**: Removes a student from the system.

#### 6. Register Student for Course

-   **URL**: `/api/students/{student}/courses`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "course_id": 1
    }
    ```
-   **Description**: Registers a student for a specific course.

#### 7. Cancel Course Registration

-   **URL**: `/api/students/{student}/courses`
-   **Method**: `DELETE`
-   **Body**:
    ```json
    {
        "course_id": 1
    }
    ```
-   **Description**: Cancels a student's course registration.

### Courses

#### 1. List All Courses

-   **URL**: `/api/courses`
-   **Method**: `GET`
-   **Description**: Retrieves a list of all courses.

#### 2. Create a Course

-   **URL**: `/api/courses`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
        "name": "Introduction to Programming",
        "code": "CS101",
        "credits": 3,
        "description": "Basic programming concepts"
    }
    ```
-   **Description**: Adds a new course to the system.

#### 3. Get a Single Course

-   **URL**: `/api/courses/{id}`
-   **Method**: `GET`
-   **Description**: Retrieves details of a specific course by ID.

#### 4. Update a Course

-   **URL**: `/api/courses/{id}`
-   **Method**: `PUT` or `PATCH`
-   **Body**:
    ```json
    {
        "name": "Advanced Programming",
        "code": "CS102",
        "credits": 4,
        "description": "Advanced programming concepts"
    }
    ```
-   **Description**: Updates an existing course.

#### 5. Delete a Course

-   **URL**: `/api/courses/{id}`
-   **Method**: `DELETE`
-   **Description**: Removes a course from the system.

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
