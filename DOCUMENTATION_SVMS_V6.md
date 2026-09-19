# 🧠 SVMS v6.0 Enterprise - Intelligence Edition
## Dokumentasi Sistem Lengkap (Manual Instalasi & Fitur)

Selamat datang di dokumentasi resmi **SVMS (Smart Vendor Management System) v6.0 Enterprise**. Sistem ini dirancang untuk tata kelola pasar modern berbasis intelijen data, spasial (GIS), dan otomasi.

---

## 1. Arsitektur & Teknologi Stack

### Backend (Core Intelligence)
*   **Framework**: Laravel 11.x
*   **Database**: MySQL 8.0 (Relational Data)
*   **Queue Driver**: Database (Asynchronous Processing)
*   **Cache/Session**: File/Redis
*   **API**: RESTful API with JSON responses

### Frontend (User Experience)
*   **Admin Dashboard**: Vanilla HTML5/CSS3/JS (Enterprise Premium Design)
*   **Landing Page**: Interactive Modern UI with Glassmorphism
*   **Porter Portal**: High-Fidelity White-Theme Portal
*   **GIS Engine**: MapLibre GL JS / OpenStreetMap
*   **Animations**: CSS3 Transitions & GSAP

### Infrastruktur
*   **Containerization**: Docker & Docker Compose
*   **Web Server**: NGINX (Reverse Proxy)
*   **OS**: Alpine Linux (Internal Container)

---

## 2. Panduan Instalasi (Development & Production)

### Prasyarat
*   Docker & Docker Compose terinstal
*   Python 3.x (untuk skrip deployment)

### Langkah Instalasi
1.  **Clone Repository**:
    ```bash
    git clone [repository-url]
    cd "Management Pasar"
    ```
2.  **Konfigurasi Environment**:
    Buat file `.env` di dalam container `svms-app-1` dengan setting database dan WhatsApp API Key.
3.  **Build & Run Container**:
    ```bash
    docker-compose up -d --build
    ```
4.  **Database Migration & Seeding**:
    ```bash
    docker exec svms-app-1 php artisan migrate
    docker exec svms-app-1 php artisan db:seed --class=FinalMasterSeeder
    docker exec svms-app-1 php artisan db:seed --class=PorterSeeder
    ```
5.  **Optimasi**:
    ```bash
    docker exec svms-app-1 php artisan optimize:clear
    ```

---

## 3. Skema Database Utama

| Tabel | Fungsi |
| :--- | :--- |
| `traders` | Data induk pedagang (NIK, Nama, Tipe). |
| `stalls` / `grid_slots` | Data spasial lapak, koordinat GIS, dan kategori zona. |
| `permits` | Data SIPTU Digital, masa berlaku, dan QR Code. |
| `porters` | Data personel kuli panggul resmi pasar. |
| `porter_jobs` | Antrean pekerjaan kuli dan rating pelanggan. |
| `audit_logs` | Rekam jejak seluruh aktivitas sistem (Immutable). |
| `bills` / `payments` | Billing otomatis bulanan dan riwayat transaksi. |

---

## 4. Modul & Fitur Unggulan

### 📊 A. Executive Pulse (Dashboard Utama)
Memberikan gambaran "Health Check" pasar secara real-time.
*   **Analytics**: Total Revenue, Compliance Rate, dan Occupancy Rate.
*   **Intelligence**: Deteksi dini penurunan pendapatan atau kenaikan keluhan.

### 🔳 B. Digital Twin GIS & Grid System
Visualisasi pasar dalam bentuk peta interaktif.
*   **Heatmap**: Melihat area paling padat di pasar.
*   **Booking Grid**: Memungkinkan admin memesankan lapak berdasarkan koordinat X,Y yang presisi.
*   **Dynamic Pricing**: Harga lapak yang berubah otomatis berdasarkan zona (Gold/Silver/Bronze).

### 📦 C. Modul Kuli Panggul (Porter Module)
Inovasi untuk efisiensi logistik pasar.
*   **Portal Publik**: Akses di `/porter` untuk masyarakat memesan kuli.
*   **Registrasi Admin**: Pendaftaran personel kuli lengkap dengan No HP.
*   **Incentive Engine**: Kalkulasi bonus mingguan berdasarkan rating dan jumlah job (Tier Platinum/Gold).

### 📜 D. Manajemen Izin (SIPTU)
Digitalisasi dokumen perizinan.
*   **Auto-Generation**: Pembuatan SIPTU PDF otomatis.
*   **QR Verification**: Verifikasi keaslian izin via scan kamera di halaman depan.

### 🛡️ E. Keamanan & Audit
*   **Automated Archiving**: Sistem otomatis memindahkan log > 6 bulan ke tabel archive untuk menjaga performa DB.
*   **WhatsApp Queue**: Notifikasi dikirim via background job sehingga UI tidak *loading* lama.

---

## 5. Pemeliharaan (Maintenance)

### Perintah Penting
*   **Cek Kesehatan Sistem**: `python run_doctor.py`
*   **Deploy Update UI**: `python deploy_admin_ui.py`
*   **Deploy Backend**: `python deploy_porters.py`
*   **Backup Database**: `python backup_db.py`

### Jadwal Otomatis (Cron)
Sistem menjalankan tugas berikut setiap bulan:
*   `system:archive-logs`: Pembersihan log audit lama (Tanggal 1 pukul 03:00).
*   `billing:generate`: Pembuatan tagihan bulanan pedagang.

---

*Dokumentasi ini dibuat secara otomatis oleh Antigravity AI untuk SVMS Enterprise v6.0.*
