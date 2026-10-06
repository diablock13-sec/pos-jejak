# Pos Jejak: Seusiamu di Tahun 1947

Web app interaktif (tanpa instal aplikasi) yang membawa kisah Tentara Pelajar (TRIP) Malang ke layar warga lewat **peta berlapis waktu**, **AR via link/QR**, dan **tiga minigame**. Dibuat untuk lomba esai/karya sejarah digital (KT26) dengan objek Monumen Pahlawan TRIP, Malang.

> **Instruksi untuk Claude:** Baca seluruh README ini, lalu bangun proyek sesuai spesifikasi. Ikuti bagian **Aturan Wajib** tanpa pengecualian. Kerjakan sesuai **Urutan Pengerjaan** di bagian paling bawah, satu tahap per giliran, dan berhenti setiap tahap selesai untuk menunggu konfirmasi.

---

## 1. Aturan Wajib (jangan dilanggar)

1. **Jangan mengarang fakta sejarah.** Semua tanggal, nama, lokasi pertempuran, tahun pembangunan monumen, isi prasasti, dan isi sumber harus berupa placeholder `"TODO_VERIFIKASI"` di file data. Pengguna akan mengisinya dari sumber yang sudah diverifikasi.
2. **Setiap klaim sejarah yang tampil di layar wajib menampilkan sumbernya** (komponen `SourceTag`). Jika field `sumber` kosong atau `TODO_VERIFIKASI`, tampilkan badge peringatan "Belum diverifikasi" (hanya mode pengembangan; sembunyikan di mode produksi lewat `config.json`).
3. **Maskot adalah tokoh rekaan.** Selalu tampilkan label **"Tokoh rekaan, terinspirasi dari kisah nyata para pelajar"** di dekat maskot. Maskot hanya memandu (instruksi dan transisi), tidak menyampaikan klaim sejarah tanpa `SourceTag`.
4. **Keselamatan.** Tampilkan layar peringatan sebelum game dimulai (lihat bagian 8). Jangan ada fitur yang mendorong pengguna mendekati jalan raya.
5. **Tanpa backend, tanpa akun, tanpa pelacakan.** Semua progres disimpan di `localStorage`. Tidak ada analytics pihak ketiga.
6. **Mobile-first** (target layar 360 px ke atas), bisa dipakai satu tangan, teks minimal 16 px, kontras tinggi.
7. **Bahasa antarmuka: Bahasa Indonesia** yang ramah untuk pelajar SMA.

## 2. Teknologi

