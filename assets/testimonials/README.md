# HIZVENA — Galeri Testimoni

Folder ini digunakan untuk **gambar testimoni yang telah disensor dan mendapat izin publikasi**.

## Tujuh file yang perlu diunggah (satu per gambar)

- `testimoni-01.webp` — Chat konsultasi bank soal
- `testimoni-02.webp` — Chat respons pelanggan
- `testimoni-03.webp` — Dokumentasi hasil penilaian
- `testimoni-04.webp` — Umpan balik diskusi akademik
- `testimoni-05.webp` — Umpan balik forum
- `testimoni-06.webp` — Chat dokumentasi layanan
- `testimoni-07.webp` — Progres pendampingan

**Jangan mengunggah screenshot asli** yang menampilkan nama lengkap, foto profil, rekening, ID transaksi, atau tautan Drive unik. Di repositori publik, riwayat commit tetap dapat menyimpan versi sebelumnya meskipun file sudah diganti.

Setelah persetujuan diperoleh, unggah masing-masing file WebP hasil sensor dari paket `HIZVENA_7_TESTIMONI_BLUR_TERPISAH.zip` menggunakan GitHub `Add file → Upload files` pada folder ini. Pastikan tujuh file bernama persis seperti daftar di atas.

Untuk menayangkan galeri, ubah flags tiap entri pada `data/testimonials.json`: `approved: true`, `privacyReviewed: true`, `published: true`. **Jangan aktifkan flags sebelum ada izin dan semua berkas aman.** Galeri HIZVENA tidak muncul jika tidak ada entri yang telah disetujui.
