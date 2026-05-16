@echo off
echo Mengatur Jadwal Auto Push (Setiap 1 Menit)...
schtasks /create /sc minute /mo 1 /tn "MP_AutoPush" /tr "powershell.exe -ExecutionPolicy Bypass -File d:\MP\_tools\auto_push.ps1" /f
if %errorlevel% equ 0 (
    echo.
    echo BERHASIL! Auto Push sudah aktif.
) else (
    echo.
    echo GAGAL! Pastikan Anda menjalankan file ini dengan "Run as Administrator".
)
pause
STOP