@echo off
chcp 65001 >nul
title Branreach
cd /d "%~dp0web"

if not exist "node_modules\" npm install

echo.
echo   Branreach 웹사이트 시작 중...
echo   ( 첫 실행은 페이지가 뜨기까지 10~20초 정도 걸릴 수 있어요 )
echo   안 열리면 주소창에 직접 입력: http://localhost:3000
echo   서버를 끄려면 이 창을 닫으세요.
echo.

start "" /min powershell -NoProfile -WindowStyle Hidden -Command "for ($i=0; $i -lt 120; $i++) { try { Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 500 } }; Start-Process 'http://localhost:3000'"

npm run dev
