@echo off
cd /d "%~dp0.."
powershell -ExecutionPolicy Bypass -File "scripts\dev-build.ps1"
pause