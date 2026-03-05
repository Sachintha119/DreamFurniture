# Quick Start Guide for Dream Furniture

## Installation Steps

### 1. Prerequisites

- Java Development Kit (JDK) 8 or higher installed
- Any modern web browser (Chrome, Firefox, Edge, Safari)

### 2. Compile Backend

**Windows (PowerShell or CMD):**

```bash
cd backend
javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java
```

**Linux/Mac:**

```bash
cd backend
javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java
```

### 3. Start Server

**Windows:**

```bash
java -cp backend com.furniture.FurnitureServer
```

**Linux/Mac:**

```bash
java -cp backend com.furniture.FurnitureServer
```

Expected output:

```
========================================
FurniStyle Server is running!
Port: 8080
API Base URL: http://localhost:8080/api
========================================
```

### 4. Open Frontend

Open `frontend/index.html` in your web browser

## Testing the Website

### Test User

- Email: `test@email.com`
- Password: `password123`

### Test Products

Browse the Products page to see the available tables and chairs.

### Test Order Flow

1. Click "Products" → Browse items
2. Click "Add to Cart" on any product
3. Go to "Cart" and adjust quantities
4. Click "Proceed to Checkout"
5. Fill in shipping details (use any test data)
6. Enter test card: `4532123456789010`
7. Click "Place Order"
8. Go to "Orders" to view your order

### Test Payment

Use any of these test card numbers:

- Visa: `4532123456789010`
- Mastercard: `5425233010103442`
- American Express: `374245455400126`

Expiry: Any future date (MM/YY format)
CVV: Any 3 digits

## Important Ports

- Frontend: `http://localhost` (served from file)
- Backend API: `http://localhost:8080`

## Troubleshooting

**Port 8080 already in use:**

- Edit `FurnitureServer.java` and change `PORT = 8080;` to another port (e.g., 8081)
- Recompile and run

**Java not found:**

- Install JDK from https://www.oracle.com/java/
- Add Java to PATH environment variable

**CORS errors in browser:**

- Ensure backend is running on port 8080
- Check browser console for detailed errors
- Clear browser cache and reload

## Project Features Overview

### Shopping Features

✓ Browse products by category
✓ Add/remove items from cart
✓ Quantity management
✓ Real-time cart updates

### Order Management

✓ Place orders with shipping details
✓ View order history
✓ Track order status
✓ Cancel pending orders
✓ Order status updates (pending → processing → shipped → delivered)

### User System

✓ User registration
✓ User login
✓ Session management
✓ User profiles

### Payment System

✓ Card validation
✓ Payment processing
✓ Multiple payment methods
✓ Order confirmation

### Inventory Management

✓ Product catalog with 10 items
✓ Stock management
✓ Category filtering

## Database

All data is stored in text files in the `database/` folder:

- `products.txt` - Pre-populated with 10 furniture items
- `orders.txt` - Auto-populated when orders are placed
- `users.txt` - Auto-populated when users register

## API Documentation

### GET /api/products

Returns all products

### GET /api/products/{id}

Returns specific product

### POST /api/orders

Creates new order

### GET /api/orders/{id}

Gets order details

### PUT /api/orders/{id}/cancel

Cancels order

### POST /api/users/register

Registers new user

### POST /api/users/login

Authenticates user

### POST /api/payment

Processes payment

---

**You're all set! Welcome to Dream Furniture! 🛋️**
