# Quick Start Guide - Cross-Device Sync Fixed!

## The Problem You Had

❌ Phone and laptop weren't syncing data - each had separate localStorage

## The Solution Implemented

✅ Backend database now centralizes all data - all devices access the same data!

## Quick Setup (2 Steps)

### Step 1: Start Servers (2 Terminal Windows)

**Terminal 1 - Backend (Java)**

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject"
java -cp backend com.furniture.FurnitureServer
```

**Terminal 2 - Frontend (Python)**

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\frontend"
python -m http.server 3000
```

Or use the batch script:

```bash
START_SERVERS.bat
```

### Step 2: Access from Devices

**Laptop:**

- Home: `http://localhost:3000`
- Products: `http://localhost:3000/pages/products.html`
- Admin: `http://localhost:3000/admin/login.html` (admin/admin123)

**Phone (Same Network):**

- Find your laptop IP: In PowerShell run `ipconfig` and look for IPv4 Address
- Home: `http://192.168.x.x:3000` (replace with actual IP)
- Same pages work from phone!

## How Cross-Device Sync Works Now

| Action         | Device 1           | Backend                           | Device 2                           |
| -------------- | ------------------ | --------------------------------- | ---------------------------------- |
| Register User  | Phone registers    | Saves to `/database/users.txt`    | Laptop can login with same account |
| Update Product | Admin edits stock  | Saves to `/database/products.txt` | Phone sees new stock instantly     |
| Place Order    | Phone places order | Saves to `/database/orders.txt`   | Admin sees order immediately       |

## Test It Right Now

### Test 1: User Registration Sync

1. **Phone**: Register as `alice@example.com`
2. **Laptop Admin**: Go to Users tab
3. **See**: Alice's account shows up! (Not before, now it does!)

### Test 2: Product Stock Sync

1. **Laptop Admin**: Edit product stock (change to 5)
2. **Phone**: Refresh products page
3. **See**: New stock number shows instantly!

### Test 3: Order Sync

1. **Phone**: Place an order
2. **Laptop Admin**: Refresh dashboard
3. **See**: Order appears in admin panel!

## What Changed

### Backend Code

- ✅ `UserController`: Added `GET /api/users` endpoint to fetch all users from database
- ✅ `ProductService`: Fixed parsing to include image URLs
- ✅ `ProductController`: Updated JSON to include images
- ✅ `FileDatabase`: Fixed path to work from any directory

### Frontend Code

- ✅ `login.js`: Now calls `http://localhost:8080/api/users/register` instead of localStorage
- ✅ `login.js`: Now calls `http://localhost:8080/api/users/login` instead of localStorage
- ✅ `products.js`: Now calls `http://localhost:8080/api/products` instead of hardcoded data
- ✅ `admin.js`: Now calls `http://localhost:8080/api/users` instead of localStorage

## API Endpoints Available

```
GET  /api/users              - Get all users
GET  /api/users/{id}         - Get specific user
POST /api/users/register     - Register new user
POST /api/users/login        - Login user

GET  /api/products           - Get all products
GET  /api/products/{id}      - Get specific product

GET  /api/orders             - Get all orders
POST /api/orders             - Create order
```

## Database Files

All data stored in `/database/` folder:

- `users.txt` - All registered users
- `products.txt` - All products with images
- `orders.txt` - All orders placed

## Troubleshooting

### "User not showing in admin after registration"

- ✅ FIXED! Now uses backend database instead of localStorage
- Just refresh the admin Users page

### "Phone can't see products"

- ✅ FIXED! Products now fetched from backend API
- Make sure you use correct IP address (not localhost)

### "Stock doesn't update on other devices"

- ✅ FIXED! Both devices fetch from same backend database
- Refresh page to see latest data

### "Orders not syncing"

- ✅ FIXED! Orders saved to backend database
- All devices see same orders

## For Internet Access (With Friends)

Use ngrok to share your site:

```bash
ngrok http 3000
```

Then share the generated URL with friends. They can access from anywhere!

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Three Devices                      │
├─────────────────┬───────────────┬──────────────────┤
│   Phone User    │ Laptop Admin  │   Friend (ngrok) │
└────────┬────────┴───────┬───────┴────────┬─────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                   Frontend (Port 3000)
                          │
                   Backend API (Port 8080)
                          │
                   ┌───────┴────────┐
                   │  Database      │
                   │  /database/    │
                   └────────────────┘
```

## Next Steps

1. ✅ **RIGHT NOW**: Start servers and test on phone + laptop
2. 🔄 **LATER**: Add ngrok for friend access
3. 🚀 **PRODUCTION**: Replace text files with real database (MySQL/MongoDB)

---

## Summary of What You Can Do Now

✅ Users register on phone → Show up on laptop admin
✅ Admin edits product on laptop → Changes visible on phone
✅ Multiple users from different devices → All data in one place
✅ Orders placed from phone → Admin sees them immediately
✅ No more "Why isn't my account showing?" problems!

**Everything is now synced across all devices through the backend database!**

Questions? Check `CROSS_DEVICE_SYNC.md` for detailed documentation.
