# MS SQL Server Database Setup Guide

Your Dream Furniture application now supports **MS SQL Server** as a backend database! You can choose between:

- **Text Files** (default) - Easier setup, works offline
- **MS SQL Server** (new) - Enterprise-grade, high performance, production-ready

## Quick Start (No Changes Needed!)

By default, the app uses **text files** (`/database/products.txt`, `/database/users.txt`, `/database/orders.txt`).

Everything works as before — no setup needed!

---

## Enable MS SQL Server (Optional)

### Prerequisites

1. **MS SQL Server** installed and running
   - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Or use: SQL Server Express (free edition)
   - Windows/Linux/Docker versions available

2. **SQL Server Management Studio** (optional, for database management)
   - Download: https://aka.ms/ssmsfullsetup

3. **JDBC Driver** (automatic)
   - Microsoft SQL Server JDBC Driver 9.2+ (included with modern Java)

### Step 1: Create MS SQL Server Database

**Option A: Using SQL Server Management Studio**

1. Open SSMS
2. Right-click "Databases" → New Database
3. Name: `dream_furniture`
4. Click OK

**Option B: Using Command Line (T-SQL)**

```sql
CREATE DATABASE dream_furniture;
```

### Step 2: Enable MS SQL Server in Environment Variables

Set environment variables before running Java:

**Windows (PowerShell):**

```powershell
$env:MSSQL_ENABLED = "true"
$env:MSSQL_HOST = "localhost"
$env:MSSQL_PORT = "1433"
$env:MSSQL_DATABASE = "dream_furniture"
$env:MSSQL_USER = "sa"
$env:MSSQL_PASSWORD = "YourPassword123"
```

**Windows (Command Prompt):**

```cmd
set MSSQL_ENABLED=true
set MSSQL_HOST=localhost
set MSSQL_PORT=1433
set MSSQL_DATABASE=dream_furniture
set MSSQL_USER=sa
set MSSQL_PASSWORD=YourPassword123
```

**Linux/Mac (Bash):**

```bash
export MSSQL_ENABLED=true
export MSSQL_HOST=localhost
export MSSQL_PORT=1433
export MSSQL_DATABASE=dream_furniture
export MSSQL_USER=sa
export MSSQL_PASSWORD=YourPassword123
```

### Step 3: Download MS SQL JDBC Driver (If Needed)

If you're on Java 8 or need the driver:

1. Download: https://github.com/microsoft/mssql-jdbc/releases
2. Extract `mssql-jdbc-*.jar`
3. Place in: `d:\semester 02\enterpernaer ship\FinalProject\backend\lib\`
4. Update classpath when running:
   ```bash
   java -cp .:lib/mssql-jdbc-11.2.0.jre8.jar com.furniture.FurnitureServer
   ```

### Step 4: Start Backend with MS SQL Server

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\backend"
java -cp . com.furniture.FurnitureServer
```

### Step 5: Verify Setup

Check console output:

```
[MSSQL] Driver loaded successfully
[MSSQL] Schema initialized successfully
```

If you see this, MS SQL Server is connected! ✅

If you see fallback messages, MS SQL isn't available — system will use text files automatically.

---

