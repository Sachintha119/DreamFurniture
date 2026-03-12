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
- ✅ **Product Management**: CRUD operations with image support
- ✅ **Order Processing**: Order creation, tracking, and cancellation
- ✅ **User Management**: Registration and authentication
- ✅ **Cross-Device Sync**: Real-time data synchronization
- ✅ **Payment Processing**: Payment validation and processing
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **File-Based Database**: Simple text file storage with automatic syncing

### Database

- ✅ **Centralized Storage**: Text-file database with pipe-separated values
- ✅ **Products**: Pre-populated with 10 furniture items (1731 bytes)
- ✅ **Orders**: Auto-populated when orders are placed
- ✅ **Users**: Auto-populated when users register
- ✅ **Cross-Device**: All data syncs across devices automatically

## Getting Started

### Prerequisites

- Java Development Kit (JDK) 8 or higher
- Python 3.x (for running frontend server)
- Any modern web browser
- No external dependencies required (uses Java built-in HTTP server)

### Installation & Compilation

1. **Clone/Extract the project**

   ```bash
   cd "d:\semester 02\enterpernaer ship\FinalProject"
   ```

2. **Compile the Java backend**

   ```bash
   cd backend
   javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java
   ```

3. **Start both servers (see Quick Start above)**

4. **Access the application**
   - Laptop: `http://localhost:3000`
   - Phone: `http://<YOUR_IP>:3000`
   - Admin Panel: `http://localhost:3000/admin/login.html` (credentials: admin/admin123)

## API Endpoints

### Products

- `GET /api/products` - Get all products with images
- `GET /api/products/{id}` - Get specific product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order
- `PUT /api/orders/{id}/cancel` - Cancel order

### Users

- `GET /api/users` - Get all registered users (NEW)
- `GET /api/users/{id}` - Get specific user (NEW)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Payment

- `POST /api/payment` - Process payment

## Cross-Device Synchronization

This application now supports **real-time data synchronization** across multiple devices!

### How It Works

All data is centralized in a backend database (`/database/` folder):

- **Users**: Stored in `users.txt` - accessible from any device
- **Products**: Stored in `products.txt` - shared across all devices
- **Orders**: Stored in `orders.txt` - visible on admin panel from any device

### Using Cross-Device Features

#### Register on Phone, Login on Laptop

```
Phone: Register as john@example.com → Database saves user
Laptop: Login with john@example.com → Backend retrieves from database ✓
```

#### Edit Products on Admin, View on Phone

```
Admin: Edit product stock → Database updates
Phone: Refresh products → Sees new stock immediately ✓
```

#### Place Order on Phone, Track on Admin

```
Phone: Place order → Database saves order
Admin: Refresh dashboard → Sees order from phone ✓
```

## Getting Started (Updated)

### Quick Start (2 Terminal Windows)

**Terminal 1: Backend Server**

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject"
java -cp backend com.furniture.FurnitureServer
```

**Terminal 2: Frontend Server**

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\frontend"
python -m http.server 3000
```

Or use the automated script:

```bash
START_SERVERS.bat
```

For frontend sharing with ngrok, use:

```bash
start-ngrok.bat
```

- `START_SERVERS.bat` starts the Java backend on port `8080` and the Python frontend on port `3000`
- `start_server.bat` starts only the Java backend
- `start-ngrok.bat` starts the frontend server on port `3000` and opens an ngrok tunnel for that frontend port

### Accessing from Multiple Devices

**Laptop (Local)**

- Home: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin/login.html` (admin/admin123)

**Phone (Same Network)**

- Replace `localhost` with your laptop IP (e.g., `192.168.1.10`)
- Home: `http://192.168.1.10:3000`
- Admin Panel: `http://192.168.1.10:3000/admin/login.html`

**Internet Access (With ngrok)**

```bash
start-ngrok.bat
```

- This project's frontend is served on `http://localhost:3000`
- The backend API is served on `http://localhost:8080/api`
- The current frontend JavaScript still calls the backend with `localhost:8080`, so external users will need the frontend API base URL updated to the public backend URL before full remote ordering works over the internet

Share the generated ngrok URL with anyone!

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

## Local Storage & Backend Database

### Backend Database (Primary)

The application now uses a **backend database system** for persistent, cross-device data storage:

- **users.txt**: All registered user accounts (syncs across devices)
- **products.txt**: All furniture products with images (shared across devices)
- **orders.txt**: All orders placed (visible in admin from any device)

### Frontend Local Storage (Cache)

Browser localStorage is used as a fallback cache:

- **cart**: Current shopping cart items (local device only)
- **currentUser**: Logged-in user information (local reference)
- **orders**: User's orders (synced from backend)

### API Communication

- Frontend calls backend API at `http://localhost:8080` for all data
- Backend reads/writes to `/database/` files
- All devices accessing same backend see identical data

## Documentation Files

This project includes comprehensive documentation:

- **QUICK_START.md** - Fast setup guide (5 min read)
- **TESTING_GUIDE.md** - 7 step-by-step tests to verify cross-device sync
- **CROSS_DEVICE_SYNC.md** - Detailed architecture and troubleshooting guide
- **START_SERVERS.bat** - Automated startup script for both servers
- **users**: Registered user accounts

## Future Enhancements

- [ ] Replace text files with real database (MySQL, MongoDB, SQLite)
- [ ] Real payment gateway integration (Stripe, PayPal)
- [ ] Email notifications for order updates
- [ ] JWT-based authentication
- [ ] Product reviews and ratings
- [ ] Wishlists and saved items
- [ ] Multiple payment methods
- [ ] Real-time order tracking with WebSockets
- [ ] Inventory management dashboard
- [ ] Customer service chat
- [ ] Analytics and reporting dashboard
- [ ] Cloud deployment (Heroku, Railway, AWS)
- [ ] Mobile app (React Native/Flutter)

## Troubleshooting

### Server won't start

- Ensure JDK is installed and `java` command is available
- Check if port 8080 is not already in use: `netstat -ano | findstr :8080`
- Try using a different port by modifying `FurnitureServer.java`
- Run from correct directory with proper classpath: `java -cp backend com.furniture.FurnitureServer`

### Frontend not connecting to backend

- Ensure both servers are running (port 3000 and 8080)
- Check browser console (F12) for CORS errors
- Verify Java backend is running: `netstat -ano | findstr :8080`
- Check firewall settings allow port 8080

### Data not syncing across devices

- Verify backend is running on `http://localhost:8080/api/users`
- Check if `/database/` folder exists with .txt files
- Ensure both devices connect to same backend server
- Try refreshing the page
- Check browser console for API errors

### "User not showing in admin" after registration

- ✅ **FIXED** - Now uses backend database instead of localStorage
- Refresh the admin Users page to see latest data
- Verify backend is running and accessible

### Product stock not updating

- Ensure you're refreshing from the same backend (same IP/localhost)
- Check backend is running: `netstat -ano | findstr :8080`
- Stock is stored in `/database/products.txt`

### Phone can't access from laptop IP

- Get laptop IP: Run `ipconfig` in PowerShell
- Use correct IP format: `http://192.168.x.x:3000`
- Check firewall allows inbound on port 3000
- For internet access, use ngrok: `ngrok http 3000`

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
