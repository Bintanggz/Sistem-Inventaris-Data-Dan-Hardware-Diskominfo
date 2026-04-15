# Frontend SiINDAH (Antarmuka Pengguna)

Ini adalah direktori **Frontend** untuk aplikasi Sistem Inventaris Data dan Hardware (SiINDAH), dibangun menggunakan React 19, Tailwind CSS v4, dan dikelola oleh _build tool_ modern, Vite.

## 🚀 Teknologi Utama

- **Vite** untuk proses *development* dan *build* yang cepat.
- **React.js 19** untuk membuat komponen UI (*User Interface*).
- **Tailwind CSS 4** sebagai *utility-first* framework untuk mendesain secara modern.
- **React Router v7** untuk mengatur navigasi halaman (seperti Locations, Mutations, Reports).
- **Axios** digunakan saat menghubungkan frontend secara asinkron dengan _RESTful API_ backend Laravel.
- **Recharts** untuk membuat visualisasi analitik data dinamis pada Dashboard.

## 💻 Panduan Menjalankan

Langkah mudah untuk mulai mengembangkan di lokal:

1. Modifikasi atau buat file `.env` berdasarkan spesifikasi lingkungan lokal. Anda perlu memastikan bahwa _baseURL_ menunjuk lurus ke API Backend (biasanya `http://localhost:8000/api`).
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Mulai server pengembangan:
   ```bash
   npm run dev
   ```

Aplikasi frontend biasanya akan berjalan di [http://localhost:5173/](http://localhost:5173/).

## 🔧 Build untuk Produksi

Jika siap untuk membuat rilis *production-ready*:
```bash
npm run build
```
File siap pakai tersebut akan dihasilkan pada folder `dist/` dan dapat Anda hubungkan ke folder `public/` web server Anda (misal `Nginx` atau `Apache`/Apache bawaan Laravel).
