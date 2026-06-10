# Website Kelas SI24

Proyek ini adalah aplikasi/website yang dibangun khusus untuk mengelola data dan informasi Kelas SI24. Aplikasi ini menggunakan teknologi *fullstack* modern dengan spesifikasi berikut:

## Teknologi yang Digunakan

### 🎨 Frontend (Antarmuka Pengguna)
- **React.js**: Library utama untuk membangun tampilan antarmuka yang interaktif.
- **Vite**: Digunakan sebagai *build tool* agar proses *development* sangat cepat.
- **Tailwind CSS**: Framework CSS untuk membuat desain yang modern dan *responsive* dengan cepat.
- **Framer Motion**: Digunakan untuk menambahkan animasi yang halus pada antarmuka aplikasi.

### ⚙️ Backend (Sistem Server)
- **Node.js**: *Environment* untuk menjalankan JavaScript di sisi server.
- **Express.js**: Framework backend yang ringan dan cepat untuk membangun REST API dan logika server.

### 🗄️ Database (Basis Data)
- **SQLite**: Sistem basis data relasional (*SQL*) yang ringan dan disimpan secara lokal (menggunakan `better-sqlite3`).
- **Drizzle ORM**: Alat perantara (ORM) untuk berinteraksi dengan database SQLite secara aman dan mudah.

### ☁️ Layanan Tambahan
- **Firebase**: Terintegrasi untuk layanan *cloud* pihak ketiga (biasanya digunakan untuk autentikasi pengguna atau penyimpanan file).

## Cara Menjalankan Proyek Secara Lokal

1. Buka terminal di folder proyek ini.
2. Instal semua *dependencies* yang dibutuhkan:
   ```bash
   npm install
   ```
3. Jalankan aplikasi (menjalankan Frontend & Backend sekaligus):
   ```bash
   npm run dev
   ```
