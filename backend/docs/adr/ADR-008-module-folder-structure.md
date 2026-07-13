# ADR-008 — Modular Architecture & Dependency Rules

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dipersiapkan untuk berkembang dari Website Company Profile menjadi Sistem Informasi LSP yang terdiri dari banyak domain bisnis, seperti:

* Authentication
* Authorization
* User Management
* CMS
* News
* Certification Scheme
* Assessment
* TUK
* Audit Trail
* Dashboard
* Future LSP Modules

Seiring bertambahnya jumlah modul, struktur aplikasi berisiko berubah menjadi monolit yang sulit dipelihara apabila seluruh komponen ditempatkan berdasarkan jenis file (controller, model, service, repository) tanpa mempertimbangkan domain bisnis.

Selain itu, hubungan antar modul yang tidak terkontrol dapat menyebabkan:

* ketergantungan dua arah (circular dependency);
* kebocoran business rule antar modul;
* meningkatnya coupling;
* sulitnya melakukan pengujian dan pengembangan fitur secara mandiri.

Diperlukan arsitektur modular yang memiliki aturan dependensi yang jelas.

---

# Decision

Backend menggunakan arsitektur **Feature-First Modular Architecture**.

Setiap modul menjadi batas (*boundary*) dari satu domain bisnis dan bertanggung jawab terhadap seluruh komponen yang berkaitan dengan domain tersebut.

Setiap modul memiliki:

* Controller
* Service
* Repository
* Request
* Resource
* Model
* Policy (jika diperlukan)
* Event (jika diperlukan)
* Listener (jika diperlukan)

Modul hanya mengekspos kontrak atau service yang memang diperlukan oleh modul lain.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### High Cohesion

Komponen yang berkaitan dengan satu domain berada dalam satu modul sehingga lebih mudah dipahami.

### Low Coupling

Hubungan antar modul dijaga seminimal mungkin sehingga perubahan pada satu modul tidak berdampak langsung pada modul lain.

### Scalability

Penambahan modul baru tidak memerlukan perubahan struktur aplikasi secara menyeluruh.

### Maintainability

Developer dapat bekerja pada satu domain tanpa harus memahami keseluruhan sistem.

---

# Consequences

## Positif

* Struktur proyek mengikuti domain bisnis.
* Modul lebih mudah dikembangkan dan diuji.
* Risiko circular dependency berkurang.
* Pengembangan paralel oleh beberapa developer menjadi lebih mudah.

## Trade-off

* Struktur direktori menjadi lebih dalam dibanding pendekatan layer-first.
* Developer harus memahami batas tanggung jawab setiap modul.

Trade-off tersebut diterima karena memberikan skalabilitas dan konsistensi yang lebih baik untuk proyek jangka panjang.

---

# Implementation

Implementasi arsitektur modular mengikuti prinsip berikut.

## 1. Feature-First Structure

Setiap domain bisnis memiliki direktori tersendiri.

Contoh:

```text
Modules
│
├── Authentication
├── Authorization
├── User
├── CMS
├── News
├── CertificationScheme
├── Assessment
├── Audit
└── Settings
```

Nama direktori dapat berubah mengikuti kebutuhan proyek, namun prinsip feature-first tetap dipertahankan.

---

## 2. Module Ownership

Setiap modul memiliki seluruh komponen yang menjadi tanggung jawab domain tersebut.

Contoh:

```text
News
│
├── Controllers
├── Requests
├── Resources
├── Services
├── Repositories
├── Models
└── Policies
```

Komponen tidak ditempatkan pada modul lain.

---

## 3. Dependency Direction

Hubungan antar layer mengikuti aturan berikut.

```text
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
```

Ketergantungan hanya diperbolehkan ke bawah.

---

## 4. Module Dependency Rules

Hubungan antar modul mengikuti aturan berikut.

```text
Module A
        │
        ▼
Service
        │
        ▼
Interface / Public Contract
        │
        ▼
Module B
```

Akses langsung ke implementasi internal modul lain tidak diperbolehkan.

---

## 5. Shared Components

Komponen yang benar-benar digunakan lintas modul ditempatkan pada area bersama, misalnya:

```text
Core

atau

Shared
```

Komponen shared harus bersifat generik dan tidak mengandung business rule milik domain tertentu.

---

## 6. Repository Isolation

Repository hanya digunakan oleh Service pada domain yang bersangkutan.

Repository tidak boleh dipanggil langsung oleh:

* Controller;
* Modul lain;
* Resource;
* Model.

---

## 7. Business Rule Isolation

Business rule hanya berada pada Service milik modul tersebut.

Business rule tidak boleh dipindahkan ke:

* Repository;
* Model;
* Shared Component.

---

## 8. Cross-Module Communication

Apabila suatu modul membutuhkan proses bisnis dari modul lain, komunikasi dilakukan melalui Service atau kontrak yang memang dipublikasikan.

Akses langsung ke model atau repository milik modul lain tidak diperbolehkan.

---

## 9. Interaction Rules

Aturan hubungan antar layer dan modul adalah sebagai berikut.

```text
Controller → Service                     ✔
Service → Repository                     ✔
Repository → Model                       ✔

Module → Public Service                  ✔
Module → Public Interface                ✔

Controller → Repository                  ✘
Controller → Model                       ✘
Repository → Repository Modul Lain       ✘
Repository → Service                     ✘
Model → Service                          ✘
Model → Repository                       ✘
Shared → Business Rule                   ✘
```

---

# Compatibility

| Item                        | Status     |
| --------------------------- | ---------- |
| Backward Compatibility      | Compatible |
| Database Migration Required | No         |
| API Breaking Change         | No         |

---

# Alternatives Considered

## Layer-First Architecture

Pendekatan seperti:

```text
Controllers

Models

Repositories

Services
```

tidak dipilih karena ketika jumlah modul bertambah, setiap direktori akan menjadi sangat besar dan sulit dikelola.

---

## Package per Module

Pendekatan ini dipertimbangkan untuk memisahkan setiap modul menjadi package independen.

Namun, kompleksitas tersebut belum diperlukan pada tahap awal pengembangan Website Company Profile.

Arsitektur saat ini tetap memungkinkan migrasi menuju package modular apabila dibutuhkan di masa depan.

---

## Shared Repository

Repository lintas modul tidak dipilih.

Setiap repository merupakan bagian dari domain tertentu dan tidak boleh digunakan sebagai utilitas bersama.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-002 — Base Model Architecture
* ADR-004 — Repository Pattern
* ADR-005 — Service Layer

ADR ini menetapkan bahwa backend LSP Multi Bintang Komunikasi menggunakan arsitektur modular berbasis domain dengan aturan dependensi yang jelas untuk menjaga kohesi tinggi, coupling rendah, dan skalabilitas jangka panjang.
