@echo off
echo Starting Furniture Store...
echo.

REM Start Python Server
start "Python Server - Port 3000" cmd /k "cd frontend && python -m http.server 3000"
timeout /t 3 /nobreak >nul

REM Start ngrok
start "ngrok Tunnel" cmd /k "ngrok http 3000"
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo Getting your public URL...
echo ========================================
echo.

REM Wait and get URL
powershell -Command "$url = ''; for($i=0; $i -lt 5; $i++) { try { $url = (Invoke-RestMethod 'http://127.0.0.1:4040/api/tunnels').tunnels[0].public_url; if($url) { break; } } catch { Start-Sleep -Seconds 2; } }; if($url) { Write-Host ''; Write-Host '================================================' -ForegroundColor Green; Write-Host 'SUCCESS! YOUR WEBSITE IS LIVE!' -ForegroundColor Green; Write-Host '================================================' -ForegroundColor Green; Write-Host ''; Write-Host 'PUBLIC URL:' -ForegroundColor Cyan; Write-Host $url -ForegroundColor Yellow; Write-Host ''; Write-Host 'SHARE WITH FRIENDS:' -ForegroundColor Magenta; Write-Host ('Homepage: ' + $url + '/index.html') -ForegroundColor White; Write-Host ('Products: ' + $url + '/pages/products.html') -ForegroundColor White; Write-Host ('Login: ' + $url + '/pages/login.html') -ForegroundColor White; Write-Host ''; Write-Host '================================================' -ForegroundColor Green; Write-Host ''; $url | clip; Write-Host 'URL copied to clipboard!' -ForegroundColor Yellow; Write-Host ''; } else { Write-Host 'Could not get URL automatically.' -ForegroundColor Red; Write-Host 'Check the ngrok window for your Forwarding URL!' -ForegroundColor Yellow; }"

echo.
echo Keep this window and the other 2 windows open!
echo Press any key to stop servers...
pause >nul

taskkill /F /IM ngrok.exe 2>nul
taskkill /F /IM python.exe 2>nul
