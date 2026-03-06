# MySQL Database Setup Guide

Your Dream Furniture application now supports **MySQL** as a backend database! You can choose between:

- **Text Files** (default) - Easier setup, works offline
- **MySQL** (new) - Production-ready, scalable, better performance

## Quick Start (No Changes Needed!)

By default, the app uses **text files** (`/database/products.txt`, `/database/users.txt`, `/database/orders.txt`).

Everything works as before — no setup needed!

---

## Enable MySQL (Optional)

### Prerequisites

1. **MySQL Server** installed and running
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use: https://www.apachefriends.org/ (XAMPP includes MySQL)

2. **JDBC Driver** (optional if MySQL server is available)

### Step 1: Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE dream_furniture;
```

### Step 2: Enable MySQL in Environment Variables

Set environment variables before running Java:

**Windows (PowerShell):**

```powershell
$env:MYSQL_ENABLED = "true"
$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_DATABASE = "dream_furniture"
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "your_password"  # Change if needed
```

**Windows (Command Prompt):**

```cmd
set MYSQL_ENABLED=true
set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set MYSQL_DATABASE=dream_furniture
set MYSQL_USER=root
set MYSQL_PASSWORD=your_password
```

**Linux/Mac (Bash):**

```bash
export MYSQL_ENABLED=true
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=dream_furniture
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
```

### Step 3: Start Backend with MySQL

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject"
java -cp backend com.furniture.FurnitureServer
```

### Step 4: Verify Setup

Check console output:

```
[MySQL] Schema initialized successfully.
```

If you see this, MySQL is connected! ✅

If you see fallback messages, MySQL isn't available — system will use text files automatically.

---

## What Gets Created in MySQL?

The system automatically creates 3 tables:

### 1. users

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    registered_date BIGINT NOT NULL
);
```

### 2. products

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    description TEXT,
    stock INT NOT NULL,
    image_url TEXT,
    created_date BIGINT NOT NULL
);
```

### 3. orders

```sql
CREATE TABLE orders (
    order_id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(255),
    zipcode VARCHAR(30),
    total DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    order_date BIGINT NOT NULL
);
```

---

## Hybrid Mode (Smart Fallback)

The application uses **smart fallback**:

1. **Try MySQL first** (if enabled)
2. **Fall back to text files** (if MySQL unavailable)
3. **No errors** — works either way!

This means:

- ✅ MySQL works? Use MySQL
- ✅ MySQL down? Use text files automatically
- ✅ MySQL connection error? System doesn't crash

---

## Common Issues & Solutions

### "Can't connect to MySQL server"

**Problem:** `MYSQL_ENABLED=true` but MySQL server not running

**Solution:**

1. Start MySQL service:
   ```
   Windows: Services > MySQL80 > Start
   Or: mysql --start  (if installed via command line)
   ```
2. Or disable MySQL and use text files:
   ```
   set MYSQL_ENABLED=false
   ```

### "Table already exists error"

**Problem:** Database already has tables from previous run

**Solution:** Tables are only created if they don't exist, so this is fine!

### "Access denied for user 'root'@'localhost'"

**Problem:** Wrong MySQL password

**Solution:** Update environment variable:

```powershell
$env:MYSQL_PASSWORD = "correct_password"
```

### Still using text files instead of MySQL?

**Check:**

1. Is `MYSQL_ENABLED=true` set?
   ```powershell
   Write-Host $env:MYSQL_ENABLED
   ```
2. Is MySQL running?
   ```
   mysql -u root -p
   ```
3. Check console for errors starting with `[MySQL]`

---

## Testing MySQL Integration

### Verify data is in MySQL:

```sql
-- Connect to dream_furniture database
USE dream_furniture;

-- Check tables exist
SHOW TABLES;

-- See all users
SELECT * FROM users;

-- See all products
SELECT * FROM products;

-- See all orders
SELECT * FROM orders;
```

### Test CRUD Operations:

1. **Admin Panel**: Add/edit/delete products → Check MySQL
2. **Register**: Create new account → Check MySQL users table
3. **Place Order**: Create order → Check MySQL orders table

---

## Migration: Text Files → MySQL

**No migration needed!**

When you enable MySQL:

1. System creates empty MySQL tables
2. Text files still exist (unchanged)
3. New data goes to MySQL
4. Old data stays in text files

To migrate old data:

```sql
-- Manually copy from text files to MySQL
-- Or re-add products/users through the UI
```

---

## Benefits of MySQL

| Feature          | Text Files              | MySQL                         |
| ---------------- | ----------------------- | ----------------------------- |
| **Scalability**  | Limited (file I/O slow) | Excellent (optimized queries) |
| **Multi-user**   | File locks possible     | Concurrent access safe        |
| **Performance**  | Reads full file         | Index-based queries           |
| **Transactions** | No                      | Yes (data consistency)        |
| **Backup**       | Copy files              | `mysqldump` command           |
| **Replication**  | Not supported           | Master-slave replication      |
| **Security**     | File permissions        | User/password auth            |

---

## Production Deployment

For production (cloud servers like Heroku, AWS, Railway):

1. **Install MySQL** (or use managed service):
   - Heroku MySQL
   - AWS RDS
   - Railway MySQL

2. **Set environment variables** on server:

   ```
   MYSQL_ENABLED=true
   MYSQL_HOST=your-db-host.com
   MYSQL_PORT=3306
   MYSQL_DATABASE=dream_furniture
   MYSQL_USER=db_user
   MYSQL_PASSWORD=secure_password
   ```

3. **Run backend** — automatically uses MySQL!

---

## Switching Back to Text Files

To disable MySQL:

```powershell
$env:MYSQL_ENABLED = "false"
```

System will use text files again!

---

## Environment Variables Summary

```
MYSQL_ENABLED        = true/false (default: false)
MYSQL_HOST           = localhost or IP address
MYSQL_PORT           = 3306 (default MySQL port)
MYSQL_DATABASE       = dream_furniture
MYSQL_USER           = root (default)
MYSQL_PASSWORD       = (empty by default, set if needed)
```

---

## Support

If MySQL fails:

1. Check console for `[MySQL]` error messages
2. System automatically falls back to text files
3. No data loss — everything still works!

Happy coding! 🚀

---

**Current Status:** Using **text files** by default  
**To enable MySQL:** Set `MYSQL_ENABLED=true` environment variable
