# Car Rental System API

A robust RESTful API for managing a car rental business, built with Laravel. It features automated cost calculation, strict state management for vehicles, and transactional data integrity.

## Key Features

-   **Fleet Management:** Full CRUD for cars with status tracking (`available`, `rented`, `maintenance`).
-   **Customer Management:** Manage customer profiles with unique identification checks.
-   **Rental Logic:**
    -   **Automated Billing:** Automatically calculates total cost based on rental duration and daily rate.
    -   **State Management:** Automatically switches car status to `rented` upon booking and back to `available` upon return.
    -   **Conflict Prevention:** Prevents booking of currently rented or unavailable vehicles.
-   **Database Transactions:** Ensures data consistency across all rental operations (renting, returning, canceling).

## Technologies Used

-   **Laravel:** Core PHP framework.
-   **SQLite:** Database (Development).
-   **Carbon:** Date manipulation and duration calculation.

## API Endpoints

### Cars

1. **List All Cars**
    - `GET /api/cars`
2. **Add New Car**
    - `POST /api/cars`
    - **Body:**
        ```json
        {
            "name": "Toyota Camry",
            "model_year": "2024",
            "license_plate": "KSA-2030",
            "daily_price": 250.0
        }
        ```
3. **Update Car**
    - `PUT /api/cars/{id}`
4. **Delete Car**
    - `DELETE /api/cars/{id}`
    - _Note: Cannot delete a car if it is currently rented._

### Customers

1. **List All Customers**
    - `GET /api/customers`
2. **Register Customer**
    - `POST /api/customers`
    - **Body:**
        ```json
        {
            "name": "Suliman Yousef",
            "national_id": "1001001001",
            "phone": "0555555555"
        }
        ```

### Rentals (The Core Logic)

#### 1. Create Rental Contract (Rent a Car)

Creates a new contract, calculates the total cost, and **locks** the car (sets status to `rented`).

-   **URL:** `/api/rentals`
-   **Method:** `POST`
-   **Body:**
    ```json
    {
        "car_id": 1,
        "customer_id": 1,
        "start_date": "2025-12-30",
        "end_date": "2026-01-05"
    }
    ```
-   **Response:**
    ```json
    {
        "message": "Rental created successfully",
        "total_cost": 1500.0,
        "status": "active"
    }
    ```

#### 2. Return Car (Close Contract)

Marks the contract as completed and unlocks the car (sets status back to `available`).

-   **URL:** `/api/rentals/{id}/return`
-   **Method:** `POST`

#### 3. Cancel Contract (Delete)

Deletes the contract and restores the car status to `available` if the contract was active.

-   **URL:** `/api/rentals/{id}`
-   **Method:** `DELETE`

#### 4. Update Contract

Updates dates and re-calculates the total cost automatically.

-   **URL:** `/api/rentals/{id}`
-   **Method:** `PUT`

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Install dependencies:**

    ```bash
    composer install
    ```

3. **Configure Environment:**

    ```bash
    cp .env.example .env
    # Configure your database in .env
    ```

4. **Generate Key:**

    ```bash
    php artisan key:generate
    ```

5. **Run Migrations & Seeders:** (This will create dummy cars and customers)

    ```bash
    php artisan migrate --seed
    ```

6. **Serve:**
    ```bash
    php artisan serve
    ```

## License

This project is open-sourced software licensed under the MIT license.
