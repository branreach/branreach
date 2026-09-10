@echo off
chcp 65001 >nul
title Branreach
cd /d "%~dp0web"

if not exist "node_modules\" npm install

echo.
echo   Branreach 웹사이트 시작 중...
echo   6~10초 후 브라우저가 자동으로 열립니다.
echo   안 열리면 주소창에 직접 입력: http://localhost:3000
echo   ( 서버를 끄려면 이 창을 닫으세요 )
echo.

start "" /min powershell -NoProfile -Command "Start-Sleep 8; Start-Process 'http://localhost:3000'"
npm run dev
