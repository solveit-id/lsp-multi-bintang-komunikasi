# ADR-007 — Logging Foundation

**Status:** Accepted

**Date:** 2026-07-11

**Deciders:** Project Architecture Team

---

# Context

Backend **LSP Multi Bintang Komunikasi** dirancang sebagai sistem yang akan terus berkembang dari Website Company Profile menjadi Sistem Informasi LSP yang mencakup banyak modul dan proses bisnis.

Seiring meningkatnya kompleksitas aplikasi, diperlukan mekanisme observability yang memungkinkan pengembang untuk:

* menelusuri alur request;
* mengidentifikasi penyebab kegagalan;
* melakukan debugging;
* memonitor perilaku aplikasi;
* menghubungkan beberapa log yang berasal dari proses yang sama.

Tanpa standar logging yang konsisten, proses investigasi akan menjadi lebih sulit dan informasi yang tercatat tidak memiliki konteks yang memadai.

---

# Decision

Aplikasi menggunakan mekanisme logging terpusat yang didasarkan pada **Correlation ID**.

Pada implementasi HTTP, Correlation ID direpresentasikan sebagai **request_id** yang dibuat satu kali pada awal request dan digunakan oleh seluruh log yang dihasilkan selama siklus request tersebut.

Logging dipisahkan secara tegas dari Audit Trail.

* Logging digunakan untuk kebutuhan operasional, debugging, monitoring, dan observability.
* Audit Trail digunakan untuk pencatatan aktivitas pengguna dan kebutuhan audit bisnis.

Kedua mekanisme memiliki tujuan, penyimpanan, dan siklus hidup yang berbeda.

---

# Rationale

Keputusan ini diambil berdasarkan beberapa pertimbangan.

### Observability

Correlation ID memungkinkan seluruh log yang berasal dari satu proses dikelompokkan menjadi satu alur yang mudah ditelusuri.

### Maintainability

Standar logging yang konsisten mempermudah proses analisis ketika terjadi masalah.

### Scalability

Konsep Correlation ID tetap relevan apabila sistem berkembang menggunakan queue, event, scheduler, atau layanan eksternal.

### Separation of Concerns

Logging dan Audit Trail memiliki tujuan yang berbeda sehingga tidak digabungkan dalam satu mekanisme.

---

# Consequences

## Positif

* Seluruh log memiliki konteks yang konsisten.
* Proses debugging menjadi lebih cepat.
* Investigasi insiden lebih mudah dilakukan.
* Sistem siap berkembang menuju arsitektur yang lebih kompleks tanpa mengubah konsep logging.

## Trade-off

* Memerlukan middleware untuk menghasilkan Correlation ID pada setiap request.
* Developer harus menjaga agar context logging tetap konsisten.

Trade-off tersebut diterima karena memberikan peningkatan yang signifikan terhadap kemampuan observability aplikasi.

---

# Implementation

Implementasi Logging Foundation mengikuti prinsip berikut.

## 1. Correlation ID

Setiap HTTP request menghasilkan satu Correlation ID.

Pada implementasi saat ini, Correlation ID disimpan sebagai `request_id` dan tersedia sepanjang siklus request.

Seluruh log yang dihasilkan pada request tersebut menggunakan identifier yang sama.

---

## 2. Request Context

Setiap log dapat diperkaya dengan informasi konteks yang relevan, seperti:

* `request_id`;
* metode HTTP;
* URL;
* alamat IP;
* user agent;
* UUID pengguna (jika tersedia).

Context tersebut ditambahkan secara terpusat sehingga tidak perlu diulang pada setiap pemanggilan log.

---

## 3. Middleware Integration

Correlation ID dihasilkan melalui middleware pada awal request.

Middleware menyimpan identifier tersebut pada objek `Request` sehingga dapat digunakan kembali oleh seluruh komponen aplikasi.

Pendekatan ini memastikan satu request hanya memiliki satu Correlation ID.

---

## 4. Centralized Logging

Seluruh komponen aplikasi menggunakan mekanisme logging bawaan Laravel dengan context yang konsisten.

Tidak dibuat service khusus hanya untuk membungkus operasi logging.

---

## 5. Logging Level

Penggunaan level logging mengikuti standar berikut.

| Level       | Tujuan                                                     |
| ----------- | ---------------------------------------------------------- |
| `debug`     | Informasi untuk proses pengembangan dan troubleshooting.   |
| `info`      | Aktivitas sistem yang berjalan normal.                     |
| `notice`    | Kondisi normal yang layak dicatat.                         |
| `warning`   | Kondisi tidak biasa namun aplikasi masih dapat beroperasi. |
| `error`     | Kegagalan operasi tertentu yang memerlukan perhatian.      |
| `critical`  | Gangguan pada layanan penting aplikasi.                    |
| `alert`     | Kondisi yang membutuhkan tindakan segera.                  |
| `emergency` | Kondisi ketika sistem tidak dapat digunakan.               |

---

## 6. Logging Responsibility

Logging digunakan untuk mencatat:

* exception;
* kegagalan proses;
* informasi operasional;
* kondisi yang diperlukan untuk troubleshooting.

Logging tidak digunakan untuk menyimpan aktivitas bisnis pengguna.

---

## 7. Audit Trail Separation

Audit Trail bukan bagian dari Logging Foundation.

Audit Trail akan memiliki mekanisme, penyimpanan, dan keputusan arsitektur tersendiri pada fase berikutnya.

---

## 8. Interaction Rules

Hubungan antar komponen mengikuti aturan berikut.

```text
HTTP Request
        │
        ▼
Request ID Middleware          ✔
        │
        ▼
Request Context                ✔
        │
        ▼
Application Logging            ✔

Application Logging → Audit Trail        ✘
Audit Trail → Application Logging        ✘
Controller → Generate Request ID         ✘
Service → Generate Request ID            ✘
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

## Logging Tanpa Correlation ID

Tidak dipilih karena menyulitkan pengelompokan log yang berasal dari satu proses yang sama.

---

## Membuat Request ID Baru pada Setiap Pemanggilan Log

Tidak dipilih.

Satu request harus memiliki satu Correlation ID yang konsisten agar seluruh log dapat ditelusuri sebagai satu alur.

---

## Menggunakan Log Service Khusus

Pendekatan ini dipertimbangkan.

Namun, Laravel telah menyediakan fasilitas logging yang lengkap melalui Log Manager.

Menambahkan lapisan service hanya akan meningkatkan kompleksitas tanpa memberikan manfaat arsitektural yang signifikan.

---

## Menggabungkan Logging dan Audit Trail

Tidak dipilih.

Logging dan Audit Trail memiliki tujuan yang berbeda.

Menggabungkan keduanya akan menyulitkan proses observability maupun audit bisnis.

---

# Related ADR

* ADR-000 — Architecture Principles
* ADR-005 — Service Layer
* ADR-006 — Exception Handling
* ADR-008 — Modular Folder Structure

ADR ini menetapkan fondasi observability backend LSP Multi Bintang Komunikasi melalui logging yang terpusat, penggunaan Correlation ID (`request_id`) yang konsisten, serta pemisahan yang tegas antara logging aplikasi dan Audit Trail.
