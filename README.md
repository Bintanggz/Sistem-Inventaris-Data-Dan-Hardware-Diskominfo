# SiINDAH (Sistem Inventaris Data dan Hardware)

SiINDAH adalah platform aplikasi berbasis web yang dirancang untuk memenuhi kebutuhan digitalisasi manajemen inventaris, baik data maupun perangkat keras (hardware), di lingkungan Dinas Komunikasi dan Informatika (Diskominfo). Aplikasi ini memberikan kemudahan dalam pencatatan, pelacakan riwayat mutasi, serta pelaporan aset secara terpusat.

## 🚀 Fitur Utama

- **Dashboard Modern:** Antarmuka responsif dengan statistik ringkas.
- **Manajemen Inventaris:** Pencatatan detil perangkat keras dan aset lainnya.
- **Sistem Mutasi:** Pencatatan dan pelacakan riwayat pemindahan/mutasi barang dari satu lokasi/penanggung jawab ke lokasi lain.
- **Manajemen Lokasi:** Data inventarisasi lokasi dan sebarannya.
- **Pelaporan Komprehensif:** Ekspor laporan maupun rekapitulasi data mutasi ke format **PDF** dan **Excel**.
- **Autentikasi:** Sistem login yang aman berbasis token.

## 🛠️ Teknologi yang Digunakan

Projek ini terbagi ke dalam arsitektur **Frontend** (Antarmuka Pengguna/UI) dan **Backend** (Penyedia API data).

**Backend (API)**  
Berada di dalam folder `/backend`.
- **Framework:** Laravel 12 (PHP 8.2)
- **Autentikasi:** Laravel Sanctum
- **Laporan (Export):** `barryvdh/laravel-dompdf` (PDF) & `maatwebsite/excel` (Excel/CSV)
- **Database:** Support menggunakan MySQL / PostgreSQL / SQLite.

**Frontend (UI)**  
Berada di dalam folder `/frontend`.
- **Framework:** React 19 dengan Vite
- **Styling:** Tailwind CSS v4
- **State Management & Routing:** React Context & React Router v7
- **HTTP Client:** Axios
- **Visualisasi & Ikon:** Recharts & React Icons

---

## 💻 Panduan Instalasi Lokal

Untuk mengembangkan atau menjalankan projek ini di *localhost* Anda, ikuti langkah-langkah di bawah ini.

### Prasyarat
- PHP >= 8.2 dan Composer terinstal.
- Node.js & NPM terinstal.
- DBMS Server berjalan (Misal: XAMPP untuk MySQL) atau dapat menggunakan SQLite.

### 1. Konfigurasi Backend (Laravel API)

1. Buka terminal lalu arahkan ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal pustaka PHP yang diperlukan:
   ```bash
   composer install
   ```
3. Gandakan (copy) file environment bawaan:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan kredensial `.env` Anda, misalnya jika menggunakan MySQL via XAMPP:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=si_indah
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Buat key aplikasi baru:
   ```bash
   php artisan key:generate
   ```
6. Eksekusi file migrasi (dan *seeding* jika ada):
   ```bash
   php artisan migrate --seed
   ```
7. Jalankan server Laravel secara lokal:
   ```bash
   php artisan serve
   ```
   *Secara default, Backend akan dapat diakses di `http://localhost:8000/`*

### 2. Konfigurasi Frontend (React UI)

1. Buka terminal baru (atau tab baru) lalu arahkan ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal modul *Node* (NPM dependencies):
   ```bash
   npm install
   ```
3. Atur URL API Backend di `.env`. Salin contohnya jika belum ada:
   ```bash
   cp .env.example .env
   ```
   Pastikan di `.env` sudah mengatur endpoint ke tempat aplikasi server Laravel berjalan, misalnya:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
   *(Catatan: Nama environment key tergantung dengan instalasi standar React/Axios Anda, cek file `axios.js` atau `config` di dalam folder src)*
4. Jalankan aplikasi web peramban (browser):
   ```bash
   npm run dev
   ```
5. Buka tautan lokal yang disediakan (misal: `http://localhost:5173`) di peramban Anda. Aplikasi SiINDAH sudah bisa diakses.

---

## 📁 Struktur Direktori Singkat

```text
SI-INDAH/
  ├─ backend/   -> Source code Laravel, Controller, Model (Mutasi, Reports, dll), Migrasi.
  └─ frontend/  -> Berisi file sumber (src/), komponen UI React, Page layout, dan API Calls.
```

## 📄 Lisensi

Hanya untuk pemakaian internal Diskominfo. Tidak untuk didistribusikan ulang (Komersial).
