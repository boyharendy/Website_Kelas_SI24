Berikut adalah draf **Product Requirements Document (PRD)** yang dirancang khusus untuk pengembangan landing page website kelas.

Dokumen ini disusun agar terstruktur, mencakup semua elemen yang diminta, dan siap dieksekusi dari sisi desain UI/UX maupun pengembangan teknis.

---

## **Product Requirements Document (PRD): Landing Page Website Kelas**

**Nama Proyek:** Landing Page Website Kelas (Sistem Informasi)
**Fase:** V1.0 (MVP)
**Platform:** Web (Responsive: Desktop & Mobile)

### **1. Ringkasan Proyek (Executive Summary)**

Proyek ini bertujuan untuk membangun sebuah *landing page* interaktif yang berfungsi sebagai wajah digital dan arsip memori kelas. Website ini akan menonjolkan identitas kelas, merayakan pencapaian bersama, menampilkan profil 57 anggota kelas, serta menyediakan ruang interaktif melalui fitur komentar/buku tamu.

### **2. Tujuan Utama (Goals)**

* Membangun *digital presence* kelas yang profesional namun tetap personal.
* Mendokumentasikan memori, aktivitas, dan prestasi kelas dalam satu platform yang mudah diakses.
* Memfasilitasi interaksi antar-anggota kelas dan pengunjung (dosen/alumni/umum) melalui sistem komentar *real-time*.

---

### **3. Kebutuhan Fitur & Struktur Halaman (Page Structure)**

Struktur *landing page* akan menggunakan pendekatan *single-page scroll* dengan navigasi *sticky header*.

#### **A. Section 1: Hero / Pembuka (First Impression)**

* **Pentingnya Pembuka:** Bagian pembuka adalah elemen paling krusial karena menentukan *bounce rate* (apakah pengunjung akan lanjut *scroll* atau keluar). Pembuka harus langsung mengomunikasikan identitas (Siapa kita?) dan *vibe* kelas (Kompak, berprestasi, kreatif).
* **Kebutuhan Elemen:**
* *Headline* besar dan menarik (contoh: nama angkatan/kelas atau *tagline* khas kelas).
* *Sub-headline* yang menjelaskan program studi dan tahun angkatan.
* *Background* visual kualitas tinggi (foto angkatan terbaik atau *hero video loop* kegiatan kampus).
* Tombol *Call-to-Action* (CTA) utama, misalnya: "Kenalan dengan Kami" yang mengarah langsung ke sesi Profil Mahasiswa.



#### **B. Section 2: Papan Prestasi (Achievements)**

* **Tujuan:** Membangun kredibilitas dan kebanggaan kelas.
* **Kebutuhan Elemen:**
* Sistem *card* atau *carousel* untuk menampilkan prestasi.
* Setiap *card* memuat: Judul kompetisi/pencapaian, nama perwakilan/tim, tingkat (kampus/nasional), dan foto medali/sertifikat/dokumentasi kemenangan.
* *Counter stat* animasi (opsional): Total proyek selesai, total penghargaan, atau rata-rata IPK kelas (jika disepakati).



#### **C. Section 3: Direktori Mahasiswa (57 Anggota)**

* **Tujuan:** Menampilkan seluruh anggota kelas secara adil dan terstruktur.
* **Kebutuhan Elemen:**
* *Grid Layout* responsif. Karena jumlahnya spesifik **57 orang**, disarankan menggunakan grid yang fleksibel (misal: 4 kolom di desktop, 2 kolom di tablet, 1 kolom di mobile) agar tetap rapi.
* **Fitur Pencarian & Filter:** Mengingat ada 57 data, wajib ada *search bar* (berdasarkan nama) untuk memudahkan pencarian.
* *Card Mahasiswa:* Berisi foto profil yang seragam (misal: pasfoto dengan *background* senada atau gaya bebas yang tematik), Nama Lengkap, dan NIM/NIM singkatan.
* *Hover Effect:* Saat foto di-klik atau di-*hover*, bisa memunculkan media sosial (Instagram/LinkedIn/GitHub) atau *quote* singkat dari mahasiswa tersebut.



#### **D. Section 4: Galeri Memori (Gallery)**

* **Tujuan:** Arsip visual kegiatan belajar, kerja kelompok, hingga momen non-akademik di dalam dan luar kampus.
* **Kebutuhan Elemen:**
* *Masonry Grid* (tata letak ala Pinterest) agar foto vertikal dan horizontal bisa bercampur dengan estetis.
* Fitur *Lightbox*: Gambar akan membesar saat di-klik (*zoom in*) tanpa harus pindah halaman.
* Kategori filter opsional (Akademik, Nongkrong, Proyek Kampus).



#### **E. Section 5: Buku Tamu & Komentar (Interactive Section)**

* **Tujuan:** Memberikan ruang diskusi atau wadah untuk meninggalkan pesan/kesan bagi kelas.
* **Kebutuhan Elemen:**
* Formulir input sederhana: Nama (Opsional/Anonim) dan Isi Pesan.
* Sistem validasi untuk mencegah *spam* (teks kosong).
* Daftar *feed* komentar terbaru yang bergulir (*scrollable container*).
* Menampilkan *timestamp* (waktu komentar dikirim).



---

### **4. Spesifikasi Teknis yang Direkomendasikan (Tech Stack)**

Untuk memastikan website berjalan cepat, interaktif, dan mudah di-*maintain*, berikut adalah tumpukan teknologi (*tech stack*) yang ideal untuk struktur PRD ini:

| Komponen | Teknologi | Alasan |
| --- | --- | --- |
| **Front-End Framework** | React / Next.js | Sangat optimal untuk merender *grid* 56 mahasiswa dan manajemen *state* filter pencarian dengan mulus. |
| **Styling** | Tailwind CSS | Memudahkan pembuatan UI yang responsif secara cepat, terutama untuk *Grid Layout* dan *Masonry Gallery*. |
| **Database & Backend** | Firebase (Firestore) | Sangat cocok untuk fitur Komentar/Buku Tamu agar pesan bisa muncul secara *real-time* tanpa perlu sering-*refresh* halaman. |
| **Hosting / Deployment** | Vercel / Netlify | Integrasi langsung dengan repositori GitHub untuk *deployment* berkelanjutan yang mulus. |

---

### **5. Metrik Kesuksesan (Success Metrics)**

1. **Performa (Lighthouse Score):** Waktu muat (*load time*) di bawah 3 detik, terutama karena memuat minimal 57 gambar resolusi baik di *section* mahasiswa dan galeri.
2. **Fungsi Komentar:** Fitur *real-time database* berjalan tanpa hambatan dan mampu menampung input pengguna.
3. **Responsivitas:** *Grid* 56 mahasiswa tidak pecah saat diakses melalui perangkat *mobile*.