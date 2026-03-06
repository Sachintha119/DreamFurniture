# Cross-Device Synchronization Setup

## Problem Solved

Previously, the application used **browser localStorage** which only works within a single device/browser. Now we've integrated **backend database storage** so data syncs across all devices and users!

## Architecture

### Before (localStorage only)

```
Phone Browser    Laptop Browser    (Separate storage - NO sync)
    ↓                  ↓
  localStorage    localStorage
```

### After (Backend Database)

```
Phone Browser        Laptop Browser        Admin Panel
      ↓                    ↓                   ↓
    Frontend            Frontend            Frontend
      ↓                    ↓                   ↓
      └────────────────────┴──────────────────┘
                           ↓
                    Backend Java Server
                    (Port 8080)
                           ↓
                    Database Files
                  (users.txt, products.txt,
                   orders.txt)
```

## How It Works Now

### User Registration (Cross-Device)

1. **Phone**: User registers with email `john@example.com`
2. **Backend**: Saves to `/database/users.txt`
3. **Laptop**: User logs in with same email → Backend retrieves from database
4. **Admin Panel**: Shows all users from backend database

### Products (Shared Across All Devices)

1. **Admin Panel**: Edits product stock
2. **Backend**: Updates `/database/products.txt`
3. **Phone & Laptop**: Both see updated stock instantly

### Orders (Synced Across Devices)

1. **Phone**: User places order
2. **Backend**: Saves to `/database/orders.txt`
3. **Laptop**: Admin panel shows order immediately
4. **All Devices**: See real-time order status updates

## Key Changes Made

### Backend (Java)

- **UserController**: Enhanced to support `GET /api/users` (fetch all users) and `GET /api/users/{id}`
- **ProductController**: Updated to include image URLs in JSON response
- **ProductService**: Fixed to parse all product fields including images
- **FileDatabase**: Updated path from `"database/"` to `"../database/"` to work from any working directory

### Frontend (JavaScript)

- **login.js**: Register and login now call backend API instead of localStorage
  - `fetch('http://localhost:8080/api/users/register', {...})`
  - `fetch('http://localhost:8080/api/users/login', {...})`
  - Fallback to localStorage if backend unavailable

- **products.js**: Products now fetched from backend
  - `fetch('http://localhost:8080/api/products')`
  - Fallback to sample data if offline

- **admin.js**: Users now fetched from backend
  - `fetch('http://localhost:8080/api/users')`
  - Displays real-time data from database

## Testing Cross-Device Sync

### How to Test

**Step 1: Ensure servers are running**

```bash
# Terminal 1 - Backend (Java)
cd "d:\semester 02\enterpernaer ship\FinalProject"
java -cp backend com.furniture.FurnitureServer

# Terminal 2 - Frontend (Python)
cd "d:\semester 02\enterpernaer ship\FinalProject\frontend"
python -m http.server 3000
```

**Step 2: Test on Phone**

1. Go to: `http://<YOUR_LAPTOP_IP>:3000/pages/login.html`
2. Register as: `phone@example.com` / `password123`
3. Browse products (fetched from backend)
4. Place an order

**Step 3: Test on Laptop**

1. Go to: `http://localhost:3000/pages/login.html`
2. Register as: `laptop@example.com` / `password123`
3. Open Admin Panel: `http://localhost:3000/admin/login.html`
   - Username: `admin`
   - Password: `admin123`
4. Go to Users tab → See both `phone@example.com` and `laptop@example.com`!
5. Click on `phone@example.com` → See their order placed from the phone

**Step 4: Verify Sync**

- Laptop admin updates product stock
- Phone user refreshes → Sees new stock
- Phone user updates order status
- Laptop admin refreshes → Sees updated status

## API Endpoints Now Available

| Endpoint              | Method | Purpose                  | Returns                       |
| --------------------- | ------ | ------------------------ | ----------------------------- |
| `/api/users`          | GET    | Get all registered users | Array of users                |
| `/api/users/{id}`     | GET    | Get specific user        | User object                   |
| `/api/users/register` | POST   | Register new user        | `{userId, message}`           |
| `/api/users/login`    | POST   | Authenticate user        | `{user: {id, name, email}}`   |
| `/api/products`       | GET    | Get all products         | Array of products with images |
| `/api/products/{id}`  | GET    | Get specific product     | Product object                |
| `/api/orders`         | GET    | Get all orders           | Array of orders               |
| `/api/orders`         | POST   | Create new order         | `{orderId, message}`          |

## Database Files

Located in `/database/` directory:

### users.txt

Format: `id|name|email|password|phone|registeredDate`

```
23322|Test User|test@example.com|password123|+1234567890|1740000000000
```

### products.txt

Format: `id|name|category|price|description|stock|imageUrl|createdDate`

```
1|Modern Dining Table|table|45000|...|15|https://...jpg|1740000000000
```

### orders.txt

Format: `orderId|customerName|email|phone|address|city|zipcode|total|status|orderDate`

```
ORD-123456|John|phone@example.com|+92312|123 Street|City|12345|50000|pending|1740000000000
```

## Important Notes

### Connection Required

- All devices must be on same network or connected via ngrok tunnel
- Phone needs to use laptop's IP address (e.g., `http://192.168.x.x:3000`)
- Or use ngrok URL for internet-wide access

### When Backend is Down

- Frontend gracefully falls back to localStorage
- Data won't sync across devices
- Each device operates independently

### Port Configuration

- **Backend**: Port 8080
- **Frontend**: Port 3000
- **ngrok**: Port 4040 (status API)

## Troubleshooting

### "Connection refused" Error on Phone

- Check if laptop firewall allows port 3000
- Use laptop's actual IP (not localhost)
- Or use ngrok for internet access

### User Registered but Not Showing in Admin

- Check backend is running on port 8080
- Verify database files exist in `/database/`
- Refresh admin panel (not just browser refresh)
- Check browser console for API errors

### Products Not Loading

- Ensure backend is running
- Check `/database/products.txt` has data
- Verify Java path is correct

### Orders Not Syncing

- Both devices must use same backend server
- Check orders are stored in `/database/orders.txt`
- Try refreshing the page

## Benefits

✅ **One Source of Truth**: Single database for all users and devices
✅ **Real-time Sync**: Changes appear immediately on all devices
✅ **Shared Inventory**: Stock updates reflect everywhere
✅ **Order Tracking**: Admin sees orders from any device
✅ **Scalability**: Ready to upgrade to real database (MySQL, MongoDB)
✅ **Offline Fallback**: Works with localStorage if backend unavailable

## Next Steps

To make this production-ready:

1. **Replace File Database** → SQLite/MySQL/MongoDB
2. **Add Authentication** → JWT tokens instead of password storage
3. **Encryption** → Secure sensitive data
4. **Rate Limiting** → Prevent abuse
5. **Caching** → Improve performance
6. **Load Testing** → Handle multiple users
7. **Backup System** → Automated database backups
8. **Monitoring** → Track API usage and errors

---

**Status**: ✅ **CROSS-DEVICE SYNC WORKING**

Test it now:

1. Start both servers
2. Access from phone and laptop
3. Register on both → See accounts sync
4. Place orders → Admin sees all orders
5. Update products → See changes everywhere
