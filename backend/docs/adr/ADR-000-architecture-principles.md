# ADR-000 — Architecture Principles

**Status:** Accepted

---

# Context

Backend **LSP Multi Bintang Komunikasi** dirancang tidak hanya untuk mendukung Website Company Profile, tetapi juga sebagai fondasi jangka panjang menuju **Sistem Informasi LSP** yang mencakup proses sertifikasi, asesmen, manajemen Tempat Uji Kompetensi (TUK), penugasan asesor, manajemen dokumen, audit trail, hingga dashboard analitik.

Agar sistem dapat berkembang tanpa perubahan arsitektur yang signifikan, diperlukan seperangkat prinsip dasar yang menjadi acuan seluruh keputusan teknis selama siklus hidup proyek.

Dokumen ini mendefinisikan prinsip arsitektur yang wajib dipatuhi oleh seluruh pengembang sebelum menambahkan fitur baru ataupun melakukan perubahan pada sistem.

---

# Decision

Seluruh pengembangan backend harus mengikuti prinsip-prinsip berikut.

## 1. Architecture Freeze

Arsitektur inti ditetapkan sebelum implementasi fitur dimulai.

Perubahan terhadap arsitektur hanya diperbolehkan apabila:

* terdapat alasan teknis yang kuat;
* meningkatkan maintainability, scalability, security, atau performance;
* tidak menimbulkan inkonsistensi terhadap modul yang telah dibangun;
* disetujui sebelum implementasi dilakukan.

---

## 2. Roadmap Freeze

Pengembangan dilakukan berdasarkan roadmap yang telah disepakati.

Urutan fase tidak boleh dilompati agar setiap fitur dibangun di atas fondasi yang telah stabil.

Contoh:

```text
Project Foundation
        ↓
Infrastructure Layer
        ↓
Authentication
        ↓
Authorization & RBAC
        ↓
Business Modules
        ↓
Future LSP Modules
```

---

## 3. Implementation Freeze

Setiap fase harus diselesaikan sepenuhnya sebelum berpindah ke fase berikutnya.

Satu fase dianggap selesai apabila:

* implementasi lengkap;
* telah melalui pengujian;
* tidak menyisakan TODO yang memengaruhi fase berikutnya;
* menghasilkan artefak yang dapat langsung digunakan.

---

## 4. Backend-First Development

Backend menjadi sumber kebenaran (*source of truth*) bagi seluruh aplikasi.

Frontend hanya berkomunikasi melalui REST API dan tidak mengandung business rule yang kritikal.

Seluruh aturan bisnis berada pada backend.

---

## 5. Modular Architecture

Sistem dibangun menggunakan struktur berbasis modul (*feature-first*).

Setiap modul memiliki komponen yang saling berkaitan dalam satu domain bisnis.

Contoh:

```text
User
News
CMS
Certification
Assessment
Audit
Settings
```

Pendekatan ini meningkatkan keterbacaan kode serta mempermudah pengembangan fitur baru.

---

## 6. Layered Architecture

Tanggung jawab setiap layer dipisahkan secara tegas.

```text
HTTP
    │
Controller
    │
Service
    │
Repository
    │
Model
    │
Database
```

Aturan utama:

* Controller menangani HTTP.
* Service menangani business logic.
* Repository menangani akses data.
* Model merepresentasikan entitas database.

---

## 7. Separation of Concerns

Setiap class hanya memiliki satu tanggung jawab utama.

Business logic tidak boleh ditempatkan di:

* Controller;
* Model;
* Resource;
* Middleware.

Business logic berada pada Service Layer.

---

## 8. Convention over Configuration

Mengutamakan konvensi yang konsisten dibanding konfigurasi yang berulang.

Contoh:

* seluruh model mewarisi `BaseModel`;
* seluruh API controller mewarisi `BaseApiController`;
* seluruh service mewarisi `BaseService`;
* seluruh repository mengikuti kontrak yang sama.

---

## 9. Secure by Default

Keamanan menjadi bagian dari desain sistem sejak awal.

Prinsip ini mencakup:

* Authentication;
* Authorization;
* RBAC;
* Validasi input;
* SQL Injection Prevention;
* XSS Protection;
* CSRF Protection (jika relevan);
* File Upload Security;
* Rate Limiting;
* Encryption;
* Logging;
* Audit Trail.

