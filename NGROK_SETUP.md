# ngrok Setup Guide - Remote Access for Dream Furniture

## Quick Start

### Step 1: Start Your Java Server

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\backend"
javac -d . src/com/furniture/*.java src/com/furniture/**/*.java
java com.furniture.FurnitureServer
```

Wait for the message: `Dream Furniture Server is running! Port: 8080`

### Step 2: Open ngrok (in a new terminal)

```bash
ngrok http 8080
```

### Step 3: Share the URL

ngrok will display something like:

```
Session Status                online
Session Expires               1 hour 59 minutes
Version                       3.0.0
Region                        us (United States)
Forwarding                    https://xxxx-xxx-xxx-xxx.ngrok.io -> http://localhost:8080
Web Interface                 http://127.0.0.1:4040
```

**Copy the HTTPS URL** (e.g., `https://xxxx-xxx-xxx-xxx.ngrok.io`) and share it with others.

### Step 4: Frontend URL

- **Local**: Open `frontend/index.html` in your browser
- **Remote**: Share the ngrok URL with others to access:
  - `https://xxxx-xxx-xxx-xxx.ngrok.io/frontend/index.html`
  - `https://xxxx-xxx-xxx-xxx.ngrok.io/frontend/pages/products.html`
  - `https://xxxx-xxx-xxx-xxx.ngrok.io/frontend/pages/custom-table.html`
  - etc.

## Important Notes

### ⚠️ Frontend Not Yet Served by Backend

Currently, the Java backend only serves API endpoints (products, orders, users, payment). The frontend files need to be accessed separately:

**Option A: Use ngrok + Local Frontend** (Recommended)

1. Run ngrok: `ngrok http 8080`
2. Browser opens `frontend/index.html` locally
3. API calls automatically go to ngrok backend
4. Share the ngrok URL for **API only**

**Option B: Use ngrok + HTTP Server** (Full Remote Access)

1. Run ngrok: `ngrok http 8080`
2. In another terminal, serve frontend:
   ```bash
   cd "d:\semester 02\enterpernaer ship\FinalProject\frontend"
   python -m http.server 3000
   ```
3. Run ngrok for port 3000:
   ```bash
   ngrok http 3000
   ```
4. Share the ngrok URL for complete access

**Option C: Use ngrok + Both Ports**

1. Run Java server: Port 8080
2. Run frontend server: Port 3000
3. Run ngrok for port 3000 (frontend will proxy API calls to 8080)

## API Endpoint Access via ngrok

Once ngrok is running, you can access API endpoints:

```
GET  https://xxxx-xxx-xxx-xxx.ngrok.io/api/products
GET  https://xxxx-xxx-xxx-xxx.ngrok.io/api/products/{id}
GET  https://xxxx-xxx-xxx-xxx.ngrok.io/api/orders
POST https://xxxx-xxx-xxx-xxx.ngrok.io/api/orders
```

## Troubleshooting

### "Could not connect to backend"

- Make sure Java server is running (port 8080)
- Make sure ngrok is running
- Wait 10 seconds after starting for connections to establish
- Check browser console for errors (F12)

### "API call failed"

- ngrok might have blocked the request
- Check ngrok web interface: `http://127.0.0.1:4040`
- This shows all requests and responses

### Persistent URL (Upgrade)

- Free ngrok URLs expire after 2 hours
- For permanent URLs, purchase ngrok Pro account
- Or use alternative: localtunnel, cloudflare tunnel

## Full Setup Example

**Terminal 1 - Start Java Server:**

```bash
cd "d:\semester 02\enterpernaer ship\FinalProject\backend"
javac -d . src/com/furniture/*.java src/com/furniture/**/*.java
java com.furniture.FurnitureServer
```

**Terminal 2 - Start ngrok:**

```bash
ngrok http 8080
```

**Browser 1 - Local Access:**

- Open: `file:///d:/semester%2002/enterpernaer%20ship/FinalProject/frontend/index.html`
- Or: Use VS Code Live Server extension
- Test: Products, Cart, Custom Table, etc.

**Browser 2 - Remote Access (Share this):**

- Give others: `https://xxxx-xxx-xxx-xxx.ngrok.io/frontend/pages/products.html`
- Or if using Option B: `https://yyyy-yyy-yyy-yyy.ngrok.io` (frontend port)

## Next Steps

1. **Test locally first** - Ensure everything works before sharing
2. **Share ngrok URL** - Give others the HTTPS link
3. **Monitor requests** - Check `http://127.0.0.1:4040` for activity
4. **Keep terminal open** - ngrok session ends when you close it

## Alternative Options

### Localtunnel (Free, no account needed)

```bash
npx localtunnel --port 8080
```

### Cloudflare Tunnel (Free, requires account)

```bash
cloudflared tunnel --url http://localhost:8080
```

### Your Own VPS

- Host on AWS EC2, DigitalOcean, or Heroku
- More control and permanent access
- Requires domain name and server setup

---

**Remember**: Share the ngrok URL, not your IP address. The URL changes every 2 hours on free ngrok!
