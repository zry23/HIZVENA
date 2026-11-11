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

## Pratinjau tujuh gambar per item (V13)

Tujuh item bernomor `testimoni-01` sampai `testimoni-07` sudah dimasukkan sebagai **catatan yang belum aktif** di `data/testimonials.json`. Berkas gambar hasil sensor telah disediakan dalam paket privat `HIZVENA_7_TESTIMONI_BLUR_TERPISAH.zip` kepada pengelola. File gambar **belum** disalin ke repository publik karena menunggu izin pihak terkait. Setelah mendapat izin, unggah berkas WebP per gambar ke `assets/testimonials/` dan ubah status item terkait menjadi `approved:true, published:true, privacyReviewed:true`. Ini bukan sistem unggah pada website, melainkan pengelolaan melalui GitHub.

Jenis dokumentasi: chat layanan (01, 02, 06), bukti nilai/umpan balik (03, 04, 05), progres layanan (07). Hasil nilai tidak boleh dipresentasikan sebagai jaminan pencapaian untuk pelanggan lain.
