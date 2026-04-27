# API Contract — Trash Classifier Backend

> Base URL: `http://localhost:3000/api`

## Daftar Endpoint

| Method | Endpoint           | Deskripsi                         |
| ------ | ------------------ | --------------------------------- |
| GET    | `/health`          | Health check server               |
| POST   | `/predictions`     | Upload gambar & dapatkan prediksi |
| GET    | `/predictions`     | Riwayat prediksi (paginasi)       |
| GET    | `/predictions/:id` | Detail satu prediksi              |

---

## Format Response

### Sukses

```json
{
  "status": "success",
  "data": { ... }
}
```

### Sukses dengan Pagination

```json
{
  "status": "success",
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

### Error

```json
{
  "status": "error",
  "message": "Deskripsi error",
  "code": "ERROR_CODE"
}
```

---

## 1. Health Check

**`GET /api/health`**

Response `200`:

```json
{
  "status": "success",
  "data": {
    "status": "ok",
    "timestamp": "2026-04-27T09:00:00.000Z"
  }
}
```

---

## 2. Upload & Prediksi Gambar

**`POST /api/predictions`**

| Parameter | Tipe | Lokasi    | Wajib | Keterangan                         |
| --------- | ---- | --------- | ----- | ---------------------------------- |
| `image`   | File | form-data | Ya    | File gambar (JPEG, PNG, atau WEBP) |

Batas ukuran: 5 MB.

Contoh request:

```bash
curl -X POST http://localhost:3000/api/predictions \
  -F "image=@foto_sampah.jpg"
```

Response `201`:

```json
{
  "status": "success",
  "data": {
    "id": "cm2xk9abc0001abcdef12345",
    "originalFilename": "foto_sampah.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 245760,
    "imageUrl": null,
    "result": {
      "label": "Plastic",
      "confidence": 0.9234,
      "category": "Anorganik",
      "detections": [
        {
          "label": "Plastic",
          "confidence": 0.9234,
          "bbox": { "x": 50, "y": 30, "width": 200, "height": 250 }
        }
      ]
    },
    "rawAiResponse": { "mock": true, "label": "Plastic", "confidence": 0.9234 },
    "aiProvider": "mock",
    "createdAt": "2026-04-27T09:00:00.000Z"
  }
}
```

Error responses:

| Status | Code               | Kondisi                     |
| ------ | ------------------ | --------------------------- |
| 400    | `VALIDATION_ERROR` | Field `image` tidak dikirim |
| 422    | `FILE_TOO_LARGE`   | Ukuran file melebihi 5 MB  |
| 422    | `INVALID_FILE_TYPE`| Bukan JPEG/PNG/WEBP         |
| 502    | `AI_SERVICE_ERROR` | AI service tidak tersedia   |

---

## 3. Riwayat Prediksi

**`GET /api/predictions`**

Query parameters:

| Parameter | Tipe   | Default | Keterangan                       |
| --------- | ------ | ------- | -------------------------------- |
| `page`    | number | `1`     | Nomor halaman                    |
| `limit`   | number | `10`    | Jumlah data per halaman (max 50) |

Contoh: `GET /api/predictions?page=1&limit=5`

Response `200`:

```json
{
  "status": "success",
  "data": [
    {
      "id": "cm2xk9abc0001abcdef12345",
      "originalFilename": "foto_sampah.jpg",
      "result": {
        "label": "Plastic",
        "confidence": 0.9234,
        "category": "Anorganik"
      },
      "createdAt": "2026-04-27T09:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 5, "total": 12, "totalPages": 3 }
}
```

Response list tidak menyertakan `detections` dan `rawAiResponse` untuk performa. Gunakan endpoint detail untuk data lengkap.

---

## 4. Detail Prediksi

**`GET /api/predictions/:id`**

Contoh: `GET /api/predictions/cm2xk9abc0001abcdef12345`

Response `200`: sama dengan response POST di atas.

Error:

| Status | Code        | Kondisi                      |
| ------ | ----------- | ---------------------------- |
| 404    | `NOT_FOUND` | ID tidak ditemukan / invalid |

---

## Kode Error

| Code                | HTTP | Deskripsi                             |
| ------------------- | ---- | ------------------------------------- |
| `NOT_FOUND`         | 404  | Endpoint atau resource tidak ditemukan |
| `VALIDATION_ERROR`  | 400  | Input tidak valid                     |
| `FILE_TOO_LARGE`    | 422  | Ukuran file melebihi batas           |
| `INVALID_FILE_TYPE` | 422  | Format file tidak didukung           |
| `AI_SERVICE_ERROR`  | 502  | AI service gagal atau timeout        |
| `UPLOAD_ERROR`      | 400  | Proses upload gagal                  |
| `INTERNAL_ERROR`    | 500  | Kesalahan internal server            |