# Panduan Instalasi & Maintenance Management Pasar (SMOS Enterprise)

Dokumen ini berisi panduan lengkap untuk melakukan instalasi awal, sinkronisasi pembaruan, dan pemeliharaan (maintenance) pada sistem Manajemen Pasar.

## 1. Persyaratan Sistem
Pastikan server atau komputer lokal Anda telah menginstal perangkat lunak berikut:
- **Node.js** (Versi 18 atau 20+ disarankan)
- **Git**
- **Docker & Docker Compose** (Opsional, jika ingin menjalankan backend/database terpisah, namun aplikasi utama berjalan via Node)
- **NPM** (Bawaan Node.js)

## 2. Instalasi Awal (Local & Server)

Langkah-langkah ini digunakan saat pertama kali menyiapkan aplikasi di komputer baru atau server.

### A. Clone Repository
```bash
git clone https://github.com/alumnisteman/Management-Pasar.git
cd Management-Pasar
```

### B. Konfigurasi Frontend & Aplikasi Web
Aplikasi web ini menggunakan framework Node.js (React Router / Vite) dan menyimpan databasenya secara lokal di dalam folder `apps/web` (melalui file `svms_db.json`).

```bash
cd apps/web
npm install --legacy-peer-deps
```

### C. Konfigurasi Lingkungan (Environment)
1. Salin file `.env` (jika ada `.env.example`).
2. Pastikan file database sudah siap. Salin dari template:
   ```bash
   copy svms_db.json.example svms_db.json
   ```
   *(Penting: File `svms_db.json` berisi data operasional. File ini sengaja diabaikan oleh Git (via `.gitignore`) agar data di server produksi dan komputer lokal (development) tidak saling tumpang tindih).*

### D. Menjalankan Aplikasi

**Mode Development (Lokal):**
```bash
# Di dalam folder apps/web
npm run dev
```

**Mode Production (Server):**
```bash
# Di dalam folder apps/web
npm run build
npm run start
```

Aplikasi akan berjalan secara default di `http://localhost:4000` (atau port lain sesuai `.env`).

---

## 3. Sinkronisasi Pembaruan (Update Coding)

Karena data database (`svms_db.json`) telah dipisahkan dari source code yang di-push ke GitHub, Anda dapat menarik (pull) update coding terbaru tanpa khawatir menimpa data yang sedang berjalan.

**Langkah Update (Di Server atau Komputer lain):**

```bash
cd Management-Pasar
git pull origin master
```

**Jika ada perubahan dependensi (package.json):**
```bash
cd apps/web
npm install --legacy-peer-deps
npm run build
```

**Restart Aplikasi:**
Jika menggunakan Node langsung: matikan proses lama (`Ctrl+C`) lalu jalankan `npm run start` kembali, atau gunakan *process manager* seperti PM2:
```bash
pm2 restart web
```

Jika menggunakan Docker, gunakan script deploy yang sudah ada atau restart container frontend:
```bash
docker compose up -d --build frontend
```

---

## 4. Pemeliharaan (Maintenance) & Backup Data

### A. Backup Database Berkala
Database utama untuk aplikasi web tersimpan dalam file JSON sederhana di:
`apps/web/svms_db.json`

Sangat disarankan untuk melakukan *backup* file ini secara berkala (misal: harian atau mingguan) dengan menyalinnya ke tempat aman.
```bash
# Contoh backup di Windows
copy apps\web\svms_db.json backup\svms_db_backup_%DATE:/=-%.json

# Contoh backup di Linux
cp apps/web/svms_db.json backup/svms_db_backup_$(date +%F).json
```

### B. Memperbaiki Database Corrupt
Jika sistem gagal memuat ulang data atau terjadi kesalahan penulisan, file `svms_db.json` tidak akan otomatis ditimpa dengan data kosong (sistem telah diproteksi).
Namun, jika file benar-benar rusak:
1. Hapus atau pindahkan `svms_db.json` yang rusak.
2. Salin ulang file `svms_db.json.example` atau *restore* dari file *backup* terakhir.

### C. Membersihkan Log & Cache
Secara berkala, Anda mungkin perlu membersihkan file log yang menumpuk.
Log aplikasi (jika disetel untuk menulis log) atau log Docker bisa dibersihkan untuk menghemat ruang disk.

---

## 5. Pertanyaan yang Sering Diajukan (FAQ)

**T: Kenapa setiap kali melakukan update coding/git pull, password admin kembali ke default?**
**J:** Masalah ini sudah diperbaiki. Sebelumnya, *script database engine* otomatis menimpa file `svms_db.json` jika terjadi kesalahan membaca file akibat proses *reload* dari server *development*. Sekarang, file `svms_db.json` tidak akan ditimpa jika gagal dibaca, dan file ini telah dimasukkan ke dalam `.gitignore` sehingga tidak akan tertimpa oleh versi dari komputer lain saat melakukan `git pull`.

**T: Bagaimana cara mengedit password pengguna atau admin melalui database langsung?**
**J:** Buka file `apps/web/svms_db.json` dengan *text editor* (misal: VS Code atau Notepad). Cari blok `"users"`, temukan *user* yang bersangkutan, dan ganti nilai properti `"password"`. (Pastikan format JSON tetap valid).
