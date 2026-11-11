# Galeri testimoni HIZVENA

Galeri sengaja **tidak tampil** jika belum ada testimoni dengan izin publikasi. Tujuh gambar yang diberikan belum diunggah ke repo publik karena berisi data pribadi dan belum ada konfirmasi persetujuan pelanggan.

## Cara menambahkan gambar setelah mendapat izin

1. Samarkan nama lengkap, foto profil, nomor telepon, ID akun, tautan berbagi unik, nomor rekening, nama pemilik rekening, ID transaksi dan informasi sensitif lain. Pertahankan substansi percakapan dan beri tahu pelanggan tentang publikasi.
2. Unggah versi yang disamarkan ke `assets/testimonials/` menggunakan menu **Add file → Upload files** di GitHub dengan akses pengelola yang sah. Jangan unggah versi mentah ke GitHub publik.
3. Edit `data/testimonials.json` melalui tombol pensil GitHub. Tambahkan entri semisal:

```json
{
  "id": "testimoni-001",
  "src": "./assets/testimonials/testimoni-001.webp",
  "title": "Pengalaman pelanggan HIZVENA",
  "caption": "Pendampingan akademik",
  "alt": "Screenshot percakapan pelanggan dengan data pribadi disamarkan",
  "order": 1,
  "approved": true,
  "privacyReviewed": true,
  "published": true
}
```

4. Ulangi untuk setiap gambar. Set `published:false` jika ingin menyembunyikannya tanpa menghapus file. Hapus entri untuk menghapus dari galeri.
5. Setelah commit, perubahan didistribusikan otomatis melalui Cloudflare yang tersambung ke branch `main`.

**Catatan:** Mengedit JSON melalui GitHub tidak mengubah kode aplikasi, tetapi ini **bukan panel admin upload dengan autentikasi khusus**. Pengelolaan melalui akun GitHub yang punya izin, dan histori commit pada repositori publik tetap dapat menyimpan file yang pernah diunggah. Jangan pernah mengunggah data mentah sensitif. Admin panel terpisah memerlukan backend dan sistem hak akses.