- **HTML + CSS + JavaScript murni (ES modules), tanpa build step**, supaya bisa langsung di-host di GitHub Pages atau Netlify.
- **Peta:** [Leaflet](https://leafletjs.com/) dengan ubin OpenStreetMap, ditambah `L.imageOverlay` untuk peta lama 1947 dan slider transparansi.
- **AR dan 3D:** [`<model-viewer>`](https://modelviewer.dev/) (Google) dengan atribut `ar`, memakai file `.glb`. Jika perangkat tidak mendukung AR, otomatis jatuh ke tampilan 3D yang bisa diputar.
- **Kamera (Game 3):** `<input type="file" accept="image/*" capture="environment">` (paling kompatibel, tanpa izin kamera khusus).
- Library dimuat dari CDN dengan versi dipatok (pinned). Tidak memakai framework.

## 3. Struktur Folder

```
pos-jejak/
├── index.html              # beranda + peringatan keselamatan + menu
├── css/
│   └── style.css
├── js/
│   ├── app.js              # router sederhana (hash-based), state, localStorage
│   ├── components.js       # SourceTag, MascotBubble, ArchiveCard, Toast
│   ├── map.js              # peta berlapis waktu (dipakai Game 1 dan halaman Peta)
│   ├── game1-jejak-kurir.js
│   ├── game2-meja-sejarawan.js
│   ├── game3-warga-penjaga.js
│   └── surat.js            # "Surat dari 1947"
├── data/
│   ├── config.json         # mode dev/prod, kontak laporan, judul
│   ├── monumen.json        # data objek (placeholder)
│   ├── game1.json          # simpul rute dan petunjuk
│   ├── game2.json          # sumber-sumber dan pertanyaan
│   ├── game3.json          # daftar periksa
│   ├── arsip.json          # 3 keping arsip
│   └── surat.json          # isi Surat dari 1947
├── assets/
│   ├── models/monumen.glb          # placeholder, diganti pengguna
│   ├── maps/malang-1947.jpg        # placeholder, diganti pengguna
│   ├── maps/malang-1947.bounds.json
│   └── img/ (maskot.svg, poster-ar.jpg, ikon)
└── README.md
```

Jika file aset belum ada, buat **placeholder yang valid** (SVG/gambar sederhana) agar aplikasi tetap berjalan, dan tulis daftar aset yang perlu diganti pengguna di `ASET_TODO.md`.

## 4. Alur Pengguna

1. Pengguna memindai QR di Pos Jejak lalu membuka `index.html`.
2. Layar **peringatan keselamatan** (wajib dicentang "Saya mengerti" sebelum lanjut).
3. **Beranda:** judul, sapaan maskot, tiga kartu game, tombol "Lihat Monumen (AR/3D)", tombol "Peta Waktu", dan penunjuk progres keping arsip (0/3).
4. Pengguna memainkan game dalam urutan bebas. Setiap game selesai memberi **satu keping arsip**.
5. Setelah 3 keping terkumpul, tombol **"Surat dari 1947"** terbuka.
6. Versi "dari rumah": semua fitur kecuali foto lapangan Game 3 tetap bisa dipakai tanpa berada di lokasi (Game 3 menyediakan mode "pakai foto contoh dari arsip" bila `config.json` mengaktifkannya).

## 5. Spesifikasi Fitur

### 5.1 Halaman Monumen (AR/3D)
- Komponen `<model-viewer src="assets/models/monumen.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="assets/img/poster-ar.jpg">`.
- Di bawahnya: deskripsi singkat dari `monumen.json` (semua dengan `SourceTag`).
- Teks bantuan: "Tidak perlu menyeberang. Dekati monumen lewat layar ini."

### 5.2 Peta Berlapis Waktu (`map.js`)
- Dua lapisan: **Sekarang** (OSM) dan **1947** (`imageOverlay` dengan `bounds` dari `malang-1947.bounds.json`).
- Kontrol: toggle 1947/Sekarang dan **slider transparansi** untuk membandingkan.
- Penanda: lokasi monumen dan titik aman Pos Jejak (koordinat dari `monumen.json`, placeholder `null`; jika `null`, tampilkan pesan "Koordinat belum diisi").
- Setiap peta lama wajib menampilkan keterangan sumber di pojok peta.

### 5.3 Game 1: Jejak Kurir (melatih membaca ruang)
- **Tujuan belajar:** memahami mengapa lokasi penting dan bagaimana geografi kota memengaruhi perjuangan.
- Pemain jadi kurir pelajar yang mengantar pesan dari titik A ke titik B di peta Malang 1947 (memakai `map.js`).
- Rute berbasis **graf simpul** dari `game1.json`: pemain memilih simpul berikutnya yang terhubung. Tiap simpul menyediakan **petunjuk dari sumber** (misalnya jalan dijaga, posisi pos) lengkap dengan `SourceTag`.
- 3 ronde dengan petunjuk berbeda. Pemain bisa membuka/menutup panel petunjuk.
- Hasil ronde: "Pesan sampai" atau "Pesan tertahan", diikuti **penjelasan berbasis sumber** tentang pilihan rute (tidak ada hukuman, pemain boleh mengulang).
- Selesai ronde ke-3: dapat **keping arsip #1**.
- Skema `game1.json`:
```json
{
  "ronde": [
    {
      "id": "r1",
      "misi": "TODO_VERIFIKASI",
      "mulai": "n1",
      "tujuan": "n4",
      "simpul": [
        {
          "id": "n1",
          "nama": "TODO_VERIFIKASI",
          "lat": null,
          "lng": null,
          "terhubung": ["n2", "n3"],
          "petunjuk": { "teks": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" },
          "aman": true
        }
      ],
      "penjelasan": { "teks": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" }
    }
  ]
}
```

### 5.4 Game 2: Meja Sejarawan (melatih verifikasi sumber)
- **Tujuan belajar:** cara berpikir historis, bukan menghafal.
- Pemain menerima **4 kartu sumber** yang sengaja tidak sepenuhnya cocok (jenis: prasasti monumen, kesaksian lisan, koran Belanda 1947, buku).
- Satu **pertanyaan sejarah** ditampilkan (contoh bentuk: "Kapan dan di mana peristiwa ini terjadi?", isi final dari pengguna).
- Setiap kartu menampilkan: jenis sumber, penulis/pembuat, tahun, sudut pandang, dan kutipan klaim.
- Tugas pemain, dalam dua langkah:
  1. **Urutkan** keempat sumber dari paling kuat ke paling lemah untuk pertanyaan itu.
  2. Jawab **daftar pertanyaan kritis** per sumber (centang): dekat dengan waktu kejadian? penulis saksi langsung? ada kepentingan tertentu? cocok dengan sumber lain?
- Umpan balik: tampilkan **penalaran yang disarankan** (bukan satu jawaban mutlak) dan pesan bahwa tidak ada sumber yang sempurna. Bandingkan urutan pemain dengan urutan rujukan, jelaskan perbedaannya dengan sopan.
- Selesai: **keping arsip #2**.
- Skema `game2.json`:
```json
{
  "pertanyaan": "TODO_VERIFIKASI",
  "sumber": [
    {
      "id": "s1",
      "jenis": "prasasti | lisan | koran | buku",
      "judul": "TODO_VERIFIKASI",
      "pembuat": "TODO_VERIFIKASI",
      "tahun": "TODO_VERIFIKASI",
      "sudutPandang": "TODO_VERIFIKASI",
      "klaim": "TODO_VERIFIKASI",
      "rujukan": "TODO_VERIFIKASI"
    }
  ],
  "urutanRujukan": ["s1", "s2", "s3", "s4"],
  "penalaran": "TODO_VERIFIKASI"
}
```

### 5.5 Game 3: Warga Penjaga (pelestarian dan kondisi terkini)
- **Tujuan belajar:** pelestarian dan tantangan kontemporer; dampak nyata.
- Pemain mengambil foto monumen dari **3 sudut** (depan, samping, detail prasasti) lewat input kamera. Foto hanya ditampilkan sebagai pratinjau di perangkat dan **tidak diunggah ke server**.
- Lalu mengisi **daftar periksa** dari `game3.json`: kondisi cat, keterbacaan prasasti, kebersihan, vandalisme, kejelasan papan informasi. Tiap butir: `Baik / Cukup / Perlu perhatian` + catatan opsional.
- Hasil: ringkasan laporan teks. Tombol **"Kirim ke pengelola"** membuat tautan `mailto:` atau `wa.me` dengan isi laporan (kontak dari `config.json`). Beri petunjuk bahwa foto dilampirkan manual oleh pengguna.
- Peringatan privasi: "Jangan memotret wajah orang atau pelat kendaraan."
- Peringatan keselamatan di layar ini: "Ambil foto dari trotoar atau titik aman. Jangan masuk ke badan jalan."
- Selesai (minimal 3 foto dan seluruh daftar terisi): **keping arsip #3**.

### 5.6 Keping Arsip dan Surat dari 1947
- Tiap keping (`arsip.json`): gambar/dokumen asli, **keterangan**, **sumber**, dan **hak cipta/lisensi** (placeholder `TODO_VERIFIKASI`).
- Keping tampil di galeri beranda; yang belum didapat berupa siluet terkunci.
- **Surat dari 1947** (`surat.json`): ringkasan naratif berbasis sumber nyata, tiap paragraf punya `SourceTag`. Gaya bahasa personal ("seusiamu di tahun 1947") tanpa menambah fakta di luar sumber.

## 6. Data Objek (`monumen.json`)

```json
{
  "nama": "Monumen Pahlawan TRIP",
  "kota": "Malang",
  "lat": null,
  "lng": null,
  "titikAmanPosJejak": { "deskripsi": "TODO_VERIFIKASI", "lat": null, "lng": null },
  "tahunPembangunan": { "nilai": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" },
  "prasasti": { "teks": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" },
  "deskripsiFisik": { "teks": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" },
  "kondisiSekarang": { "teks": "TODO_VERIFIKASI", "sumber": "TODO_VERIFIKASI" }
}
```

## 7. Desain Visual

- Nuansa **arsip/kertas tua modern**: latar krem hangat, teks cokelat tua/hitam, aksen merah-putih secukupnya. Boleh efek tekstur kertas ringan lewat CSS.
- Tipografi: judul serif (misalnya Playfair Display atau Lora), isi sans-serif mudah dibaca (misalnya Inter atau Nunito). Sediakan fallback.
- Maskot: kurir pelajar fiktif berbentuk ilustrasi SVG sederhana, muncul sebagai balon dialog singkat. Maskot tidak mengenakan atribut yang menyerupai tokoh nyata tertentu.
- Tombol besar, jarak sentuh minimal 44 px, status fokus jelas, dukungan `prefers-reduced-motion`.
- Mendukung tema terang; tema gelap opsional.

## 8. Keselamatan (wajib tampil di layar pembuka)

Teks minimal:
- Jangan memindai atau memainkan game ini dari atas kendaraan.
- Jangan menggunakan ponsel saat menyeberang jalan.
- Gunakan hanya di trotoar lebar, halte, taman, atau titik aman Pos Jejak.
- Tidak perlu mendekati monumen: gunakan mode AR/3D di layar.

Pengguna harus mencentang "Saya mengerti" sebelum tombol "Mulai" aktif. Status centang disimpan di `localStorage` namun peringatan tetap muncul singkat tiap sesi baru.

## 9. Kriteria Penerimaan (Definition of Done)

- [ ] Berjalan penuh saat dibuka lewat server statis lokal (`python -m http.server`) tanpa error di konsol.
- [ ] Semua teks sejarah bersumber dari file `data/*.json`, tidak ada fakta yang di-hardcode di JS atau HTML.
- [ ] Semua field fakta berisi `TODO_VERIFIKASI` sampai diisi pengguna; badge "Belum diverifikasi" muncul di mode dev.
- [ ] Tiga game dapat diselesaikan dan masing-masing memberi satu keping arsip.
- [ ] Surat dari 1947 terbuka hanya setelah 3 keping terkumpul; progres bertahan setelah halaman dimuat ulang.
- [ ] Peringatan keselamatan dan label "tokoh rekaan" selalu tampil sesuai aturan.
- [ ] Lighthouse mobile: Accessibility minimal 90.
- [ ] Tampilan nyaman pada lebar 360 px dan 412 px.
- [ ] `ASET_TODO.md` berisi daftar aset dan data yang harus diganti pengguna.

## 10. Deploy

1. Dorong folder ke repositori GitHub, aktifkan GitHub Pages (atau seret folder ke Netlify).
2. Buat QR dari URL final, lalu cetak untuk papan Pos Jejak (pasang hanya di titik aman).
3. Jalankan uji coba di setidaknya satu perangkat Android dan satu iOS (AR berperilaku berbeda).

## 11. Urutan Pengerjaan (satu tahap per giliran)

1. **Kerangka:** struktur folder, `index.html`, router, `localStorage`, peringatan keselamatan, beranda, komponen `SourceTag` dan `MascotBubble`, data placeholder.
2. **Halaman Monumen (AR/3D) dan Peta Waktu.**
3. **Game 1: Jejak Kurir.**
4. **Game 2: Meja Sejarawan.**
5. **Game 3: Warga Penjaga.**
6. **Keping arsip, Surat dari 1947, dan poles tampilan.**
7. **Pengujian, `ASET_TODO.md`, dan panduan deploy.**

Setelah tiap tahap, ringkas apa yang sudah dibuat dalam beberapa kalimat, lalu berhenti dan tunggu konfirmasi sebelum lanjut.
