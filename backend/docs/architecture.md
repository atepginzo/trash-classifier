# Arsitektur Sistem — Trash Classifier

## Gambaran Umum

Backend Express.js bertindak sebagai orchestrator tunggal yang menghubungkan frontend, AI service, dan database.

```
Frontend (React)  -->  Backend (Express)  -->  AI Service (ML Model)
                            |
                       PostgreSQL
                      (via Prisma)
```

## Kenapa Backend sebagai Orchestrator?

1. **Keamanan** — API key AI tidak terekspos ke frontend.
2. **Decoupling** — Jika format response AI berubah, cukup ubah `normalizeAiResponse()`. Frontend tidak terpengaruh.
3. **Persistence** — Setiap prediksi otomatis tersimpan ke database.
4. **Fleksibilitas** — AI bisa diganti dari Mock ke Cloud API ke Self-hosted cukup dengan toggle env variable.

## Alur Request

```
1. Frontend POST /api/predictions (upload gambar)
2. Backend validasi file (tipe, ukuran)
3. Backend panggil predictImage(buffer, mimeType)
4. AI service return hasil prediksi
5. Backend simpan ke database
6. Backend return response ke frontend
```

---

## Desain Database

### Tabel: `predictions`

| Kolom              | Tipe     | Keterangan                        |
| ------------------ | -------- | --------------------------------- |
| `id`               | String   | Primary key (CUID)                |
| `original_filename`| String   | Nama file asli                    |
| `mime_type`        | String   | Tipe MIME (image/jpeg, dst)       |
| `file_size`        | Int      | Ukuran file dalam bytes           |
| `image_url`        | String?  | URL gambar (jika di-upload ke cloud) |
| `label`            | String   | Hasil prediksi utama              |
| `confidence`       | Float    | Tingkat keyakinan (0-1)           |
| `category`         | String?  | Kategori sampah                   |
| `detections`       | JSON     | Array objek deteksi (label, confidence, bbox) |
| `raw_ai_response`  | JSON?    | Response mentah dari AI untuk debugging |
| `ai_provider`      | String   | `mock` atau `ai-service`          |
| `created_at`       | DateTime | Timestamp pembuatan               |

### Kenapa 1 Tabel + JSON, Bukan Relasi Terpisah?

| Aspek              | 1 Tabel + JSON                     | Relasi Terpisah               |
| ------------------ | ---------------------------------- | ----------------------------- |
| Kompleksitas       | Simpel, 1 query = semua data       | Butuh JOIN                    |
| Performa read      | Cepat                              | Lebih lambat                  |
| Performa write     | 1 INSERT selesai                   | INSERT ke 2 tabel             |
| Fleksibilitas      | Struktur detections bebas berubah  | Harus ALTER TABLE             |

Keputusan pakai 1 tabel karena:
- Detections selalu dibaca bersama prediction, tidak pernah di-query terpisah.
- Format detections bisa berubah saat model AI diperbarui.
- Untuk MVP, kecepatan development lebih penting.

Contoh isi field `detections`:

```json
[
  {
    "label": "Plastic",
    "confidence": 0.92,
    "bbox": { "x": 50, "y": 30, "width": 200, "height": 250 }
  }
]
```

Field `raw_ai_response` menyimpan response mentah dari AI tanpa modifikasi, berguna untuk debugging dan re-processing jika logika mapping berubah.

---

## Struktur Folder

```
src/
├── app.js                        # Express app setup
├── server.js                     # Entry point
├── config/index.js               # Environment variables
├── controllers/
│   ├── health.controller.js
│   └── prediction.controller.js
├── services/
│   ├── ai.service.js             # Mock / Real AI abstraction
│   └── prediction.service.js     # Business logic + DB
├── routes/
│   ├── index.js                  # Route registry
│   ├── health.routes.js
│   └── prediction.routes.js
├── middleware/
│   ├── errorHandler.js
│   ├── upload.js                 # Multer config
│   └── validate.js
├── lib/prisma.js                 # Prisma client singleton
└── utils/apiResponse.js          # Response helpers
```

Pola: **Routes -> Controller -> Service -> Database**

| Layer      | Tanggung Jawab                        |
| ---------- | ------------------------------------- |
| Routes     | Daftarkan endpoint dan middleware     |
| Controller | Koordinasi request/response           |
| Service    | Business logic, komunikasi AI dan DB |
| Middleware | Validasi, upload, error handling     |

---

## Teknologi

| Komponen  | Teknologi   | Alasan                          |
| --------- | ----------- | ------------------------------- |
| Runtime   | Node.js 20+ | Async I/O, ekosistem JavaScript |
| Framework | Express 5.x | Standar industri                |
| ORM       | Prisma 6.x  | Type-safe, migrasi otomatis     |
| Database  | PostgreSQL  | Support JSON native             |
| Upload    | Multer 2.x  | Upload middleware standar       |