## What Gets Created in MS SQL Server?

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
    price FLOAT NOT NULL,
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
    total FLOAT NOT NULL,
    status VARCHAR(50) NOT NULL,
    order_date BIGINT NOT NULL
);
```

---

## Hybrid Mode (Smart Fallback)

The application uses **smart fallback**:

1. **Try MS SQL Server first** (if enabled)
2. **Fall back to text files** (if MS SQL unavailable)
3. **No errors** — works either way!

This means:

- ✅ MS SQL works? Use MS SQL Server
- ✅ MS SQL down? Use text files automatically
- ✅ MS SQL connection error? System doesn't crash

---

## Common Issues & Solutions

### "Can't connect to MS SQL Server"

**Problem:** `MSSQL_ENABLED=true` but SQL Server not running

**Solution:**

1. Start SQL Server service:
   ```
   Windows: Services > SQL Server (instance name) > Start
   Or: sqlservr.exe (if installed via command line)
   ```
2. Or disable MS SQL and use text files:
   ```
   set MSSQL_ENABLED=false
   ```

### "Table already exists error"

**Problem:** Database already has tables from previous run

**Solution:** Tables are only created if they don't exist, so this is fine!

### "Login failed for user 'sa'"

**Problem:** Wrong MS SQL password

**Solution:** Update environment variable:

```powershell
$env:MSSQL_PASSWORD = "correct_password"
```

Also verify SQL Server Auth is enabled (not just Windows Auth):

```sql
-- In SSMS, right-click server → Properties → Security
-- Change "Server authentication" to "SQL Server and Windows Authentication mode"
```

### "Mixed authentication not enabled"

**Problem:** SQL Server only accepts Windows authentication

**Solution:**

1. Open SSMS → Right-click server → Properties
2. Go to "Security" tab
3. Change "Server authentication" to "SQL Server and Windows Authentication mode"
4. Restart SQL Server service

### Still using text files instead of MS SQL?

**Check:**

1. Is `MSSQL_ENABLED=true` set?
   ```powershell
   Write-Host $env:MSSQL_ENABLED
   ```
2. Is SQL Server running?
   ```
   Services → SQL Server (instance name)
   Or: sqlcmd -S localhost
   ```
3. Check console for errors starting with `[MSSQL]`

---

## Testing MS SQL Server Integration

### Verify data is in MS SQL Server:

**Using SQL Server Management Studio:**

1. Connect to server
2. Expand "dream_furniture" database
3. Right-click "Tables" → Refresh
4. See all 3 tables: users, products, orders
5. Right-click table → Select Top 1000 Rows

**Using Command Line (sqlcmd):**

```sql
sqlcmd -S localhost -U sa -P "YourPassword"
USE dream_furniture;
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
GO
```

### Test CRUD Operations:

1. **Admin Panel**: Add/edit/delete products → Check MS SQL
2. **Register**: Create new account → Check MS SQL users table
3. **Place Order**: Create order → Check MS SQL orders table

---

## Migration: Text Files → MS SQL Server

**No migration needed!**

When you enable MS SQL:

1. System creates empty MS SQL tables
2. Text files still exist (unchanged)
3. New data goes to MS SQL Server
4. Old data stays in text files

To migrate old data:

```sql
-- Manually copy from text files to MS SQL using INSERT statements
-- Or re-add products/users through the UI
```

---

## Benefits of MS SQL Server

| Feature              | Text Files              | MS SQL Server                   |
| -------------------- | ----------------------- | ------------------------------- |
| **Scalability**      | Limited (file I/O slow) | Excellent (optimized queries)   |
| **Multi-user**       | File locks possible     | Concurrent access safe          |
| **Performance**      | Reads full file         | Index-based queries             |
| **Transactions**     | No                      | Yes (data consistency)          |
| **Backup**           | Copy files              | `BACKUP DATABASE` command       |
| **Replication**      | Not supported           | Always On Availability Groups   |
| **Security**         | File permissions        | User/password + roles           |
| **Enterprise Ready** | No                      | Yes (AD integration)            |
| **Licensing**        | Free                    | Enterprise ($) / Express (Free) |

---

## Production Deployment

For production (cloud servers like Azure, AWS, etc.):

1. **Install MS SQL Server** (or use managed service):
   - Azure SQL Database
   - AWS RDS for SQL Server
   - On-premises SQL Server

2. **Set environment variables** on server:

   ```
   MSSQL_ENABLED=true
   MSSQL_HOST=your-database-server.com
   MSSQL_PORT=1433
   MSSQL_DATABASE=dream_furniture
   MSSQL_USER=db_user
   MSSQL_PASSWORD=secure_password
   ```

3. **Create firewall rules** to allow Java app to connect
4. **Run backend** — automatically uses MS SQL Server!

---

## Switching Back to Text Files

To disable MS SQL Server:

```powershell
$env:MSSQL_ENABLED = "false"
```

System will use text files again!

---

## Environment Variables Summary

```
MSSQL_ENABLED      = true/false (default: false)
MSSQL_HOST         = localhost or hostname/IP
MSSQL_PORT         = 1433 (default MS SQL port)
MSSQL_DATABASE     = dream_furniture
MSSQL_USER         = sa (or your SQL user)
MSSQL_PASSWORD     = (empty by default if using Windows Auth)
```

---

## Version Compatibility

**Tested with:**

- Java 8, 11, 17+ ✅
- MS SQL Server 2019, 2022 ✅
- SQL Server Express ✅
- Azure SQL Database ✅

---

## Support

If MS SQL Server fails:

1. Check console for `[MSSQL]` error messages
2. System automatically falls back to text files
3. No data loss — everything still works!

---

**Current Status:** Using **text files** by default  
**To enable MS SQL:** Set `MSSQL_ENABLED=true` environment variable

Happy coding! 🚀
