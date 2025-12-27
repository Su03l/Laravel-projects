# Todo App - Laravel API

This is the backend API for a Todo application, built with Laravel. It provides a RESTful interface for user authentication and for managing todos.

The API uses Laravel Sanctum for cookie-based SPA authentication.

## Environment Setup

To set up the project, copy the `.env.example` file to a new file named `.env` and configure the necessary variables.

```sh
cp .env.example .env
```

### Example `.env` Configuration

Here are the key variables you need to configure for this application to work correctly with a frontend SPA.

```dotenv
APP_NAME="Laravel"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# This should be the URL of your frontend application
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
SESSION_LIFETIME=120

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

---

## API Endpoints

The base URL for all endpoints is `http://127.0.0.1:8000`, or `http://localhost:8000` depending on your environment.

### Authentication

These endpoints handle user registration, login, and session management.

| Method | Endpoint                    | Description                                                 | Authentication |
| :----- | :-------------------------- | :---------------------------------------------------------- | :------------- |
| `GET`  | `/sanctum/csrf-cookie`      | Initializes CSRF protection for the session.                | None           |
| `POST` | `/register`                 | Creates a new user account.                                 | None           |
| `POST` | `/login`                    | Authenticates a user and starts a session.                  | None           |
| `POST` | `/logout`                   | Destroys the authenticated session.                         | Required       |
| `GET`  | `/api/user`                 | Fetches the currently authenticated user's data.            | Required       |

---

### User Profile

These endpoints are for managing the authenticated user's profile.

| Method | Endpoint                | Description                                  | Authentication |
| :----- | :---------------------- | :------------------------------------------- | :------------- |
| `PUT`  | `/api/user/profile`     | Updates the user's profile information.      | Required       |
| `PUT`  | `/api/user/password`    | Updates the user's password.                 | Required       |

#### Update Profile Body

```json
{
  "fname": "Jane",
  "lname": "Doe",
  "username": "janedoe",
  "email": "jane.doe@example.com"
}
```
*(Note: All fields are optional. Send only the ones you want to update.)*

#### Change Password Body

```json
{
  "current_password": "their-old-password",
  "password": "their-new-secure-password",
  "password_confirmation": "their-new-secure-password"
}
```

---

### Todos

These endpoints are for managing todos and require authentication.

| Method   | Endpoint          | Description                                  |
| :------- | :---------------- | :------------------------------------------- |
| `GET`    | `/api/todos`      | Retrieves the list of all todos.             |
| `POST`   | `/api/todos`      | Creates a new todo.                          |
| `PUT`    | `/api/todos/{id}` | Updates an existing todo.                    |
| `DELETE` | `/api/todos/{id}` | Deletes a specific todo.                     |

#### Todo Body

```json
{
  "title": "My New Todo",
  "description": "A detailed description of the task.",
  "is_completed": false
}
```
