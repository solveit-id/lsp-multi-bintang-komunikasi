# ADR-005 — Service Layer

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dirancang untuk menangani proses bisnis yang akan terus berkembang, mulai dari Website Company Profile hingga Sistem Informasi LSP yang mencakup registrasi sertifikasi, verifikasi dokumen, penugasan asesor, asesmen, audit trail, dan modul lainnya.

Tanpa lapisan khusus untuk business logic, aturan bisnis cenderung tersebar pada Controller, Model, atau Repository sehingga:

* kode menjadi sulit dipelihara;
* tanggung jawab antar layer menjadi tidak jelas;
* proses bisnis sulit diuji secara terpisah;
* perubahan aturan bisnis berdampak pada banyak bagian aplikasi.

Diperlukan satu lapisan yang menjadi pusat seluruh proses bisnis aplikasi.

---

# Decision

Seluruh business logic ditempatkan pada **Service Layer**.

Service menjadi satu-satunya lapisan yang bertanggung jawab mengoordinasikan proses bisnis, termasuk penggunaan beberapa repository, transaksi database, validasi aturan bisnis, serta integrasi dengan komponen aplikasi lainnya.

Arsitektur yang digunakan adalah:

```text id="4kdd0z"
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
Model
        │
        ▼
Database
```

Controller tidak diperbolehkan mengimplementasikan business logic.

Repository tidak diperbolehkan mengimplementasikan business rule.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Separation of Concerns

Business process dipisahkan dari HTTP dan persistence sehingga setiap layer memiliki tanggung jawab yang jelas.

### Maintainability

Perubahan aturan bisnis dilakukan pada satu lokasi tanpa memengaruhi controller maupun repository.

### Reusability

Satu service dapat digunakan kembali oleh beberapa endpoint maupun proses internal aplikasi.

### Scalability

Business process yang semakin kompleks tetap terorganisasi tanpa meningkatkan kompleksitas controller.

---

# Consequences

## Positif

* Seluruh business rule berada pada satu layer.
* Controller menjadi lebih sederhana.
* Repository tetap fokus pada akses data.
* Proses bisnis lebih mudah diuji dan dipelihara.

## Trade-off

* Menambah satu lapisan pada arsitektur aplikasi.
* Membutuhkan disiplin agar business logic tidak kembali tersebar pada layer lain.

Trade-off tersebut diterima karena memberikan struktur yang lebih jelas dan siap berkembang.

---

# Implementation

Implementasi Service Layer mengikuti prinsip berikut.

## 1. Single Responsibility

Setiap service merepresentasikan domain bisnis tertentu.

Contoh:

```text id="1c4okd"
AuthService

UserService

NewsService

CertificationService

AssessmentService

AuditLogService
```

---

## 2. Business Process Coordinator

Service bertanggung jawab mengoordinasikan seluruh langkah dalam satu proses bisnis.

Contoh:

```text id="6x1uk4"
Registrasi Sertifikasi

↓

Validasi aturan bisnis

↓

Menyimpan data registrasi

↓

Menyimpan dokumen

↓

Mencatat audit trail

↓

Mengirim notifikasi
```

Seluruh proses tersebut dijalankan melalui satu service.

---

## 3. Transaction Management

Apabila satu proses bisnis melibatkan lebih dari satu operasi database, service wajib menggunakan transaksi database.

Implementasi dilakukan melalui `BaseService` agar mekanisme transaksi konsisten di seluruh aplikasi.

---

## 4. Repository Collaboration

Service dapat menggunakan satu atau lebih repository sesuai kebutuhan proses bisnis.

Repository tetap bertanggung jawab terhadap akses data, sedangkan service mengatur urutan dan aturan bisnisnya.

---

## 5. Integration Point

Service menjadi titik integrasi untuk komponen lain, seperti:

* repository;
* event;
* notification;
* queue;
* mail;
* audit trail;
* cache.

Integrasi dilakukan tanpa memindahkan business rule ke komponen tersebut.

---

## 6. Domain-Oriented Methods

Method pada service menggunakan nama yang merepresentasikan proses bisnis.

Contoh:

```text id="j4vtf7"
register()

approve()

reject()

assign()

publish()

verify()

generateCertificate()
```

Method yang hanya mencerminkan operasi database bukan menjadi fokus utama Service Layer.

---

## 7. Thin Controller

Controller hanya bertugas:

* menerima request;
* memvalidasi request melalui Form Request;
* memanggil service;
* mengembalikan response.

Business rule tidak ditempatkan pada controller.

---

## 8. Base Service

Seluruh service mewarisi `BaseService`.

`BaseService` menyediakan utilitas bersama yang memang relevan untuk seluruh service, seperti helper transaksi database, tanpa menjadi tempat CRUD generik.

---

## 9. Interaction Rules

Hubungan antar layer mengikuti aturan berikut.

```text id="n7f8j2"
Controller → Service           ✔
Service → Repository           ✔
Repository → Model             ✔

Controller → Repository        ✘
Controller → Model             ✘
Repository → Service           ✘
Model → Service                ✘
Model → Repository             ✘
```

Aturan ini menjaga agar ketergantungan antar layer tetap satu arah dan mudah dipelihara.

---

# Compatibility

| Item                        | Status     |
| --------------------------- | ---------- |
| Backward Compatibility      | Compatible |
| Database Migration Required | No         |
| API Breaking Change         | No         |

---

# Alternatives Considered

## Business Logic di Controller

Tidak dipilih karena menyebabkan controller menjadi besar (*fat controller*), sulit diuji, dan sulit digunakan kembali.

---

## Business Logic di Repository

Tidak dipilih karena repository bertanggung jawab terhadap persistence, bukan aturan bisnis.

---

## Business Logic di Model

Pendekatan Active Record dapat bekerja untuk aplikasi sederhana.

Namun, karena proyek ini dipersiapkan untuk memiliki banyak modul dan proses bisnis yang kompleks, pendekatan tersebut tidak dipilih sebagai standar arsitektur.

---

## Generic CRUD Service

Service yang hanya meneruskan pemanggilan repository tanpa menambahkan business rule tidak dipilih.

Service harus memberikan nilai tambah berupa koordinasi proses bisnis dan penerapan aturan domain.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-003 — Base API Controller
* ADR-004 — Repository Pattern
* ADR-006 — Exception Handling

ADR ini menetapkan bahwa Service Layer merupakan pusat seluruh business logic pada backend LSP Multi Bintang Komunikasi, sekaligus menjadi batas yang jelas antara proses HTTP, aturan bisnis, dan akses data.
