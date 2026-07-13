# ADR-002 — Base Model Architecture

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** akan terus berkembang dari Website Company Profile menjadi Sistem Informasi LSP yang terdiri dari banyak domain, seperti User Management, CMS, News, Certification Scheme, Assessment, Audit Trail, hingga Dashboard Analytics.

Tanpa sebuah model dasar yang seragam, setiap model akan mengimplementasikan konfigurasi umum secara berulang, seperti:

* UUID;
* konfigurasi Eloquent;
* helper bersama;
* casting umum;
* perilaku lintas domain.

Pendekatan tersebut meningkatkan duplikasi kode dan berpotensi menyebabkan inkonsistensi antar model.

Diperlukan satu titik pusat untuk meletakkan perilaku yang bersifat umum sehingga seluruh model memiliki standar implementasi yang sama.

---

# Decision

Seluruh model domain wajib mewarisi satu kelas dasar, yaitu:

```text
App\Models\BaseModel
```

`BaseModel` menjadi fondasi seluruh model Eloquent pada aplikasi.

Model domain tidak diperbolehkan mewarisi `Illuminate\Database\Eloquent\Model` secara langsung.

Contoh:

```text
BaseModel
    │
    ├── User
    ├── News
    ├── CertificationScheme
    ├── Testimonial
    ├── ContactMessage
    ├── AuditLog
    └── ...
```

Pendekatan ini memastikan seluruh model mengikuti standar arsitektur yang sama.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Konsistensi

Seluruh model memiliki konfigurasi dasar yang sama sehingga perilaku aplikasi menjadi lebih mudah diprediksi.

### Maintainability

Perubahan terhadap konfigurasi umum cukup dilakukan pada satu tempat tanpa perlu memperbarui seluruh model.

### Reusability

Perilaku lintas domain dapat digunakan kembali tanpa duplikasi implementasi.

### Scalability

Penambahan fitur global pada model dapat dilakukan secara bertahap tanpa mengubah setiap model secara individual.

---

# Consequences

## Positif

* Tidak terjadi duplikasi konfigurasi model.
* Seluruh model memiliki fondasi yang konsisten.
* Penambahan perilaku global menjadi lebih mudah.
* Standar pengembangan model menjadi jelas.

## Trade-off

* Seluruh model memiliki ketergantungan terhadap `BaseModel`.
* Perubahan pada `BaseModel` harus dilakukan dengan hati-hati karena berdampak pada seluruh model aplikasi.

Trade-off tersebut diterima karena manfaat konsistensi dan kemudahan pemeliharaan jauh lebih besar.

---

# Implementation

`BaseModel` menjadi tempat implementasi seluruh konfigurasi model yang bersifat umum.

Implementasi saat ini meliputi:

## 1. Pewarisan Model

Seluruh model domain mewarisi `BaseModel`.

Contoh:

```text
BaseModel
    │
    ├── User
    ├── News
    ├── CertificationScheme
    ├── Testimonial
    └── ...
```

---

## 2. UUID Generation

`BaseModel` menggunakan trait bawaan Laravel `HasUuids`.

Metode `newUniqueId()` dioverride agar seluruh model menghasilkan **UUID v7** secara otomatis.

Standar UUID dijelaskan lebih rinci pada **ADR-001**.

---

## 3. Konfigurasi Bersama

Seluruh konfigurasi Eloquent yang bersifat lintas domain ditempatkan pada `BaseModel`, bukan pada masing-masing model.

Apabila di masa mendatang diperlukan perilaku global baru, implementasinya diprioritaskan pada `BaseModel` selama tidak melanggar prinsip *Single Responsibility*.

---

## 4. Kontrak Model

Seluruh model baru wajib mengikuti pola berikut.

```text
BaseModel
    │
    └── Domain Model
```

Model tidak diperbolehkan mewarisi `Model` secara langsung kecuali terdapat kebutuhan khusus yang telah didokumentasikan melalui ADR baru.

---

# Alternatives Considered

## Menggunakan `Model` Laravel Secara Langsung

Tidak dipilih karena menyebabkan konfigurasi umum tersebar pada banyak model dan meningkatkan risiko inkonsistensi.

---

## Menggunakan Trait pada Setiap Model

Pendekatan ini dipertimbangkan untuk membagikan perilaku umum.

Namun, penggunaan banyak trait pada setiap model menyebabkan konfigurasi menjadi tersebar dan sulit dikelola ketika jumlah model terus bertambah.

`BaseModel` dipilih karena memberikan satu titik pusat untuk konfigurasi lintas domain.

---

## Menggunakan Abstract Model per Modul

Pendekatan seperti:

```text
CMSModel

UserModel

CertificationModel
```

dipertimbangkan tetapi belum dipilih.

Saat ini seluruh modul masih memiliki kebutuhan dasar yang sama sehingga satu `BaseModel` dinilai lebih sederhana dan lebih mudah dipelihara.

Apabila di masa depan terdapat kebutuhan khusus pada suatu domain, keputusan tersebut akan didokumentasikan melalui ADR baru.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-001 — UUID as Public Identifier
* ADR-004 — Repository Pattern

ADR ini menjadi fondasi seluruh model domain yang digunakan pada backend LSP Multi Bintang Komunikasi dan memastikan seluruh model mengikuti standar implementasi yang konsisten.
