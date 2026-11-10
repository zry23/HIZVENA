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
Database lama HIZVENA sudah berhasil dipulihkan dari storage Floot ke folder `data/` sebagai 3 berkas `.json.gz`: 4.303 kampus (214 Negeri, 3.944 Swasta, dan kategori lain), 34.709 entri program studi, serta 2.014 entri mata kuliah UT. Ini indeks referensi historis, **bukan** daftar lengkap dan mutakhir seluruh perguruan tinggi Indonesia. Browser modern memakai `DecompressionStream('gzip')`; jika data gagal dimuat, pelanggan masih bisa mengisi manual. Formulir kini meminta nama pemesan, nomor WhatsApp, kampus, prodi, semester dan mata kuliah/topik, lalu meneruskan ringkasan ke WhatsApp admin. Foto hero natural sekarang disimpan mandiri di assets/hero-campus-natural.jpg dan favicon resmi di assets/hizvena-favicon.png.

## Batasan
Tidak menampilkan komisi internal, nomor rekening, data pelanggan, testimoni fiktif, atau klaim afiliasi kampus. Konten akademik adalah konsultasi, review, dan latihan — bukan penggantian pengerjaan tugas/ujian.

## Desain V4
Landing page memakai tema edtech premium, foto diskusi mahasiswa natural (sementara ditautkan dari penyimpanan Floot), navbar sticky, pita identitas brand, tiga manfaat, kartu jalur UT/PTN/PTS, pencarian yang terhubung ke dataset historis, form identitas pemesan, katalog, galeri testimoni kosong, FAQ dan CTA mobile. Berkas tambahan: `assets/design-v4.css`.

## Pemeliharaan
Edit berkas melalui GitHub/ChatGPT, lakukan preview, lalu deploy melalui integrasi Cloudflare Pages setelah user menyetujui.
## Pemeriksaan teknis — 10 November 2026
- CSS dan JS desain V5, foto, serta favicon tersedia pada repositori.
- JavaScript desain dan formulir lulus pemeriksaan sintaks Node.
- Data historis dipulihkan dan berhasil didekompresi: 4.303 kampus, 34.709 prodi, 2.014 entri matkul UT.
- Pola validasi nomor WhatsApp dan kewajiban kolom mata kuliah saat pindah jalur telah diperbaiki.
- Percobaan pengujian browser headless tidak berhasil, sehingga tampilan dan interaksi WA masih harus diuji pada preview Cloudflare.
- Jangan menayangkan data pelanggan atau catatan komisi internal di repo publik.
