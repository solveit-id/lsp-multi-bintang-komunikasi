# ADR-009 — Authentication Architecture

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dibangun sebagai REST API yang akan digunakan oleh aplikasi frontend berbasis React serta dipersiapkan untuk berkembang menjadi Sistem Informasi LSP yang lengkap.

Seluruh modul aplikasi bergantung pada identitas pengguna yang telah terautentikasi, termasuk:

* Authorization & RBAC
* User Management
* CMS
* Certification
* Assessment
* Audit Trail
* Dashboard
* Future LSP Modules

Oleh karena itu diperlukan mekanisme autentikasi yang:

* aman;
* sederhana untuk Single Page Application (SPA);
* mudah dipelihara;
* dapat berkembang tanpa perubahan arsitektur yang besar.

---

# Decision

Backend menggunakan **Laravel Sanctum** sebagai mekanisme autentikasi utama.

Autentikasi dilakukan menggunakan **Personal Access Token**.

Setelah proses login berhasil, backend akan:

1. memverifikasi kredensial pengguna;
2. membuat Personal Access Token;
3. mengembalikan token beserta informasi pengguna kepada client.

Seluruh endpoint yang memerlukan autentikasi wajib menggunakan middleware autentikasi yang sesuai.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Official Support

Laravel Sanctum merupakan solusi autentikasi resmi yang dikembangkan dan dipelihara oleh tim Laravel.

### SPA Compatibility

Sanctum sangat sesuai untuk aplikasi React yang berkomunikasi melalui REST API.

### Simplicity

Konfigurasi Sanctum lebih sederhana dibanding implementasi OAuth2 penuh, namun tetap memenuhi kebutuhan proyek.

### Scalability

Pendekatan ini tetap relevan apabila di masa depan sistem memiliki:

* dashboard administrator;
* portal asesi;
* portal asesor;
* aplikasi mobile;
* integrasi layanan internal.

---

# Consequences

## Positif

* Arsitektur autentikasi sederhana dan konsisten.
* Mudah diintegrasikan dengan React.
* Mendukung banyak token untuk satu pengguna apabila diperlukan.
* Siap digunakan sebagai fondasi Authorization & RBAC.

## Trade-off

* Manajemen token menjadi tanggung jawab backend.
* Revokasi token harus dikelola secara eksplisit.

Trade-off tersebut diterima karena memberikan keseimbangan antara keamanan, kemudahan implementasi, dan skalabilitas.

---

# Security Considerations

Authentication mengikuti prinsip **Secure by Default** yang telah ditetapkan pada ADR-000.

Implementasi keamanan meliputi:

## Password Hashing

Password disimpan menggunakan algoritma hashing bawaan Laravel.

Password tidak boleh disimpan dalam bentuk plaintext maupun menggunakan algoritma hashing yang lemah.

---

## HTTPS

Seluruh komunikasi antara client dan server pada lingkungan produksi wajib menggunakan HTTPS.

Token autentikasi tidak boleh dikirim melalui koneksi yang tidak terenkripsi.

---

## Token Confidentiality

Personal Access Token hanya ditampilkan kepada client pada saat token dibuat.

Backend tidak menyediakan endpoint untuk menampilkan kembali nilai token yang telah diterbitkan.

---

## Token Revocation

Token dapat dicabut (revoke) ketika:

* logout;
* akun dinonaktifkan;
* perubahan password (sesuai kebijakan keamanan);
* indikasi kompromi akun.

---

## Principle of Least Privilege

Authentication hanya membuktikan identitas pengguna.

Hak akses pengguna ditentukan oleh mekanisme Authorization & RBAC yang didokumentasikan secara terpisah.

---

# Implementation

Implementasi Authentication mengikuti prinsip berikut.

## 1. Authentication Provider

Laravel menggunakan provider pengguna yang terpusat.

Model `User` menjadi sumber identitas seluruh pengguna aplikasi.

---

## 2. Authentication Flow

Alur autentikasi mengikuti pola berikut.

```text
Client
        │
        ▼
POST /api/auth/login
        │
        ▼
Form Request Validation
        │
        ▼
Authentication Service
        │
        ▼
User Repository
        │
        ▼
Password Verification
        │
        ▼
Create Sanctum Token
        │
        ▼
Return Authenticated User
```

---

## 3. Logout Flow

```text
Client
        │
        ▼
POST /api/auth/logout
        │
        ▼
Authenticated User
        │
        ▼
Delete Current Token
        │
        ▼
Return Success Response
```

---

## 4. Current User

Endpoint identitas pengguna menggunakan token yang aktif.

Client tidak diperbolehkan mengirim UUID pengguna untuk memperoleh identitas dirinya sendiri.

---

## 5. Token Management

Setiap Personal Access Token dimiliki oleh satu pengguna.

Manajemen token dilakukan menggunakan mekanisme yang disediakan Laravel Sanctum.

---

## 6. Thin Controller

Controller Authentication hanya bertanggung jawab terhadap:

* menerima request;
* memanggil Service;
* mengembalikan response.

Business rule tetap berada pada Service Layer.

---

## 7. Interaction Rules

Hubungan antar layer mengikuti aturan berikut.

```text
Client → Authentication Controller      ✔
Controller → Authentication Service     ✔
Service → User Repository               ✔
Repository → User Model                 ✔

Controller → User Model                 ✘
Controller → Password Verification      ✘
Repository → Token Generation           ✘
Model → Authentication Logic            ✘
```

---

# Compatibility

| Item                        | Status                                       |
| --------------------------- | -------------------------------------------- |
| Backward Compatibility      | Compatible                                   |
| Database Migration Required | Yes (Laravel Sanctum Personal Access Tokens) |
| API Breaking Change         | No                                           |

---

# Alternatives Considered

## Laravel Passport

Dipertimbangkan karena mendukung OAuth2 secara penuh.

Namun kompleksitasnya belum diperlukan untuk kebutuhan Website Company Profile dan roadmap Sistem Informasi LSP saat ini.

---

## JWT Authentication

Pendekatan berbasis JSON Web Token dipertimbangkan.

Namun, Laravel Sanctum dipilih karena:

* didukung resmi oleh Laravel;
* lebih sederhana untuk SPA;
* lebih mudah dipelihara;
* terintegrasi langsung dengan ekosistem Laravel.

---

## Session-Based Authentication

Pendekatan session tradisional tidak dipilih sebagai standar utama karena backend dirancang sebagai REST API yang akan diakses oleh frontend React dan berpotensi diperluas ke aplikasi lain.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-005 — Service Layer
* ADR-006 — Exception Handling
* ADR-007 — Logging Foundation
* ADR-008 — Modular Architecture & Dependency Rules

ADR ini menetapkan bahwa Laravel Sanctum menjadi fondasi autentikasi backend LSP Multi Bintang Komunikasi, menggunakan Personal Access Token sebagai mekanisme identitas pengguna, serta menjadi dasar bagi implementasi Authorization & RBAC pada fase berikutnya.
