# Penambahan Alur "Live Camera" via Frame Sampling

> **Dokumen tambahan untuk endpoint biar jelas**

---

## 1. Pembaruan Alur

Kita resmi menambahkan metode input kedua: **Live Camera**. Berikut poin terpenting yang perlu kalian tahu sebelum membaca detail di bawah:

- **Endpoint Backend tidak berubah.** Fitur Live Camera tetap mengirim request ke `POST /api/predictions` dengan `multipart/form-data` dan field `image` — persis sama dengan alur Upload Gambar yang sudah kalian implementasi.
- **Tidak ada endpoint baru, tidak ada protokol baru.** Kita tidak menggunakan WebSocket, WebRTC, atau streaming apapun. Semua komunikasi tetap HTTP standar.
- **Yang berubah hanya di sisi Frontend:** bagaimana gambar diperoleh (dari kamera, bukan dari file picker) dan bagaimana hasil ditampilkan (overlay bounding box di atas feed kamera).

Singkatnya: **Backend sama sekali tidak perlu disentuh.** Semua penyesuaian ada di logika antarmuka Frontend.

---

## 2. System Flow: Fitur Live Camera (Frame Sampling)

### Arsitektur Komponen di Frontend

```
┌─────────────────────────────────────────────┐
│              Container (position: relative)  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         <video>                     │    │  ← Live camera feed (getUserMedia)
│  │         Feed kamera real-time       │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │         <canvas id="overlay">       │    │  ← Transparan, posisi absolute
│  │         Bounding box digambar       │    │     menimpa <video>, ukuran sama
│  │         di sini                     │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │         <canvas id="capture">       │    │  ← Hidden, hanya untuk memotret
│  │         (display: none)             │    │     frame dari <video>
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Alur Step-by-Step

```
Langkah 1 — Akses Kamera
│  User menekan tombol "Mulai Kamera"
│  Frontend memanggil navigator.mediaDevices.getUserMedia({ video: true })
│  Stream ditautkan ke elemen <video> via video.srcObject = stream
│  <video> mulai menampilkan feed kamera secara real-time
│
Langkah 2 — Mulai Sampling Loop
│  Setelah kamera aktif, Frontend memulai interval timer (setiap 1.5 detik)
│  Pada setiap tick interval:
│
│  ┌──────────────────────────────────────────────────────────────────┐
│  │  2a. Cek apakah request sebelumnya sudah selesai (lihat §3)     │
│  │      → Jika belum selesai: SKIP frame ini, tunggu tick berikut  │
│  │      → Jika sudah selesai: lanjut ke 2b                        │
│  │                                                                  │
│  │  2b. Gambar frame saat ini dari <video> ke <canvas id="capture"> │
│  │      captureCtx.drawImage(videoElement, 0, 0, width, height)    │
│  │                                                                  │
│  │  2c. Konversi canvas ke Blob                                    │
│  │      captureCanvas.toBlob(blob => { ... }, 'image/jpeg', 0.85)  │
│  │                                                                  │
│  │  2d. Bungkus Blob ke FormData                                   │
│  │      const formData = new FormData()                            │
│  │      formData.append('image', blob, 'camera-frame.jpg')         │
│  │                                                                  │
│  │  2e. Kirim ke Backend via HTTP POST                             │
│  │      POST /api/predictions  ← ENDPOINT YANG SAMA               │
│  │      Content-Type: multipart/form-data                          │
│  │      Body: formData                                             │
│  └──────────────────────────────────────────────────────────────────┘
│
Langkah 3 — Terima Response & Gambar Bounding Box
│  Backend memproses gambar (forward ke AI, normalisasi, simpan ke DB)
│  dan mengembalikan response JSON dengan format yang SAMA PERSIS:
│
│  {
│    "status": "success",
│    "data": {
│      "id": "...",
│      "result": {
│        "label": "Botol Plastik",
│        "confidence": 0.92,
│        "category": "Anorganik",
│        "detections": [
│          {
│            "label": "Botol Plastik",
│            "confidence": 0.92,
│            "bbox": { "x": 50, "y": 30, "width": 200, "height": 250 }
│          }
│        ]
│      }
│    }
│  }
│
│  Frontend mengambil array `detections` dari response:
│  → Bersihkan <canvas id="overlay">: overlayCtx.clearRect(...)
│  → Untuk setiap detection yang punya bbox !== null:
│       overlayCtx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)
│       overlayCtx.fillText(label + " " + confidence, bbox.x, bbox.y)
│  → Jika detections kosong atau bbox null: overlay tetap bersih
│
Langkah 4 — Loop Berlanjut
│  Interval timer tetap berjalan
│  Setiap 1.5 detik, ulangi Langkah 2
│  Bounding box di overlay akan ter-update setiap ada response baru
│
Langkah 5 — Stop Kamera
│  User menekan tombol "Hentikan Kamera"
│  Frontend: clearInterval(samplingTimer)
│  Frontend: stream.getTracks().forEach(track => track.stop())
│  Frontend: bersihkan overlay canvas
│  Kamera mati, loop berhenti
```

### Konfirmasi: Endpoint yang Digunakan

| Metode Input | Endpoint | Method | Body | Perbedaan |
|-------------|----------|--------|------|-----------|
| Upload Gambar | `POST /api/predictions` | POST | `multipart/form-data`, field `image` | User pilih file manual |
| Live Camera | `POST /api/predictions` | POST | `multipart/form-data`, field `image` | Frame dipotret otomatis dari `<canvas>` tiap 1.5 detik |

**Dari sisi Backend, kedua request ini tidak bisa dibedakan dan tidak perlu dibedakan.** Keduanya adalah upload gambar biasa.

---

## 3. Peringatan Integrasi (Integration Notes)

###  Poin 1 — Jangan Kirim Frame Baru Jika Request Sebelumnya Belum Selesai

Ini yang paling kritis. Jika interval 1.5 detik terlalu cepat dibanding waktu respons AI (misalnya AI butuh 2 detik), maka request akan menumpuk dan membanjiri server.

**Solusi wajib:** Gunakan flag `isBusy` (atau `isProcessing`).

```javascript
let isProcessing = false;