Fitur keamanan tidak ditambahkan sebagai pelengkap, tetapi menjadi bagian dari arsitektur inti.

---

## 10. REST API First

Seluruh komunikasi antara frontend dan backend dilakukan melalui REST API.

Standar yang digunakan:

* endpoint bersifat resource-oriented;
* menggunakan HTTP method yang sesuai;
* memanfaatkan HTTP status code yang tepat;
* memiliki format response yang konsisten.

---

## 11. UUID as Public Identifier

Seluruh endpoint menggunakan UUID sebagai identifier publik.

Primary key numerik hanya digunakan untuk kebutuhan internal database dan relasi.

---

## 12. Business Logic in Service Layer

Seluruh proses bisnis berada pada Service Layer.

Controller tidak diperbolehkan menangani:

* validasi proses bisnis;
* transaksi database;
* koordinasi beberapa repository.

---

## 13. Repository for Data Access

Repository bertanggung jawab terhadap akses data.

Repository tidak boleh berisi:

* business rule;
* proses autentikasi;
* pengiriman email;
* notifikasi;
* logika lintas domain.

---

## 14. Centralized Exception Handling

Seluruh exception diproses secara terpusat.

Controller dan Service tidak melakukan pengembalian response error secara manual apabila exception dapat ditangani oleh mekanisme global.

---

## 15. Structured Logging

Logging aplikasi dipisahkan dari Audit Trail.

* Logging digunakan untuk kebutuhan operasional dan debugging.
* Audit Trail digunakan untuk pencatatan aktivitas pengguna.

Keduanya memiliki tujuan dan media penyimpanan yang berbeda.

---

## 16. Database Consistency

Setiap perubahan data yang melibatkan lebih dari satu operasi wajib menggunakan transaksi database.

Business process harus bersifat atomik.

---

## 17. Extensibility

Seluruh desain harus mempertimbangkan pengembangan menuju Sistem Informasi LSP yang lengkap.

Penambahan modul baru tidak boleh memerlukan perubahan besar terhadap:

* struktur folder;
* struktur database;
* kontrak REST API;
* fondasi infrastruktur.

---

## 18. Maintainability

Kode harus mudah dipahami, diuji, dan dipelihara.

Prioritas diberikan pada:

* konsistensi;
* keterbacaan;
* modularitas;
* dokumentasi;
* minim duplikasi.

---

# Consequences

Dengan menerapkan prinsip-prinsip ini, proyek memperoleh manfaat berikut.

### Positif

* Arsitektur tetap konsisten sepanjang siklus pengembangan.
* Risiko perubahan besar (*major refactoring*) berkurang.
* Onboarding developer baru menjadi lebih mudah.
* Fitur baru dapat dikembangkan secara bertahap tanpa mengganggu modul yang telah stabil.
* Backend siap berkembang dari Company Profile menjadi Sistem Informasi LSP secara bertahap.

### Trade-off

* Proses perancangan awal membutuhkan waktu lebih banyak.
* Penambahan fitur harus mengikuti roadmap yang telah ditetapkan.
* Setiap perubahan arsitektur memerlukan evaluasi terlebih dahulu agar tidak melanggar prinsip yang telah disepakati.

Trade-off tersebut dipandang sepadan dengan peningkatan maintainability, konsistensi, dan skalabilitas sistem.

---

# Implementation

Prinsip-prinsip pada ADR ini menjadi dasar bagi seluruh ADR berikutnya.

| ADR     | Ruang Lingkup             |
| ------- | ------------------------- |
| ADR-001 | UUID as Public Identifier |
| ADR-002 | Base Model Architecture   |
| ADR-003 | Base API Controller       |
| ADR-004 | Repository Pattern        |
| ADR-005 | Service Layer             |
| ADR-006 | Exception Handling        |
| ADR-007 | Logging Foundation        |
| ADR-008 | Modular Folder Structure  |

Seluruh implementasi baru harus dievaluasi terhadap ADR-000 sebelum dilakukan pengembangan. Apabila terdapat keputusan yang bertentangan dengan prinsip-prinsip pada dokumen ini, maka perubahan tersebut harus didokumentasikan melalui ADR baru atau menggantikan ADR yang telah ada sesuai proses pengambilan keputusan arsitektur proyek.
