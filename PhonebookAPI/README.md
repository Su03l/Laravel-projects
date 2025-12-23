# Phonebook API

A simple RESTful API for managing phonebook contacts, built with Laravel.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete phonebook contacts.
- **Search**: Search for contacts by phone number.
- **Validation**: Robust validation for input data (e.g., unique phone numbers, required fields).
- **API Resources**: Uses Laravel's API resources for consistent JSON responses.

## Technologies Used

- **Laravel**: The PHP framework used for building the API.
- **SQLite**: The database used for storing contact information.
- **PHP**: The server-side scripting language.

## API Endpoints

### 1. List All Contacts
- **URL**: `/api/phonenumbers`
- **Method**: `GET`
- **Description**: Retrieves a list of all contacts.

### 2. Create a Contact
- **URL**: `/api/phonenumbers`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "name": "John Doe",
        "number": "1234567890",
        "email": "john@example.com",
        "relation": "Friend"
    }
    ```
- **Description**: Adds a new contact to the phonebook.

### 3. Get a Single Contact
- **URL**: `/api/phonenumbers/{id}`
- **Method**: `GET`
- **Description**: Retrieves details of a specific contact by ID.

### 4. Update a Contact
- **URL**: `/api/phonenumbers/{id}`
- **Method**: `PUT` or `PATCH`
- **Body**:
    ```json
    {
        "name": "John Doe Updated",
        "number": "0987654321",
        "email": "john.updated@example.com",
        "relation": "Family"
    }
    ```
- **Description**: Updates an existing contact.

### 5. Delete a Contact
- **URL**: `/api/phonenumbers/{id}`
- **Method**: `DELETE`
- **Description**: Removes a contact from the phonebook.

### 6. Search by Number
- **URL**: `/api/phonenumbers/search/{number}`
- **Method**: `GET`
- **Description**: Searches for a contact by their phone number.

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
