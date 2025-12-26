# Mini Store API

A RESTful API for a simple e-commerce system managing products and orders, built with Laravel. It features advanced Many-to-Many relationships and automated inventory management.

## Features

-   **Product Management:** Full CRUD operations for store products with stock tracking.
-   **Order Processing:** Create orders with multiple products and specific quantities.
-   **Inventory Management:**
    -   Automatically **deducts stock** when an order is placed.
    -   Automatically **restores stock** when an order is deleted.
    -   Prevents orders if stock is insufficient.
-   **Automated Logic:** Auto-generation of unique Order Numbers.
-   **Validation:** Strict validation for inputs and stock availability.
-   **Database Transactions:** Ensures data integrity during order creation and cancellation.

## Technologies Used

-   **Laravel:** The PHP framework used for building the API.
-   **SQLite:** The database used for development.
-   **PHP:** The server-side scripting language.

## API Endpoints

### Products

#### 1. List All Products

-   **URL:** `/api/products`
-   **Method:** `GET`
-   **Description:** Retrieves a list of all products in the store.

#### 2. Create a Product

-   **URL:** `/api/products`
-   **Method:** `POST`
-   **Body:**
    ```json
    {
        "name": "Gaming Laptop",
        "price": 4500.5,
        "stock": 10
    }
    ```
-   **Description:** Adds a new product to the inventory.

#### 3. Get a Single Product

-   **URL:** `/api/products/{id}`
-   **Method:** `GET`
-   **Description:** Retrieves details of a specific product.

#### 4. Update a Product

-   **URL:** `/api/products/{id}`
-   **Method:** `PUT` or `PATCH`
-   **Body:**
    ```json
    {
        "price": 4200.0,
        "stock": 15
    }
    ```
-   **Description:** Updates product details (e.g., restocking or price change).

#### 5. Delete a Product

-   **URL:** `/api/products/{id}`
-   **Method:** `DELETE`
-   **Description:** Removes a product from the system.

---

### Orders

#### 1. List All Orders

-   **URL:** `/api/orders`
-   **Method:** `GET`
-   **Description:** Retrieves a list of all orders with their associated products and quantities.

#### 2. Create an Order (Checkout)

-   **URL:** `/api/orders`
-   **Method:** `POST`
-   **Body:**
    ```json
    {
        "customer_name": "Suliman Yousef",
        "products": [
            {
                "product_id": 1,
                "quantity": 2
            },
            {
                "product_id": 2,
                "quantity": 1
            }
        ]
    }
    ```
-   **Description:** Creates a new order. It automatically checks stock availability, deducts the quantity from products, and generates a unique Order Number.

#### 3. Get a Single Order

-   **URL:** `/api/orders/{id}`
-   **Method:** `GET`
-   **Description:** Retrieves details of a specific order including products ordered.

#### 4. Update an Order

-   **URL:** `/api/orders/{id}`
-   **Method:** `PUT` or `PATCH`
-   **Description:** Updates order details or syncs product list.

#### 5. Delete an Order (Cancel)

-   **URL:** `/api/orders/{id}`
-   **Method:** `DELETE`
-   **Description:** Cancels the order and automatically restores the ordered quantities back to the product stock.

---

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
   Copy `.env.example` to `.env` and configure your database settings:

    ```bash
    cp .env.example .env
    ```

4. **Generate Application Key:**

    ```bash
    php artisan key:generate
    ```

5. **Run Migrations & Seeders:**
   (Optional: Use `--seed` to populate dummy data)

    ```bash
    php artisan migrate --seed
    ```

6. **Serve the Application:**
    ```bash
    php artisan serve
    ```

---

## License

This project is open-sourced software licensed under the MIT license.
