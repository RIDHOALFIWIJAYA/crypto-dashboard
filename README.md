# 🪙 CryptoLive Dashboard

Dashboard pemantau harga cryptocurrency real-time yang mengambil data langsung dari **Indodax API**. Didesain dengan estetika modern, profesional, dan performa tinggi menggunakan Vanilla JavaScript dan Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Tailwind](https://img.shields.io/badge/style-Tailwind_CSS-38B2AC.svg)

## 🚀 Fitur Utama
- **Real-time Updates:** Data harga diperbarui otomatis setiap 30 detik.
- **Modern Dark UI:** Menggunakan palet warna `Slate-950` untuk kenyamanan visual (Dashboard finansial look).
- **Smart CORS Handling:** Menggunakan strategi multi-proxy (AllOrigins & CORSProxy.io) untuk memastikan data tetap muncul meski ada batasan CORS di browser.
- **Price Indicators:** Efek animasi *pulse* dan indikator warna (hijau/merah) saat terjadi perubahan harga.
- **Responsive Design:** Tampilan optimal di berbagai ukuran layar (Mobile, Tablet, Desktop).

## 🛠️ Tech Stack
- **Frontend:** HTML5, Vanilla JavaScript (ES6+).
- **Styling:** Tailwind CSS v3.
- **API:** Indodax Public API.
- **Proxy:** AllOrigins & CORSProxy.io (Fallback).

## 📂 Struktur Folder
```text
/crypto-tracker
│── /public
│   ├── index.html     # Main Layout
│   ├── /css
│   │   └── style.css  # Compiled Tailwind CSS
│   └── /js
│       ├── api.js     # Fetch API & Proxy Logic
│       └── ui.js      # Rendering & UI Interaction
│── /src
│   └── input.css      # Tailwind Directives & Custom Components
│── tailwind.config.js # Tailwind Configuration
│── package.json       # Project Scripts & Dependencies
└── README.md
```

## ⚙️ Cara Menjalankan Secara Lokal

1. **Clone Repositori**
   ```bash
   git clone https://github.com/username/crypto-tracker.git
   cd crypto-tracker
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Build Tailwind CSS**
   Jika kamu melakukan perubahan pada styling, jalankan build script:
   ```bash
   npm run build:css
   ```

4. **Jalankan Server**
   Gunakan server lokal untuk menghindari isu pathing:
   ```bash
   npm start
   ```
   Buka `http://localhost:3000` di browser kamu.

## 📝 Catatan Pengembang
Proyek ini dibangun dengan fokus pada kemudahan penggunaan dan ketahanan terhadap error network. Logika di `api.js` dirancang untuk mencoba koneksi langsung terlebih dahulu sebelum beralih ke proxy server jika terdeteksi adanya blokir CORS oleh browser.

## 📄 Lisensi
Distributed under the MIT License. Lihat `LICENSE` untuk informasi lebih lanjut.

---
Built with ❤️ by [RIdho Alfi]
