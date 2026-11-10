# HIZVENA — KEEP BECOMING.

Website layanan pendampingan akademik dan desain kreatif.

## Status
Repositori sumber untuk pengembangan dan publikasi Cloudflare Pages. Versi awal adalah **draft**. Jangan menghubungkan domain produksi sebelum tampilan, pencarian, dan pesan WhatsApp diuji.

## Hosting gratis
Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git → pilih `zry23/HIZVENA`.

Untuk website HTML statis, build command kosong dan output directory `/` (root). Hosting dan deploy mengikuti batas paket Free Cloudflare. Domain `pages.dev` tidak memerlukan pembelian domain.

## Identitas
- Brand: HIZVENA — KEEP BECOMING.
- WhatsApp: +62 851-6972-8694.
- Sapaan: Halo Kak Fazry, saya ingin konsultasi layanan HIZVENA.
- Warna utama: #0B1020, #7C5CFF, #35D6FF.

## Catatan data
Database lama HIZVENA sudah berhasil dipulihkan dari storage Floot ke folder `data/` sebagai 3 berkas `.json.gz`: 4.303 kampus (214 Negeri, 3.944 Swasta, dan kategori lain), 34.709 entri program studi, serta 2.014 entri mata kuliah UT. Ini indeks referensi historis, **bukan** daftar lengkap dan mutakhir seluruh perguruan tinggi Indonesia. Browser modern memakai `DecompressionStream('gzip')`; jika data gagal dimuat, pelanggan masih bisa mengisi manual. Formulir kini meminta nama pemesan, nomor WhatsApp, kampus, prodi, semester dan mata kuliah/topik, lalu meneruskan ringkasan ke WhatsApp admin. Foto hero natural saat ini direferensikan dari storage publik Floot sehingga perlu dipindahkan ke hosting mandiri di revisi berikutnya.

## Batasan
Tidak menampilkan komisi internal, nomor rekening, data pelanggan, testimoni fiktif, atau klaim afiliasi kampus. Konten akademik adalah konsultasi, review, dan latihan — bukan penggantian pengerjaan tugas/ujian.

## Pemeliharaan
Edit berkas melalui GitHub/ChatGPT, lakukan preview, lalu deploy melalui integrasi Cloudflare Pages setelah user menyetujui.