# Sistem Manajemen Armada - Transjakarta

Proyek ini adalah aplikasi frontend manajemen armada yang dikembangkan sebagai bagian dari Tes Teknis Frontend Engineer. Aplikasi ini memungkinkan pengguna untuk memantau data kendaraan secara _real-time_ melalui integrasi dengan MBTA API.

## Fitur Utama

- **Dashboard Kendaraan Real-time**: Menampilkan daftar armada dalam bentuk kartu (_grid layout_) dengan data yang diperbarui setiap 20 detik.
- **Paginasi Dinamis**: Navigasi data yang efisien dengan kontrol jumlah data per halaman (load more button).
- **Filter Canggih**:
  - Filter berdasarkan Rute dan Trip dengan pemilihan ganda (_multiple selection_).
  - Implementasi Infinite Scroll / Lazy Load pada dropdown filter untuk performa optimal.
  - Auto-reset pagination ketika filter berubah.

- **Detail Kendaraan (Interactive Popup)**:
  - Informasi mendalam: status, koordinat GPS, waktu pembaruan terakhir.
  - Rute yang sedang dijalankan dan tujuan berikutnya (headsign).
  - ID kendaraan dan update timestamp.

- **Visualisasi Peta Interaktif**:
  - Integrasi dengan Leaflet untuk melihat posisi kendaraan secara real-time.
  - Marker berwarna sesuai dengan rute.
  - Auto-bounds: peta otomatis menyesuaikan zoom dan center ke semua kendaraan.
  - Recenter button untuk kemudahan pengguna.
  - Click-to-fly: klik marker untuk smooth animation ke lokasi.
  - Dilengkapi dengan _loading indicator_ dan penanganan error yang user-friendly.

---

## Teknologi yang Digunakan

- **React.JS**: Library utama untuk pembangunan antarmuka.
- **TypeScript**: Menjamin kualitas kode dengan _static typing_.
- **Tailwind CSS**: Untuk styling yang modern, responsif, dan cepat.
- **Leaflet & React-Leaflet**: Library pemetaan untuk menampilkan lokasi kendaraan.
- **Fetch API**: Untuk pengambilan data dari REST API MBTA.

---

## Sumber Data

Aplikasi ini mengintegrasikan dengan **MBTA API v3** (Massachusetts Bay Transportation Authority) untuk mendapatkan data kendaraan real-time:

- **Base URL**: `https://api-v3.mbta.com`
- **Data yang diambil**: Vehicles, Routes, Trips, Stops dengan filter dinamis
- **Update Interval**: 20 detik (auto-refresh)
- **Dokumentasi**: [MBTA API v3 Docs](https://api-v3.mbta.com/docs/swagger/index.html)

---

## Arsitektur Proyek

Aplikasi ini dibangun menggunakan **Vite** sebagai build tool. Struktur proyek diatur secara modular untuk memisahkan logika bisnis, antarmuka pengguna, dan integrasi API:

```text
transjakarta-fleet-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FleetMap.tsx      # Leaflet map visualization
│   │   └── VehicleCard.tsx   # Individual vehicle card display
│   ├── hooks/
│   │   ├── useVehicles.ts    # Vehicle data fetching & filtering
│   │   ├── useRoutes.ts      # Route data with pagination
│   │   └── useTrips.ts       # Trip data with deduplication
│   ├── services/
│   │   └── api.ts            # MBTA API client
│   ├── types/
│   │   └── mbta.ts           # MBTA API types
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .env
├── .env.example
├── eslint.config.js
├── index.html
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── package.json
```

---

## Setup & Instalasi

### Prasyarat

- **Node.js** 18+
- **npm** 10+

### Langkah Instalasi

1. **Clone repositori:**

```bash
git clone https://github.com/AuliaFHanif/Sistem-Manajemen-Armada.git
cd transjakarta-fleet-dashboard
```

2. **Instal dependensi:**

```bash
npm install
```

3. **Setup Environment Variables:**

```bash
# Buat file .env (atau copy dari .env.example)
cp .env.example .env
```

Konfigurasi `.env`:

```env
VITE_MBTA_API_URL=https://api-v3.mbta.com
```

### Menjalankan Aplikasi

**Development Mode:**

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

**Build untuk Production:**

```bash
npm run build
```

**Preview Production Build:**

```bash
npm run preview
```

**Lint & Quality Check:**

```bash
npm run lint
```

---

## Konvensi Pengembangan

- **Naming Convention**:
  - Components: PascalCase (e.g., `FleetMap`, `VehicleCard`)
  - Hooks: camelCase dengan prefix `use` (e.g., `useVehicles`, `useRoutes`)
  - Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_CENTER`)
  - File names: Match component/function names

---

## Troubleshooting

### Port 5173 sudah digunakan

Jika port 5173 sudah digunakan, Vite akan otomatis menggunakan port berikutnya (5174, 5175, dll).

### CORS Error atau API tidak merespons

- Pastikan URL API di `.env` sudah benar: `https://api-v3.mbta.com`
- Periksa koneksi internet
- API mungkin down atau rate-limited; coba refresh halaman setelah beberapa saat

### Build error dengan TypeScript

```bash
# Clear cache dan coba build lagi
npm run build -- --force
```

### Marker di map tidak muncul

- Pastikan browser mendukung JavaScript
- Cek console untuk error messages
- Clear cache browser dan reload

---

## Resources & Links

- **Documentation**:
  - [React 19 Docs](https://react.dev)
  - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
  - [Vite Guide](https://vitejs.dev/guide/)
  - [Tailwind CSS](https://tailwindcss.com)
  - [Leaflet Documentation](https://leafletjs.com)
  - [MBTA API Docs](https://api-v3.mbta.com/docs/swagger/index.html)

---
