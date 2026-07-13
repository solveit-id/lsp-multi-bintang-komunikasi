# ADR-006 — Exception Handling

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** akan menangani berbagai proses bisnis, mulai dari autentikasi, pengelolaan CMS, registrasi sertifikasi, asesmen, hingga audit trail.

Dalam sistem yang terus berkembang, kegagalan dapat berasal dari berbagai sumber, seperti:

* pelanggaran aturan bisnis;
* validasi input;
* autentikasi dan otorisasi;
* database;
* layanan eksternal;
* kesalahan tak terduga.

Apabila setiap Controller atau Service menangani exception dengan caranya masing-masing, maka akan muncul:

* struktur response yang tidak konsisten;
* duplikasi penanganan error;
* kesulitan melakukan logging;
* kode yang sulit dipelihara.

Diperlukan mekanisme penanganan exception yang terpusat dan konsisten.

---

# Decision

Seluruh exception diproses melalui mekanisme penanganan exception global aplikasi.

Controller dan Service tidak diperbolehkan mengembalikan response error secara manual apabila exception dapat diproses oleh mekanisme global.

Exception diklasifikasikan menjadi dua kategori utama.

## 1. Business Exception

Exception yang merepresentasikan pelanggaran terhadap aturan bisnis (domain).

Contoh:

* registrasi telah ditutup;
* peserta tidak memenuhi syarat;
* asesor tidak dapat ditugaskan;
* dokumen telah diverifikasi.

Business Exception dibuat hanya apabila benar-benar mewakili aturan bisnis yang spesifik.

---

## 2. Technical Exception

Exception yang berasal dari framework, infrastruktur, atau komponen teknis.

Contoh:

* `ValidationException`
* `AuthenticationException`
* `AuthorizationException`
* `ModelNotFoundException`
* `QueryException`

Exception tersebut diproses oleh mekanisme global sesuai kebutuhan aplikasi.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Konsistensi

Seluruh endpoint menghasilkan format error yang seragam.

### Maintainability

Perubahan strategi penanganan error dilakukan pada satu lokasi.

### Reliability

Logging dan monitoring dapat dilakukan secara terpusat.

### Separation of Concerns

Controller dan Service tetap fokus pada tanggung jawab utamanya tanpa harus mengatur format response error.

---

# Consequences

## Positif

* Penanganan error menjadi konsisten.
* Struktur response error lebih mudah dipahami oleh frontend.
* Logging dapat dilakukan secara terpusat.
* Business rule lebih mudah dibedakan dari kesalahan teknis.

## Trade-off

* Memerlukan konfigurasi exception global.
* Developer harus memahami perbedaan antara Business Exception dan Technical Exception.

Trade-off tersebut diterima karena meningkatkan kualitas dan konsistensi aplikasi.

---

# Implementation

Implementasi penanganan exception mengikuti prinsip berikut.

## 1. Global Exception Handling

Seluruh exception diproses melalui mekanisme exception global Laravel.

Controller tidak menangkap exception hanya untuk membangun response JSON yang sama berulang kali.

---

## 2. Business Exception

Business Exception digunakan apabila suatu kondisi benar-benar merepresentasikan aturan domain.

Contoh:

```text id="nzyxvk"
RegistrationClosedException

CertificationAlreadyApprovedException

AssessmentAlreadyCompletedException
```

Business Exception tidak dibuat untuk setiap kemungkinan kesalahan, melainkan hanya ketika memberikan makna yang jelas terhadap domain bisnis.

---

## 3. Technical Exception

Exception bawaan Laravel dan PHP tetap digunakan apabila telah merepresentasikan kondisi yang terjadi.

Tidak ada kewajiban membungkus seluruh Technical Exception ke dalam exception baru.

---

## 4. Standardized Error Response

Seluruh response error mengikuti format REST API yang konsisten sehingga mudah diproses oleh frontend dan sistem eksternal.

Mekanisme pembentukan response dilakukan secara terpusat.

---

## 5. Logging Integration

Exception yang perlu dicatat diproses bersama mekanisme logging aplikasi.

Keputusan mengenai logging mengacu pada ADR-007.

---

## 6. Service Responsibility

Service diperbolehkan melempar exception ketika menemukan pelanggaran aturan bisnis.

Service tidak bertanggung jawab membangun response HTTP.

---

## 7. Controller Responsibility

Controller tidak menangani exception domain secara manual apabila dapat ditangani oleh mekanisme global.

Controller tetap fokus pada alur HTTP.

---

## 8. Interaction Rules

Hubungan antar layer mengikuti aturan berikut.

```text id="n9r3v6"
Controller → Service                     ✔
Service → throw Business Exception       ✔
Global Exception Handler → HTTP Response ✔

Controller → try/catch untuk semua error ✘
Repository → HTTP Response               ✘
Model → HTTP Response                    ✘
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

## Try/Catch pada Setiap Controller

Tidak dipilih karena menghasilkan duplikasi kode dan meningkatkan risiko inkonsistensi format response.

---

## Seluruh Exception Dibungkus ke Custom Exception

Pendekatan ini dipertimbangkan, tetapi tidak dipilih.

Framework telah menyediakan banyak Technical Exception yang informatif dan sesuai kebutuhan.

Membungkus seluruh exception hanya akan menambah kompleksitas tanpa manfaat yang sepadan.

---

## Business Exception untuk Setiap Error

Tidak dipilih.

Business Exception hanya digunakan apabila benar-benar mewakili aturan domain.

Kesalahan teknis tetap menggunakan exception bawaan framework atau bahasa.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-003 — Base API Controller
* ADR-005 — Service Layer
* ADR-007 — Logging Foundation

ADR ini menetapkan bahwa penanganan exception pada backend LSP Multi Bintang Komunikasi dilakukan secara terpusat, membedakan antara aturan bisnis dan kesalahan teknis, serta menghasilkan response yang konsisten untuk seluruh REST API.