function onIntervalTick() {
  if (isProcessing) return; // ← SKIP, jangan kirim frame baru

  isProcessing = true;

  captureAndSend()
    .then(response => {
      drawBoundingBoxes(response.data.result.detections);
    })
    .catch(err => {
      console.error('Prediction failed:', err);
      clearOverlay(); // Bersihkan bbox lama jika error
    })
    .finally(() => {
      isProcessing = false; // ← Baru boleh kirim frame berikutnya
    });
}
```

Dengan pola ini, jika AI butuh 3 detik, frame hanya dikirim setiap ~3 detik (bukan 1.5 detik), secara otomatis menyesuaikan dengan kecepatan respons server. **Tidak ada request yang saling tumpang tindih.**

###  Poin 2 — Sinkronkan Dimensi Canvas dengan Video

`<canvas id="overlay">` dan `<canvas id="capture">` **HARUS** memiliki dimensi (`width`, `height`) yang sama persis dengan resolusi aktual `<video>`. Jika tidak sinkron, koordinat bounding box dari AI akan salah posisi.

```javascript
video.addEventListener('loadedmetadata', () => {
  const width = video.videoWidth;
  const height = video.videoHeight;

  overlayCanvas.width = width;
  overlayCanvas.height = height;
  captureCanvas.width = width;
  captureCanvas.height = height;
});
```

> **Catatan:** `video.videoWidth` adalah resolusi asli stream kamera, bukan ukuran CSS elemen. Gunakan resolusi asli untuk canvas, lalu gunakan CSS untuk mengatur ukuran tampilan visual agar keduanya tumpang tindih sempurna.

###  Poin 3 — Bersihkan State Saat Mode Berganti

Jika UI kalian punya toggle antara mode "Upload Gambar" dan "Live Camera", pastikan:

- **Masuk ke Live Camera:** Hentikan preview gambar statis (jika ada), mulai stream kamera, mulai interval sampling.
- **Keluar dari Live Camera:** Stop semua track kamera (`stream.getTracks().forEach(t => t.stop())`), clear interval, clear overlay canvas, reset flag `isProcessing = false`.
- **Jangan biarkan interval berjalan saat kamera sudah mati.** Ini akan menyebabkan frame hitam dikirim ke server dan menghasilkan prediksi sampah.

```javascript
function stopCamera() {
  clearInterval(samplingTimer);
  samplingTimer = null;
  isProcessing = false;

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  videoElement.srcObject = null;
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}
```

