# ADR-001 — UUID as Public Identifier

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dirancang sebagai fondasi jangka panjang yang akan berkembang dari Website Company Profile menjadi Sistem Informasi LSP yang lengkap.

Pada sistem yang akan terus berkembang, penggunaan auto-increment integer sebagai identifier publik memiliki beberapa keterbatasan, antara lain:

* identifier mudah ditebak sehingga mempermudah proses enumeration;
* berpotensi mengungkap jumlah data yang tersimpan;
* kurang ideal untuk integrasi lintas sistem;
* menyulitkan migrasi menuju arsitektur terdistribusi apabila dibutuhkan di masa depan.

Karena itu diperlukan identifier publik yang bersifat unik secara global, sulit diprediksi, dan tetap stabil sepanjang siklus hidup data.

---

# Decision

Seluruh resource publik menggunakan **UUID versi 7 (UUID v7)** sebagai identifier publik.

Primary key numerik (`id`) tetap digunakan sebagai primary key internal database untuk menjaga performa relasi dan kompatibilitas dengan Eloquent.

Dengan demikian setiap entitas memiliki dua identifier.

| Identifier | Tujuan                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------- |
| `id`       | Primary key internal database. Tidak diekspos melalui REST API.                           |
| `uuid`     | Public identifier yang digunakan pada REST API, URL, integrasi, dan komunikasi eksternal. |

UUID menjadi satu-satunya identifier yang boleh digunakan pada endpoint publik.

Contoh:

```text
GET /api/users/{uuid}

GET /api/news/{uuid}

PUT /api/certification-schemes/{uuid}

DELETE /api/testimonials/{uuid}
```

Seluruh implementasi baru wajib mengikuti konvensi tersebut.

---

# Rationale

Keputusan ini diambil dengan mempertimbangkan beberapa aspek.

### Security

UUID mengurangi risiko enumeration attack karena identifier tidak dapat ditebak secara berurutan.

### Scalability

UUID v7 tetap unik secara global sehingga lebih siap apabila sistem berkembang menjadi beberapa layanan atau membutuhkan sinkronisasi data lintas aplikasi.

### Maintainability

Identifier publik tidak bergantung pada struktur internal database sehingga perubahan implementasi database tidak memengaruhi kontrak REST API.

### Performance

UUID v7 memiliki karakteristik yang lebih berurutan dibanding UUID versi sebelumnya sehingga lebih ramah terhadap indexing database dibanding UUID v4.

---

# Consequences

## Positif

* Endpoint API tidak mengekspos primary key internal.
* URL lebih aman terhadap enumeration.
* Integrasi dengan sistem eksternal menjadi lebih mudah.
* Kontrak REST API tetap stabil.
* Siap mendukung pengembangan menuju Sistem Informasi LSP yang lebih besar.

## Trade-off

* Setiap tabel memiliki tambahan kolom `uuid`.
* Ukuran indeks lebih besar dibanding integer.
* Query manual harus memperhatikan penggunaan kolom `uuid` sebagai identifier publik.

Trade-off tersebut diterima karena manfaat jangka panjang lebih besar dibanding tambahan kompleksitas yang relatif kecil.

---

# Implementation

Standar implementasi yang digunakan pada proyek adalah sebagai berikut.

## 1. UUID v7

Seluruh UUID dihasilkan menggunakan UUID versi 7.

Implementasi dilakukan melalui `HasUuids` bawaan Laravel dengan melakukan override terhadap `newUniqueId()` pada `BaseModel`.

---

## 2. BaseModel

Seluruh model aplikasi mewarisi `BaseModel`.

`BaseModel` bertanggung jawab menghasilkan UUID v7 secara otomatis ketika model dibuat.

Model aplikasi tidak diperbolehkan mengimplementasikan mekanisme UUID secara mandiri.

---

## 3. Database Schema

Seluruh tabel yang merepresentasikan domain bisnis wajib memiliki kolom:

```text
uuid
```

dengan constraint:

* unique;
* not nullable.

Primary key numerik tetap digunakan sebagai relasi internal.

---

## 4. REST API

Endpoint publik menggunakan UUID.

Contoh:

```text
GET    /api/users/{uuid}

PUT    /api/users/{uuid}

DELETE /api/users/{uuid}
```

Penggunaan `id` pada endpoint publik tidak diperbolehkan.

---

## 5. Repository Layer

Repository menggunakan method yang berbasis UUID.

Contoh:

```text
findByUuid(string $uuid)
```

Repository tidak menyediakan kontrak publik berbasis primary key numerik.

---

## 6. Validation

Setiap parameter UUID yang diterima melalui request wajib divalidasi menggunakan aturan yang sesuai sebelum diproses lebih lanjut.

---

## 7. Future Development

Seluruh modul yang akan ditambahkan, termasuk:

* Authentication
* Authorization
* CMS
* News
* Certification Scheme
* Assessment
* TUK
* Audit Trail
* Dashboard
* Future LSP Modules

wajib mengikuti standar identifier yang ditetapkan pada ADR ini.

---

# Alternatives Considered

## Auto Increment Integer

Tidak dipilih karena mudah ditebak dan mengekspos urutan data.

## UUID v4

Tidak dipilih karena bersifat acak sepenuhnya sehingga kurang optimal untuk indexing dibanding UUID v7.

## ULID

Dipertimbangkan karena memiliki karakteristik yang serupa dengan UUID v7.

Namun, UUID v7 dipilih karena telah didukung secara langsung oleh Laravel dan mengikuti standar RFC 9562 sehingga lebih sesuai sebagai standar jangka panjang proyek.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-002 — Base Model Architecture
* ADR-004 — Repository Pattern

ADR ini menjadi dasar bagi seluruh keputusan yang berkaitan dengan identitas publik resource pada backend LSP Multi Bintang Komunikasi.
