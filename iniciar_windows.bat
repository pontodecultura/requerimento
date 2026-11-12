@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 goto use_py

where python >nul 2>nul
if not errorlevel 1 goto use_python

echo Python 3 nao foi encontrado.
echo Instale Python 3 ou execute o projeto usando uma extensao Live Server.
pause
exit /b 1

:use_py
start "Servidor local - Gerador de Requerimento" cmd /k py -m http.server 8000
goto open_browser

:use_python
start "Servidor local - Gerador de Requerimento" cmd /k python -m http.server 8000

goto open_browser

:open_browser
timeout /t 2 /nobreak >nul
start "" http://localhost:8000
endlocal
