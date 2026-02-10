# Sistem Manajemen Armada - Transjakarta

Proyek ini adalah aplikasi frontend manajemen armada yang dikembangkan sebagai bagian dari Tes Teknis Frontend Engineer. Aplikasi ini memungkinkan pengguna untuk memantau data kendaraan secara *real-time* melalui integrasi dengan MBTA API.

## Fitur Utama

* **Dashboard Kendaraan**: Menampilkan daftar armada dalam bentuk kartu (*grid layout*) yang informatif.
* **Paginasi**: Navigasi data yang efisien dengan kontrol jumlah data per halaman.
* **Filter Canggih**:
* Filter berdasarkan **Rute** dan **Trip**.
* Mendukung pemilihan ganda (*multiple selection*).
* Implementasi **Infinite Scroll / Lazy Load** pada *dropdown* filter untuk performa optimal.


* **Detail Kendaraan (Popup)**:
* Informasi mendalam mengenai status, koordinat, dan waktu pembaruan terakhir.
* **Visualisasi Peta**: Integrasi dengan Leaflet untuk melihat posisi kendaraan secara visual.


* **Responsif & Informatif**: Dilengkapi dengan *loading indicator* dan penanganan pesan error yang ramah pengguna.
* **TypeScript**: Seluruh kode ditulis menggunakan TypeScript untuk keamanan tipe data dan skalabilitas.

---

## Teknologi yang Digunakan

* **React.JS**: Library utama untuk pembangunan antarmuka.
* **TypeScript**: Menjamin kualitas kode dengan *static typing*.
* **Tailwind CSS**: Untuk styling yang modern, responsif, dan cepat.
* **Leaflet & React-Leaflet**: Library pemetaan untuk menampilkan lokasi kendaraan.
* **Fetch API**: Untuk pengambilan data dari REST API MBTA.

---

## Arsitektur Proyek

Aplikasi ini dibangun menggunakan Vite. Struktur proyek diatur secara modular untuk memisahkan logika bisnis, antarmuka pengguna, dan integrasi API:

```text
transjakarta-fleet-dashboard/
├── public/             
├── src/
│   ├── assets/         
│   ├── components/     
│   ├── hooks/          
│   ├── services/       
│   ├── types/          
│   ├── utils/         
│   ├── App.tsx         
│   ├── main.tsx        
├── index.html          
├── tsconfig.json      
└── vite.config.ts     

```

---

## Cara Menjalankan Aplikasi

1. **Clone repositori:**
```bash
git clone https://github.com/AuliaFHanif/Sistem-Manajemen-Armada.git
cd transjakarta-fleet-dashboard

```


2. **Instal dependensi:**
```bash
npm install

```


3. **Jalankan aplikasi secara lokal:**
```bash
npm run dev

```


Buka [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) di browser Anda.

---


