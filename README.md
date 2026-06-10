# Website Kelas SI24

Proyek ini adalah aplikasi/website yang dibangun khusus untuk mengelola data dan informasi Kelas SI24. Aplikasi ini menggunakan arsitektur *Serverless Fullstack* modern dengan spesifikasi berikut:

## Teknologi yang Digunakan

### 🎨 Frontend (Antarmuka Pengguna)
- **React.js**: Library utama untuk membangun tampilan antarmuka yang interaktif.
- **Vite**: Digunakan sebagai *build tool* agar proses *development* sangat cepat.
- **Tailwind CSS**: Framework CSS untuk membuat desain yang modern dan *responsive* dengan cepat.
- **Framer Motion**: Digunakan untuk menambahkan animasi yang halus pada antarmuka aplikasi.

### ⚙️ Backend (Sistem Server)
- **Node.js & Express.js**: Framework backend untuk membangun REST API dan logika server.
- **Vercel Serverless Functions**: Mengubah rute Express menjadi *Serverless Functions* di *cloud* melalui file konfigurasi `api/index.js` dan `vercel.json`.

### 🗄️ Database (Basis Data)
- **Turso**: Database Edge berbasis SQLite yang sangat cepat dan di-hosting di *cloud*.
- **Drizzle ORM**: Alat perantara (ORM) untuk berinteraksi dengan database Turso secara aman, dengan menggunakan client HTTP `@libsql/client/web` agar kompatibel penuh dengan lingkungan *Serverless*.
- **Firebase**: Terintegrasi untuk layanan penyimpanan gambar (Firebase Storage).

## Cara Menjalankan Proyek Secara Lokal

### 1. Kloning & Instalasi
Buka terminal di folder proyek ini dan instal semua *dependencies* yang dibutuhkan:
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Buat file bernama `.env` di *root* folder proyek Anda, lalu masukkan kredensial database Turso Anda:
```env
TURSO_DATABASE_URL="libsql://<NAMA_DB>-<USERNAME>.turso.io"
TURSO_AUTH_TOKEN="<TOKEN_RAHASIA_DARI_TURSO>"
```

### 3. Migrasi Database (Opsional jika tabel belum dibuat)
Untuk mencetak tabel database (seperti tabel *students*, *achievements*, dll) ke dalam Turso Anda:
```bash
npx drizzle-kit push
```

### 4. Jalankan Aplikasi
Jalankan perintah berikut untuk menyalakan Frontend dan Backend sekaligus:
```bash
npm run dev
```
Website akan dapat diakses di `http://localhost:5173/` dan API berjalan di `http://localhost:3000/`.

## Cara Deployment (Hosting) ke Vercel

1. Buat akun di [Vercel](https://vercel.com/) dan tautkan dengan repositori GitHub proyek ini.
2. Saat mengimpor proyek, pastikan Anda menambahkan pengaturan **Environment Variables** di layar Vercel:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
3. Vercel akan otomatis mengenali konfigurasi `vercel.json` dan membangun aplikasi *frontend* sekaligus mengubah folder `api` menjadi *Serverless Functions*.
4. Selesai! Website siap diakses secara publik.
