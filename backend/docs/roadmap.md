# Roadmap MVP — Trash Classifier (4 Minggu)

Target: Aplikasi klasifikasi sampah end-to-end yang bisa di-demo.

---

## Minggu 1 — Foundation & Setup

Goal: Semua anggota bisa develop paralel.

| Task                                           | PIC        | Status |
| ---------------------------------------------- | ---------- | ------ |
| Setup backend (Express + Prisma)               | Full-Stack | Done   |
| Design database schema                         | Full-Stack | Done   |
| Health check endpoint                          | Full-Stack | Done   |
| Mock AI service                                | Full-Stack | Done   |
| POST /api/predictions                          | Full-Stack | Done   |
| GET /api/predictions (list + pagination)       | Full-Stack | Done   |
| GET /api/predictions/:id                       | Full-Stack | Done   |
| Dokumentasi API & arsitektur                   | Full-Stack | Done   |
| Setup frontend (React + Vite)                  | Full-Stack | Todo   |
| Kumpulkan & labeling dataset                   | AI/Data    | Todo   |
| Riset model object detection                   | AI/ML      | Todo   |

Deliverable: Backend API jalan dengan Mock AI, docs lengkap, dataset awal terkumpul.

---

## Minggu 2 — Core Features

Goal: Frontend terhubung ke backend, model AI mulai training.

| Task                                           | PIC        | Status |
| ---------------------------------------------- | ---------- | ------ |
| Halaman upload gambar (drag & drop)            | Full-Stack | Todo   |
| Halaman hasil prediksi                         | Full-Stack | Todo   |
| Halaman riwayat prediksi (list + pagination)   | Full-Stack | Todo   |
| Koneksi frontend ke backend API                | Full-Stack | Todo   |
| Training model dengan dataset awal             | AI/ML      | Todo   |
| Evaluasi metrik model (accuracy, mAP)          | AI/Data    | Todo   |
| Deploy model sebagai REST API                  | AI/ML      | Todo   |
| Jawab pertanyaan integrasi AI (lihat ai-integration.md) | AI/ML | Todo |

Deliverable: Frontend fungsional, model AI pertama selesai training dan ter-deploy.

---

## Minggu 3 — Integrasi & Validasi

Goal: Mock AI diganti Real AI, semua fitur end-to-end.

| Task                                           | PIC        | Status |
| ---------------------------------------------- | ---------- | ------ |
| Integrasi Real AI ke backend                   | Full-Stack | Todo   |
| Update normalizeAiResponse() sesuai format AI  | Full-Stack | Todo   |
| Update CATEGORY_MAP sesuai label model         | Full-Stack | Todo   |
| Testing end-to-end                             | Full-Stack | Todo   |
| Visualisasi bounding box di frontend           | Full-Stack | Todo   |
| Halaman detail prediksi                        | Full-Stack | Todo   |
| Fine-tuning model                              | AI/ML      | Todo   |
| Error handling edge cases                      | Full-Stack | Todo   |

Deliverable: Aplikasi end-to-end dengan Real AI, bounding box di frontend.

---

## Minggu 4 — Polish, Deploy, Demo

Goal: Production-ready.

| Task                                           | PIC        | Status |
| ---------------------------------------------- | ---------- | ------ |
| UI polish & responsive                         | Full-Stack | Todo   |
| Loading states & skeleton UI                   | Full-Stack | Todo   |
| Deploy backend ke VPS / Cloud                  | Full-Stack | Todo   |
| Deploy frontend ke Vercel / Netlify            | Full-Stack | Todo   |
| Setup PostgreSQL production                    | Full-Stack | Todo   |
| Final testing di production                    | All        | Todo   |
| README final                                   | Full-Stack | Todo   |
| Persiapan presentasi & demo                    | All        | Todo   |
| Video demo                                     | All        | Todo   |

Deliverable: Aplikasi live, video demo siap, presentasi siap.

---

## Risiko & Mitigasi

| Risiko                             | Dampak | Mitigasi                                          |
| ---------------------------------- | ------ | ------------------------------------------------- |
| Model AI belum siap di Minggu 3    | Tinggi | Mock AI tetap bisa dipakai untuk demo             |
| Dataset kecil / tidak balance      | Sedang | Augmentasi data, pakai pre-trained model          |
| Format response AI berubah         | Sedang | normalizeAiResponse() sudah jadi adapter layer    |
| Deployment gagal                   | Sedang | Test deployment sejak Minggu 2                    |

---

## Definisi Done untuk MVP

- User bisa upload foto sampah
- Sistem return jenis sampah + confidence
- Riwayat prediksi tersimpan dan bisa dilihat
- Kategori sampah (Organik/Anorganik/Residu) ditampilkan
- Bounding box ditampilkan di gambar
- Responsive di mobile dan desktop
- Bisa diakses via URL publik
