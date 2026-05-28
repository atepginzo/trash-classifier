# 🌱 TrashSmart - Sistem Klasifikasi Sampah Berbasis AI

![TrashSmart Banner](https://img.shields.io/badge/TrashSmart-AI%20Waste%20Classification-059669?style=for-the-badge&logo=leaflet)
![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> **Coding Camp DBS Foundation 2026 • CC26-PSU179**

TrashSmart adalah aplikasi web berbasis AI untuk klasifikasi sampah otomatis menggunakan teknologi Computer Vision dan Machine Learning. Aplikasi ini membantu pengelolaan limbah yang lebih efisien dan berkelanjutan dengan fitur deteksi real-time, prediksi volume sampah, dan navigasi ke TPS terdekat.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [API Documentation](#-api-documentation)
- [Kontribusi](#-kontribusi)
- [Tim Pengembang](#-tim-pengembang)
- [Changelog](#-changelog)
- [License](#-license)

---

## ✨ Fitur Utama

### 🤖 **AI-Powered Classification**
- **Akurasi 95.18%** menggunakan model CNN Advanced V2
- Deteksi **3 kategori sampah**: Organik, Plastik, Kertas
- Waktu deteksi **< 3 detik**
- Upload foto atau scan langsung via kamera

### 📊 **Prediksi Volume Sampah (LSTM)**
- Prediksi volume sampah 3 bulan ke depan
- Model LSTM dengan data historis 12 bulan
- Visualisasi grafik interaktif
- Akurasi prediksi tinggi untuk perencanaan TPS

### 🗺️ **Peta TPS Interaktif** ⭐ **NEW!**
- **100+ TPS** di Bandung Raya dengan Leaflet Maps
- Filter berdasarkan area: Urban, Semi-Urban, Rural
- **Fitur Navigasi Real-time** dengan OSRM API:
  - Rute otomatis dari lokasi user ke TPS
  - Estimasi jarak (km) dan waktu tempuh (menit)
  - Polyline biru di peta dengan marker lokasi user
  - Panel navigasi floating responsive
- Prediksi volume per TPS

### 🎨 **Modern UI/UX**
- **Dark Mode & Light Mode** dengan transisi smooth
- Fully responsive (Mobile, Tablet, Desktop)
- Glassmorphism & modern animations
- Accessibility compliant (WCAG 2.1)

### 📱 **Progressive Web App (PWA)**
- Installable di mobile & desktop
- Offline-ready dengan service worker
- Fast loading dengan code splitting

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 18** + Vite
- 🎨 **Tailwind CSS** + Framer Motion
- 🗺️ **Leaflet** + React-Leaflet (Maps)
- 🧭 **OSRM API** (Routing & Navigation)
- 🌐 **React Router** (SPA Navigation)
- 🎭 **Lucide Icons**

### **Backend**
- 🟢 **Node.js** + Express.js
- 🗄️ **PostgreSQL** + Prisma ORM
- 🤖 **TensorFlow.js** (AI Model Inference)
- 🔐 **JWT** Authentication
- 📦 **Multer** (File Upload)

### **AI/ML**
- 🧠 **CNN Model** (Keras/TensorFlow)
- 📈 **LSTM Model** (Volume Prediction)
- 🖼️ **Image Preprocessing** (Normalization, Augmentation)
- 📊 **StandardScaler** (Feature Scaling)

### **DevOps**
- 🐳 **Docker** + Docker Compose
- ☁️ **Vercel** (Frontend Deployment)
- 🚀 **Railway/Render** (Backend Deployment)
- 🔄 **GitHub Actions** (CI/CD)

---

## 📦 Instalasi

### **Prerequisites**
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm atau yarn

### **1. Clone Repository**
```bash
git clone https://github.com/atepginzo/trash-classifier.git
cd trash-classifier
```

### **2. Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials Anda

# Run Prisma migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Start backend server
npm run dev
```

Backend akan running di `http://localhost:3000`

### **3. Setup Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables (optional)
cp .env.example .env

# Start frontend dev server
npm run dev
```

Frontend akan running di `http://localhost:5173`

---

## 🚀 Penggunaan

### **1. Klasifikasi Sampah**
1. Buka aplikasi di browser
2. Klik **"Mulai Scan Sampah"** atau navigasi ke `/upload`
3. Pilih tab **"Upload Foto"** atau **"Kamera"**
4. Upload/ambil foto sampah
5. Tunggu AI memproses (< 3 detik)
6. Lihat hasil klasifikasi + rekomendasi pengelolaan

### **2. Navigasi ke TPS** ⭐ **NEW!**
1. Buka **"Peta TPS"** dari navbar
2. Klik marker TPS mana saja di peta
3. Sidebar terbuka dengan info TPS
4. Scroll ke section **"Navigasi ke TPS"**
5. Klik tombol **"Navigasi ke sini"**
6. Allow browser location permission
7. Rute biru muncul di peta dari lokasi Anda ke TPS
8. Panel floating di bawah peta menampilkan:
   - **Jarak** (km)
   - **Estimasi waktu** (menit)
9. Klik **"Hentikan Navigasi"** untuk reset

### **3. Prediksi Volume Sampah**
1. Buka **"Peta TPS"**
2. Klik marker TPS
3. Sidebar menampilkan:
   - Prediksi 3 bulan ke depan
   - Grafik historis 12 bulan
   - Model LSTM yang digunakan

### **4. Dark Mode**
- Klik icon **matahari/bulan** di navbar kanan atas
- Mode tersimpan di localStorage

---

## 📁 Struktur Project

```
trash-classifier/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic + AI models
│   │   ├── middleware/        # Auth, validation, upload
│   │   ├── lib/               # Prisma client
│   │   └── utils/             # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # DB migrations
│   ├── uploads/               # Uploaded images
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts (Theme)
│   │   ├── services/          # API services
│   │   ├── lib/               # Utilities & animations
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   └── package.json
│
├── DESIGN_SYSTEM.md           # Design guidelines
└── README.md                  # This file
```

---

## 📡 API Documentation

### **Base URL**
```
Development: http://localhost:3000/api
Production: https://your-backend.vercel.app/api
```

### **Endpoints**

#### **1. Health Check**
```http
GET /health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-28T10:00:00.000Z"
}
```

#### **2. Predict Waste**
```http
POST /predictions
Content-Type: multipart/form-data

Body:
- image: File (required)
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "predicted_class": "Plastik",
    "confidence": 0.9518,
    "recommendations": "...",
    "image_url": "https://...",
    "created_at": "2026-05-28T10:00:00.000Z"
  }
}
```

#### **3. Get All TPS**
```http
GET /tps?limit=100&offset=0
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_desa": "Bojongmalaka",
      "kecamatan": "Baleendah",
      "kabupaten": "Kabupaten Bandung",
      "lat": -7.0307,
      "lon": 107.6486,
      "kapasitas_ton": 20,
      "area_type": "SEMI_URBAN"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 100,
    "offset": 0
  }
}
```

#### **4. Predict Volume (LSTM)**
```http
GET /volume/predict/:tpsId
```
Response:
```json
{
  "success": true,
  "data": {
    "tps_id": 1,
    "predictions": [
      { "bulan": 6, "tahun": 2026, "volume_ton": 338.3 },
      { "bulan": 7, "tahun": 2026, "volume_ton": 336.7 },
      { "bulan": 8, "tahun": 2026, "volume_ton": 319.9 }
    ],
    "history": [...],
    "model_used": "LSTM+Bahdanau Attention"
  }
}
```

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Berikut cara berkontribusi:

1. **Fork** repository ini
2. Buat **branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buat **Pull Request**

### **Coding Standards**
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test before PR

---

## 👥 Tim Pengembang

### **Full-Stack Web Developer**
- **Imam Rizki Saputra** (CFCC554D6Y1710)
  - Universitas Bale Bandung • Teknik Informatika
  - [LinkedIn](https://www.linkedin.com/in/imam-rizki-saputra-64103b3ab) • [GitHub](https://github.com/imamrzkys)

- **Atep Solihin** (CFCC554D6Y0350)
  - Universitas Bale Bandung • Teknik Informatika
  - [LinkedIn](https://www.linkedin.com/in/atep-solihin-39129b291) • [GitHub](https://github.com/atepginzo)

### **Data Scientist**
- **Fadhila Latsa Tsabita** (CDCC011D6X2244)
  - Universitas Padjadjaran • Teknik Informatika
  - [LinkedIn](https://www.linkedin.com/in/fadhila-latsa-tsabita) • [GitHub](https://github.com/FadhilaLatsaTsabita)

- **Azmi Naifah Iftinah** (CDCC011D6X2286)
  - Universitas Padjadjaran • Teknik Informatika
  - [LinkedIn](https://www.linkedin.com/in/aifaa18/) • [GitHub](https://github.com/aifa18)

### **AI Engineer**
- **Devin Suryadi** (CACC011D6Y0941)
  - Universitas Padjadjaran • Teknik Informatika
  - [LinkedIn](https://www.linkedin.com/in/devin-suryadi) • [GitHub](https://github.com/DevinSuryadi)

- **Darma Al Gani** (CACC012D6Y0805)
  - Universitas Telkom • TEKNIK TELEKOMUNIKASI
  - [LinkedIn](https://www.linkedin.com/in/darma-al-gani-556456262/) • [GitHub](https://github.com/Daarma-IC)

---

## 📝 Changelog

### **v2.1.0** (2026-05-28) ⭐ **LATEST**

#### **✨ New Features**
- **Fitur Navigasi OSRM** di Peta TPS:
  - Routing real-time dari lokasi user ke TPS
  - Estimasi jarak (km) dan waktu tempuh (menit)
  - Polyline biru di peta dengan marker lokasi user
  - Panel navigasi floating responsive
  - Tombol "Navigasi ke sini" & "Hentikan Navigasi"
  - Error handling untuk geolocation & OSRM API

#### **🎨 UI/UX Improvements**
- Perbaikan kontras warna di **Light Mode**:
  - Hero section subtitle
  - Stats section labels
  - Footer text & links
  - WasteGuideSection subtitle
  - FinalCTA description
- Responsive navigation panel (mobile-friendly)
- Improved button sizes & touch targets
- Better text readability di semua mode

#### **🐛 Bug Fixes**
- Fix CSS global override di `index.css` untuk `<p>` dan `<h1-h3>`
- Fix Dashboard TPS sidebar kepotong di mobile
- Fix text color tidak terbaca di background gelap

#### **📚 Documentation**
- README.md lengkap dengan:
  - Dokumentasi fitur navigasi
  - API documentation
  - Installation guide
  - Usage guide
  - Team profiles

---

### **v2.0.0** (2026-05-15)

#### **✨ New Features**
- Dashboard TPS dengan Leaflet Maps
- Prediksi volume sampah (LSTM)
- Dark mode & light mode
- Responsive design untuk semua device

#### **🎨 UI/UX**
- Modern design system dengan Tailwind CSS
- Framer Motion animations
- Glassmorphism effects

---

### **v1.0.0** (2026-04-27)

#### **🚀 Initial Release**
- AI waste classification (CNN)
- Upload & camera capture
- Basic UI with React

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DBS Foundation** - Coding Camp 2026
- **OpenStreetMap** - Map tiles
- **OSRM Project** - Routing engine
- **TensorFlow** - AI framework
- **Leaflet** - Interactive maps
- **Vercel** - Hosting platform

---

## 📞 Kontak

- **Email**: ecosortdbs@gmail.com
- **WhatsApp**: +62 895-1382-9923
- **GitHub**: [atepginzo/trash-classifier](https://github.com/atepginzo/trash-classifier)

---

<div align="center">

**Made with 💚 by TrashSmart Team**

*Coding Camp DBS Foundation 2026 • CC26-PSU179*

[![GitHub](https://img.shields.io/badge/GitHub-atepginzo-181717?style=for-the-badge&logo=github)](https://github.com/atepginzo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/atep-solihin-39129b291)

</div>
