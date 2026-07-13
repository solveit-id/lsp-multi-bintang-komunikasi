# ADR-004 — Repository Pattern

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dibangun menggunakan Service Layer sebagai pusat business logic.

Tanpa pemisahan yang jelas, Service dapat bergantung langsung pada Eloquent sehingga:

* business logic tercampur dengan query database;
* implementasi akses data tersebar di banyak class;
* proses pengujian menjadi lebih sulit;
* perubahan mekanisme persistence berdampak langsung pada business logic.

Diperlukan sebuah lapisan yang bertanggung jawab secara khusus terhadap akses data.

---

# Decision

Seluruh akses data dilakukan melalui Repository.

Repository menjadi batas (*data access boundary*) antara Service Layer dan Eloquent Model.

Arsitektur yang digunakan adalah:

```text
Controller
        │
        ▼
Service
        │
        ▼
Repository Interface
        │
        ▼
Repository Implementation
        │
        ▼
Eloquent Model
        │
        ▼
Database
```

Service tidak diperbolehkan mengakses Eloquent Model secara langsung.

Repository tidak diperbolehkan berisi business rule.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Separation of Concerns

Business logic dan data access memiliki tanggung jawab yang berbeda sehingga dipisahkan ke dalam layer yang berbeda.

### Maintainability

Perubahan query database tidak memengaruhi implementasi business logic.

### Testability

Service dapat diuji dengan mengganti implementasi repository tanpa bergantung pada database secara langsung.

### Scalability

Repository dapat berkembang untuk menangani query yang lebih kompleks tanpa mengubah Service Layer.

---

# Consequences

## Positif

* Query database terpusat pada Repository.
* Service hanya berfokus pada aturan bisnis.
* Struktur kode menjadi lebih mudah dipelihara.
* Pengembangan fitur baru menjadi lebih konsisten.

## Trade-off

* Menambah satu lapisan abstraksi pada arsitektur.
* Membutuhkan interface dan implementasi repository.

Trade-off tersebut diterima karena memberikan batas tanggung jawab yang jelas antara business logic dan persistence.

---

# Implementation

Implementasi Repository pada proyek mengikuti prinsip berikut.

## 1. Interface Based Design

Seluruh repository memiliki kontrak (interface) yang mendefinisikan operasi yang disediakan.

Service bergantung pada interface, bukan implementasi konkret.

---

## 2. Eloquent Implementation

Implementasi repository menggunakan Eloquent sebagai mekanisme persistence.

Apabila di masa depan diperlukan perubahan mekanisme penyimpanan data, perubahan dilakukan pada implementasi repository tanpa memengaruhi Service Layer.

---

## 3. Base Repository

Seluruh repository mewarisi `BaseRepository`.

`BaseRepository` hanya menyediakan operasi umum yang benar-benar digunakan lintas domain.

Repository tidak bertujuan menggantikan seluruh API Eloquent.

---

## 4. UUID-Oriented Access

Repository menggunakan UUID sebagai identifier publik.

Contoh operasi yang digunakan:

```text
findByUuid(string $uuid)
```

Standar penggunaan UUID mengacu pada ADR-001.

---

## 5. Domain-Specific Query

Repository bertanggung jawab terhadap query yang merepresentasikan kebutuhan domain.

Contoh:

```text
findPublishedNews()

findActiveAssessors()

findAvailableCertificationSchemes()

findRegistrationBySession()

findPendingDocumentVerification()
```

Repository tidak menyediakan wrapper untuk seluruh method Eloquent.

---

## 6. Service Collaboration

Satu Service dapat menggunakan beberapa repository dalam satu business process.

Sebaliknya, repository tidak diperbolehkan bergantung pada service lain.

---

## 7. Query Responsibility

Repository hanya bertanggung jawab terhadap:

* membaca data;
* menyimpan data;
* memperbarui data;
* menghapus data;
* membangun query yang dibutuhkan oleh domain.

Repository tidak menangani:

* validasi business rule;
* transaksi database lintas proses;
* pengiriman email;
* notifikasi;
* autentikasi;
* logging aplikasi.

---

# Compatibility

| Item                        | Status     |
| --------------------------- | ---------- |
| Backward Compatibility      | Compatible |
| Database Migration Required | No         |
| API Breaking Change         | No         |

---

# Alternatives Considered

## Menggunakan Eloquent Langsung pada Service

Tidak dipilih karena menyebabkan business logic bergantung langsung pada mekanisme persistence dan menyulitkan pemeliharaan ketika query semakin kompleks.

---

## Generic CRUD Repository

Pendekatan ini dipertimbangkan namun tidak dipilih.

Repository yang hanya membungkus method seperti:

```text
all()

find()

where()

orderBy()

paginate()
```

tidak memberikan nilai tambah karena Eloquent telah menyediakan API tersebut secara langsung.

Repository pada proyek ini hanya mengekspos operasi yang benar-benar dibutuhkan oleh business process.

---

## Active Record Only

Menggunakan Eloquent tanpa Repository merupakan pendekatan yang umum pada aplikasi Laravel berskala kecil.

Namun, karena proyek ini dipersiapkan untuk berkembang menjadi Sistem Informasi LSP dengan banyak modul dan aturan bisnis, pendekatan tersebut tidak dipilih sebagai standar arsitektur.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-001 — UUID as Public Identifier
* ADR-002 — Base Model Architecture
* ADR-003 — Base API Controller
* ADR-005 — Service Layer

ADR ini menetapkan bahwa Repository merupakan satu-satunya lapisan yang bertanggung jawab terhadap akses data dan menjadi batas yang jelas antara business logic dengan mekanisme persistence pada backend LSP Multi Bintang Komunikasi.
