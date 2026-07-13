# ADR-003 — Base API Controller

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dibangun sebagai REST API yang akan melayani Website Company Profile dan dikembangkan secara bertahap menjadi Sistem Informasi LSP.

Seiring bertambahnya jumlah endpoint, controller akan memiliki tanggung jawab yang sama, seperti:

* mengembalikan response JSON;
* menentukan HTTP status code;
* menjaga konsistensi struktur response;
* menangani keberhasilan maupun kegagalan operasi.

Apabila setiap controller membangun response secara mandiri, maka akan muncul duplikasi implementasi, inkonsistensi format JSON, serta meningkatnya biaya pemeliharaan.

Diperlukan satu controller dasar yang menjadi fondasi seluruh API controller.

---

# Decision

Seluruh API controller wajib mewarisi:

```text id="bqj8vf"
App\Http\Controllers\Api\BaseApiController
```

`BaseApiController` menjadi satu-satunya tempat untuk menyediakan mekanisme standar dalam membangun response REST API.

Controller domain hanya bertanggung jawab terhadap:

* menerima HTTP request;
* memanggil Service Layer;
* mengembalikan response menggunakan mekanisme yang disediakan oleh `BaseApiController`.

Controller tidak diperbolehkan membangun struktur JSON response secara manual apabila kebutuhan tersebut telah disediakan oleh `BaseApiController`.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Konsistensi

Seluruh endpoint menghasilkan struktur response yang seragam sehingga memudahkan integrasi dengan frontend maupun sistem eksternal.

### Maintainability

Perubahan terhadap format response dilakukan pada satu lokasi tanpa perlu memperbarui seluruh controller.

### Reusability

Helper response dapat digunakan kembali oleh seluruh modul aplikasi.

### Separation of Concerns

Controller hanya menangani HTTP, sedangkan format response menjadi tanggung jawab `BaseApiController`.

---

# Consequences

## Positif

* Struktur response API menjadi konsisten.
* Tidak terjadi duplikasi kode antar controller.
* Frontend memiliki kontrak response yang stabil.
* Penyesuaian format response dapat dilakukan secara terpusat.

## Trade-off

* Seluruh controller memiliki ketergantungan terhadap `BaseApiController`.
* Perubahan pada mekanisme response harus mempertimbangkan dampaknya terhadap seluruh endpoint.

Trade-off tersebut diterima karena meningkatkan konsistensi dan mengurangi kompleksitas pemeliharaan.

---

# Implementation

Implementasi yang digunakan pada proyek meliputi prinsip-prinsip berikut.

## 1. Single Base Controller

Seluruh API controller mewarisi satu kelas dasar.

```text id="v6sy2q"
BaseApiController
        │
        ├── AuthController
        ├── UserController
        ├── NewsController
        ├── CertificationSchemeController
        ├── CMSController
        └── ...
```

---

## 2. Standardized API Response

Seluruh response REST API dibangun melalui mekanisme yang disediakan oleh `BaseApiController`.

Hal ini memastikan struktur response tetap konsisten pada seluruh endpoint.

---

## 3. HTTP Responsibility

Controller hanya bertanggung jawab terhadap proses HTTP.

Business rule tidak ditempatkan pada controller.

Seluruh proses bisnis didelegasikan kepada Service Layer.

---

## 4. Integration with Service Layer

Komunikasi controller mengikuti pola berikut.

```text id="spvbcs"
HTTP Request
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Database
```

Controller tidak diperbolehkan mengakses repository secara langsung.

---

## 5. Exception Handling

Controller tidak melakukan penanganan exception secara manual apabila exception telah ditangani oleh mekanisme global aplikasi.

Exception diproses melalui konfigurasi global sesuai keputusan pada ADR-006.

---

## 6. Resource Transformation

Data yang dikembalikan kepada client menggunakan API Resource apabila diperlukan.

Controller tidak melakukan transformasi data secara manual.

---

# Compatibility

| Item                        | Status     |
| --------------------------- | ---------- |
| Backward Compatibility      | Compatible |
| Database Migration Required | No         |
| API Breaking Change         | No         |

---

# Alternatives Considered

## Membangun Response pada Setiap Controller

Tidak dipilih karena menyebabkan duplikasi kode dan meningkatkan risiko inkonsistensi struktur response.

---

## Menggunakan Trait untuk Response

Pendekatan ini dipertimbangkan agar helper response dapat digunakan oleh banyak controller.

Namun, trait tidak menyediakan satu titik pewarisan yang jelas dan cenderung menyebarkan implementasi ke banyak class.

`BaseApiController` dipilih karena lebih sederhana, lebih mudah dipelihara, dan sesuai dengan pola pewarisan controller Laravel.

---

## Mengembalikan `response()->json()` Secara Langsung

Pendekatan ini cocok untuk endpoint sederhana, tetapi tidak dipilih sebagai standar proyek karena menghasilkan variasi struktur response antar developer.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-004 — Repository Pattern
* ADR-005 — Service Layer
* ADR-006 — Exception Handling

ADR ini menetapkan bahwa seluruh REST API pada backend LSP Multi Bintang Komunikasi menggunakan satu fondasi controller untuk menghasilkan response yang konsisten, mudah dipelihara, dan selaras dengan prinsip arsitektur proyek.
