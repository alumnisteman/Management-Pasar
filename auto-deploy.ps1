# Konfigurasi Server
$ServerIp = "103.175.219.57"
$Username = "root"
$Password = "M4ruw4h3@"

# PENTING: Ganti folder di bawah ini sesuai dengan direktori aplikasi Anda di dalam server
$RemoteDir = "/var/www/svms"


Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Auto-Deploy: Lokal -> GitHub -> Server " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Push dari lokal ke GitHub
Write-Host "\n[1/3] Memeriksa perubahan di file lokal..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "[!] Ada perubahan. Sedang mengunggah ke GitHub..." -ForegroundColor Yellow
    git add .
    git commit -m "Auto-deploy update dari lokal"
    git push origin master
    Write-Host "[+] Berhasil push ke GitHub!" -ForegroundColor Green
} else {
    Write-Host "[i] Tidak ada perubahan kode baru di lokal. Melanjutkan ke proses server..." -ForegroundColor DarkCyan
}

# 2. Persiapkan Koneksi ke Server
Write-Host "\n[2/3] Mempersiapkan Posh-SSH untuk login otomatis..." -ForegroundColor Yellow
if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
    Write-Host "[!] Menginstal modul Posh-SSH (hanya terjadi pertama kali)..." -ForegroundColor Yellow
    Install-Module -Name Posh-SSH -Force -Scope CurrentUser -AllowClobber
}
Import-Module Posh-SSH

# 3. Login ke Server dan jalankan Git Pull
Write-Host "\n[3/3] Menghubungkan ke server $ServerIp..." -ForegroundColor Yellow
$SecPassword = ConvertTo-SecureString $Password -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential ($Username, $SecPassword)
# Set a longer connection timeout if needed (default is 30 seconds)
$Session = New-SSHSession -ComputerName $ServerIp -Credential $Cred -AcceptKey

if ($Session) {
    Write-Host "[+] Berhasil masuk! Menyuruh server menarik update terbaru..." -ForegroundColor Green
    
$repoPath = $RemoteDir
$gitDeployCmd = @'
if [ -d "${repoPath}/.git" ]; then
    cd ${repoPath}
    git fetch origin master && git reset --hard origin/master
else
    echo "No git repository found at ${repoPath}, skipping fetch/reset"
fi
sh deploy.sh
php artisan config:cache && php artisan route:cache && php artisan view:clear && php artisan view:cache && php artisan event:cache && php artisan octane:restart
'@

$result = Invoke-SSHCommand -SessionId $Session.SessionId -Command $gitDeployCmd -Timeout 300
if ($result.ExitStatus -ne 0) {
    Write-Error "Remote command failed (exit $($result.ExitStatus)). Output:`n$($result.Output)"
} else {
    Write-Host $result.Output -ForegroundColor White
}

Write-Host "\n--- OUTPUT DARI SERVER ---" -ForegroundColor DarkGray
Write-Host "--------------------------\n" -ForegroundColor DarkGray

Remove-SSHSession -SessionId $Session.SessionId
Write-Host "[+] Semua Proses Auto-Deploy Selesai dengan Sukses!" -ForegroundColor Green
} else {
    Write-Host "[-] Gagal login ke server. Periksa kembali IP dan Password." -ForegroundColor Red
}
