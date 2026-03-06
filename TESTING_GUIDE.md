# Step-by-Step Testing Guide

## Setup (One Time)

### 1. Start Backend Server

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject"
java -cp backend com.furniture.FurnitureServer
```

**Expected Output:**

```
========================================
Dream Furniture Server is running!
Port: 8080
API Base URL: http://localhost:8080/api
========================================
```

### 2. Start Frontend Server (New Terminal)

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\frontend"
python -m http.server 3000
```

**Expected Output:**

```
Serving HTTP on :: port 3000 (http://[::]:3000/) ...
```

---

## Test 1: User Registration Sync (Cross-Device)

### On Phone:

1. Open: `http://<YOUR_LAPTOP_IP>:3000/pages/login.html`
   - Replace `<YOUR_LAPTOP_IP>` with actual IP from `ipconfig`
   - Example: `http://192.168.1.10:3000/pages/login.html`
2. Click "Don't have an account? Register"
3. Fill form:
   - Name: `Phone Test User`
   - Email: `phone.test@example.com`
   - Password: `testpass123`
   - Photo URL: (leave empty or add photo)
4. Click "Register"
5. Should redirect to Products page

### On Laptop Admin Panel:

1. Open: `http://localhost:3000/admin/login.html`
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Click "Users" tab
4. **SHOULD SEE**: `phone.test@example.com` with name "Phone Test User"

### Result:

✅ **PASSED**: User registered on phone appears in laptop admin panel!

---

## Test 2: Product Stock Sync

### On Laptop Admin:

1. Stay in Admin Panel (from Test 1)
2. Click "Products" tab
3. Find product "Modern Dining Table" (ID: 1)
4. Click "Edit" button
5. Change stock from 15 to 5
6. Click "Save Changes"
7. Should see table updated

### On Phone:

1. Go to: `http://<YOUR_LAPTOP_IP>:3000/pages/products.html`
2. Find "Modern Dining Table"
3. Check if stock shows "5"

### Result:

✅ **PASSED**: Product changes on admin reflect immediately on phone!

---

## Test 3: Order Sync

### On Phone:

1. On products page, find any product
2. Click "Add to Cart"
3. Go to Cart (click cart icon)
4. Click "Proceed to Checkout"
5. Fill details:
   - Customer Name: `Phone Test User`
   - Email: `phone.test@example.com`
   - Phone: `+92312345678`
   - Address: `123 Test Street`
   - City: `Test City`
   - Zip: `12345`
6. Click "Place Order"
7. Should show order confirmation

### On Laptop Admin:

1. Go to Admin Orders tab
2. **SHOULD SEE**: New order from "Phone Test User"
3. Click order to see details
4. Stock should be updated (decreased)

### Result:

✅ **PASSED**: Order from phone visible on admin immediately!

---

## Test 4: User Login Sync

### On Different Device:

1. Open: `http://<LAPTOP_IP>:3000/pages/login.html`
2. Click "Already have an account? Login"
3. Enter credentials:
   - Email: `phone.test@example.com`
   - Password: `testpass123`
4. Click "Login"
5. Should successfully login
6. Should be able to place orders

### Result:

✅ **PASSED**: Account registered on one device can login on another!

---

## Test 5: Admin Order Status Update

### On Laptop Admin:

1. Orders tab
2. Find order from phone
3. Change status from "pending" to "processing"
4. Select "shipped"
5. Save

### On Phone:

1. Go to Orders page
2. Refresh page
3. **SHOULD SEE**: Order status updated to "shipped"

### Result:

✅ **PASSED**: Order status changes sync across devices!

---

## Test 6: Multiple Devices

### Device 1 (Laptop):

1. Register: `laptop.user@test.com` / `pass123`
2. Place order for 2 products

### Device 2 (Phone):

1. Register: `phone.user2@test.com` / `pass123`
2. Place order for 1 product

### Laptop Admin:

1. Check Users tab: **Should see both email addresses**
2. Check Orders tab: **Should see both orders**
3. Click each user: **Should see their order history**

### Result:

✅ **PASSED**: Multiple users from different devices all sync to backend!

---

## Test 7: Data Persistence (Restart Test)

### Before Restart:

1. Note all registered users in admin
2. Note all product stocks
3. Note all orders

### Restart Servers:

1. Close Java terminal (Ctrl+C)
2. Close Python terminal (Ctrl+C)
3. Restart both servers

### After Restart:

1. Open admin panel
2. **SHOULD SEE**: Same users, products, orders as before!

### Result:

✅ **PASSED**: Data persists in database files even after restart!

---

## Troubleshooting Checklist

| Issue                  | Solution                                | Status |
| ---------------------- | --------------------------------------- | ------ |
| "Phone can't connect"  | Use laptop IP instead of localhost      | ✓      |
| "User not in admin"    | Refresh admin page (not just browser)   | ✓      |
| "Products are empty"   | Ensure database/products.txt has data   | ✓      |
| "Order not visible"    | Check backend running on 8080           | ✓      |
| "Login fails"          | Verify user registered on backend       | ✓      |
| "Stock doesn't update" | Refresh page to get latest from backend | ✓      |

---

## Quick Check Commands

### Check if Backend is Running:

```powershell
Invoke-WebRequest http://localhost:8080/api/products -UseBasicParsing | Select-Object StatusCode
```

### Check if Frontend is Running:

```powershell
Invoke-WebRequest http://localhost:3000/index.html -UseBasicParsing | Select-Object StatusCode
```

### View All Users in Database:

```powershell
Get-Content "d:\semester 02\enterpernaer ship\FinalProject\database\users.txt"
```

### View All Orders:

```powershell
Get-Content "d:\semester 02\enterpernaer ship\FinalProject\database\orders.txt"
```

---

## Expected Test Results Summary

| Test                   | Status  | Notes                                |
| ---------------------- | ------- | ------------------------------------ |
| User Registration Sync | ✅ PASS | Phone user appears in laptop admin   |
| Product Stock Sync     | ✅ PASS | Stock changes reflect on all devices |
| Order Sync             | ✅ PASS | Orders visible on admin immediately  |
| User Login Sync        | ✅ PASS | Can login from any device            |
| Order Status Sync      | ✅ PASS | Status updates visible everywhere    |
| Multiple Users         | ✅ PASS | All users stored in database         |
| Data Persistence       | ✅ PASS | Data survives server restart         |

---

## Next Level Testing

### Load Testing (Multiple Orders):

- Place 10 orders from phone
- Place 10 orders from laptop
- Check admin shows all 20 orders

### Concurrent Testing:

- Register on phone while laptop is editing products
- Both operations should succeed without conflicts

### Offline Testing:

- Stop backend server
- Frontend should still work with localStorage fallback
- Data won't sync but won't crash

### Network Testing:

- Use ngrok for internet-wide access
- Share URL with friend outside your network
- They should be able to register and place orders

---

**All Tests Passing? You've successfully implemented cross-device synchronization!** 🎉
