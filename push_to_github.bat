@echo off
echo ============================================================
echo   NutriGen-CDS: Push to GitHub
echo   Repository: https://github.com/vegadafaa/CDSnutrigenom.git
echo ============================================================
echo.

cd /d "c:\Users\Vega\Documents\Master\QMS\nutrigenomic_cds"

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git tidak ditemukan. Silakan install Git dari:
    echo         https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/6] Mengecek status repository...
git status

REM Initialize git if not already initialized
if not exist ".git" (
    echo.
    echo [2/6] Inisialisasi Git repository baru...
    git init
    git branch -M main
) else (
    echo [2/6] Git repository sudah ada.
)

REM Create .gitignore
echo.
echo [3/6] Membuat .gitignore...
(
echo node_modules/
echo backend/node_modules/
echo .env
echo backend/.env
echo *.log
echo .DS_Store
echo Thumbs.db
echo uploads/
echo backend/uploads/
echo *.pem
echo *.key
) > .gitignore

REM Stage all files
echo.
echo [4/6] Menambahkan semua file ke staging...
git add -A
echo.
git status --short

REM Commit
echo.
echo [5/6] Membuat commit...
git commit -m "feat: NutriGen-CDS full app - physician, lab, patient portal"

REM Add remote and push
echo.
echo [6/6] Push ke GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/vegadafaa/CDSnutrigenom.git
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   [SUCCESS] Berhasil di-push ke GitHub!
    echo   URL: https://github.com/vegadafaa/CDSnutrigenom
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   [GAGAL] Push tidak berhasil.
    echo   Pastikan:
    echo   1. Repository sudah dibuat di GitHub
    echo   2. Anda sudah login ke GitHub (via browser atau token)
    echo   3. Nama branch sudah benar
    echo ============================================================
)

pause
