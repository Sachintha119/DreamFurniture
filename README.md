# Dream Furniture - Furniture E-Commerce Website

A full-stack furniture e-commerce platform for selling tables and chairs with order management, payment processing, and tracking systems.

## Project Structure

```
FinalProject/
├── frontend/                    # Bootstrap-based frontend
│   ├── index.html              # Homepage
│   ├── pages/
│   │   ├── products.html       # Products catalog
│   │   ├── cart.html           # Shopping cart
│   │   ├── checkout.html       # Checkout page
│   │   ├── orders.html         # Order management
│   │   └── login.html          # User authentication
│   └── assets/
│       ├── css/
│       │   └── style.css       # Styling
│       └── js/
│           ├── main.js         # Main JavaScript
│           ├── products.js     # Product management
│           ├── cart.js         # Cart functionality
│           ├── checkout.js     # Checkout logic
│           ├── orders.js       # Order management
│           └── login.js        # Authentication
├── backend/                     # Java backend server
│   └── src/
│       └── com/furniture/
│           ├── FurnitureServer.java      # Main server
│           ├── models/                   # Data models
│           │   ├── Product.java
│           │   ├── Order.java
│           │   ├── OrderItem.java
│           │   ├── User.java
│           │   └── Cart.java
│           ├── services/                 # Business logic
│           │   ├── ProductService.java
│           │   ├── OrderService.java
│           │   ├── UserService.java
│           │   └── PaymentService.java
│           ├── controllers/              # API endpoints
│           │   ├── ProductController.java
│           │   ├── OrderController.java
│           │   ├── UserController.java
│           │   ├── PaymentController.java
│           │   └── CORSHandler.java
│           └── utils/
│               └── FileDatabase.java     # File-based database
└── database/                    # Text-based database files
    ├── products.txt            # Product data
    ├── orders.txt              # Order data
    └── users.txt               # User data
```

## Features

### Frontend (HTML/Bootstrap/JavaScript)

- ✅ **Product Catalog**: Browse tables and chairs with filters
- ✅ **Shopping Cart**: Add/remove items, manage quantities
- ✅ **Checkout System**: Customer details and shipping information
- ✅ **Payment Gateway**: Card validation and payment processing
- ✅ **Order Management**: View orders, track status, cancel pending orders
- ✅ **User Authentication**: Login and registration system
- ✅ **Responsive Design**: Mobile-friendly Bootstrap UI

### Backend (Java)

- ✅ **RESTful API**: JSON-based HTTP endpoints
- ✅ **Product Management**: CRUD operations for products
- ✅ **Order Processing**: Order creation, tracking, and cancellation
- ✅ **User Management**: Registration and authentication
- ✅ **Payment Processing**: Payment validation and processing
- ✅ **CORS Support**: Cross-origin requests enabled

### Database

- ✅ **Text-File Database**: Simple file-based storage using pipe-separated values
- ✅ **Products**: Pre-populated with 10 furniture items
- ✅ **Orders**: Auto-populated when orders are placed
- ✅ **Users**: Auto-populated when users register

## Getting Started

### Prerequisites

- Java Development Kit (JDK) 8 or higher
- Any modern web browser
- No external dependencies required (uses Java built-in HTTP server)

### Installation

1. **Clone/Extract the project**

   ```bash
   cd "d:\semester 02\enterpernaer ship\FinalProject"
   ```

2. **Compile the Java backend**

   ```bash
   cd backend
   javac -d . src/com/furniture/*.java src/com/furniture/**/*.java
   ```

3. **Start the server**

   ```bash
   java com.furniture.FurnitureServer
   ```

   The server will start on `http://localhost:8080`

4. **Open the frontend**
   - Open `frontend/index.html` in your web browser
   - Or use a local server to serve the frontend

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get specific product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order
- `PUT /api/orders/{id}/cancel` - Cancel order

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Payment

- `POST /api/payment` - Process payment

## Product Catalog

### Tables

1. Modern Dining Table - Rs 45,000
2. Executive Desk - Rs 68,000
3. Coffee Table - Rs 22,000
4. Conference Table - Rs 90,000
5. Side Table - Rs 13,500

### Chairs

1. Leather Office Chair - Rs 30,000
2. Dining Chair Set - Rs 19,500
3. Lounge Chair - Rs 37,500
4. Gaming Chair - Rs 27,000
5. Executive Manager Chair - Rs 52,500

## Order Workflow

1. **Browse Products**: Visit products page to see available items
2. **Add to Cart**: Click "Add to Cart" on any product
3. **Manage Cart**: View cart, adjust quantities, remove items
4. **Checkout**: Fill shipping and billing information
5. **Payment**: Enter payment details and process
6. **Confirmation**: Order is created with ID and status tracking
7. **Track Order**: View order status (pending → processing → shipped → delivered)
8. **Cancel Order**: Cancel orders while in pending status

## Order Status Flow

- **pending**: Order placed, awaiting payment confirmation
- **processing**: Payment confirmed, preparing for shipment
- **shipped**: Order dispatched from warehouse
- **delivered**: Order received by customer
- **cancelled**: Order cancelled by customer or admin

## Database Files Format

### products.txt

```
id|name|category|price|description|stock|createdDate
```

### orders.txt

```
orderId|customerName|email|phone|address|city|zipcode|total|status|orderDate
```

### users.txt

```
id|name|email|password|phone|registeredDate
```

## Payment Validation

Card validation includes:

- Card number: 16 digits
- Expiry: MM/YY format
- CVV: 3 digits

Sample Test Card: `4532123456789010` (for testing purposes)

## Local Storage (Frontend)

The frontend uses browser's localStorage to manage:

- **cart**: Current shopping cart items
- **currentUser**: Logged-in user information
- **orders**: User's orders
- **users**: Registered user accounts

## Future Enhancements

- [ ] Real payment gateway integration (Stripe, PayPal)
- [ ] Email notifications for order updates
- [ ] Admin dashboard for inventory management
- [ ] Product reviews and ratings
- [ ] Wishlists and saved items
- [ ] Multiple payment methods
- [ ] Real-time order tracking
- [ ] Inventory management system
- [ ] Customer service chat
- [ ] Analytics and reporting

## Troubleshooting

### Server won't start

- Ensure JDK is installed and `java` command is available
- Check if port 8080 is not already in use
- Try using a different port by modifying `FurnitureServer.java`

### Frontend not connecting to backend

- Ensure the server is running on port 8080
- Check browser console for CORS errors
- Verify API endpoints match the server implementation

### Data not persisting

- Check if `database/` folder exists and is writable
- Verify file permissions for database files
- Check console for file I/O errors

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Bootstrap 5
- LocalStorage API

### Backend

- Java 8+
- Java HTTP Server (built-in)
- File I/O
- JSON (manual parsing)

### Database

- Text files (.txt)
- Pipe-separated values (|)
- No SQL required

## License

This project is for educational purposes.

## Support

For issues or questions, check the source code comments and error logs in the browser console or server terminal.

---

**Dream Furniture** - Premium Furniture for Your Home 🪑
