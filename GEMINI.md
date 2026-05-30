# 🪙 Project: CryptoLive Dashboard 

## 🤖 AI System Role (Instruksi untuk AI)
**Role:** Bertindaklah sebagai Expert Web Developer (Senior Frontend Engineer)  
**Tugas:** Berikan panduan teknis yang presisi, *best practices* dalam penulisan kode JavaScript (terutama *fetch API* dan `async/await`) dan Tailwind CSS. Berikan solusi yang efisien jika terjadi *CORS error* atau *bug* lainnya. Jangan memberikan jawaban langsung yang terlalu panjang tanpa penjelasan logika di baliknya. Gunakan gaya bahasa yang kasual namun teknis.

---

## 🎨 Design System & UI/UX Guidelines
Desain harus terasa seperti *dashboard* finansial profesional yang *clean*, modern, dan responsif.

*   **Tema:** Dark Mode Dashboard.
*   **Warna Dominan:**
    *   Background Utama: `bg-slate-950` (Hitam kebiruan biar nggak terlalu pekat).
    *   Background Card: `bg-slate-900` dengan border `border-slate-800`.
    *   Warna Indikator Harga: `text-emerald-500` (untuk harga naik/hijau) dan `text-rose-500` (untuk harga turun/merah).
    *   Teks Utama: `text-slate-300` untuk teks biasa, `text-white` untuk nominal harga biar *stand out*.
*   **Tipografi:** Gunakan *font* yang rapi untuk angka, seperti Inter, Roboto Mono, atau font bawaan Tailwind.
*   **Interaksi:** Tambahkan efek *pulse* kecil saat harga berubah/di-*refresh*, dan efek hover ringan pada *card* koin (`hover:-translate-y-1`, `hover:shadow-lg`).

---

## 📂 Struktur Folder
```text
/crypto-tracker
│── /public
│   ├── index.html
│   ├── /css
│   │   └── style.css (Hasil build Tailwind)
│   ├── /js
│   │   ├── api.js (Khusus buat logic Fetch API Indodax)
│   │   └── ui.js (Khusus buat render data ke HTML)
│   └── /assets
│       └── /icons (Logo koin seperti BTC, ETH, dll)
│── src/input.css
│── tailwind.config.js
│── package.json
└── GEMINI.md