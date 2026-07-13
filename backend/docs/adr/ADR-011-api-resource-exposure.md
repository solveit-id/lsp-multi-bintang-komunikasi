# ADR-011 — API Resource Exposure

* **Status**: Accepted
* **Date**: 2026-07-12
* **Deciders**: Architecture Team
* **Supersedes**: None
* **Superseded By**: None

---

# 1. Context

Sistem LSP Multi Bintang Komunikasi dikembangkan sebagai REST API yang akan dikonsumsi oleh berbagai client, seperti:

* Web Frontend (React)
* Mobile Application
* Internal Administration Panel
* Integrasi dengan sistem eksternal (future)

API merupakan kontrak publik (public contract). Oleh karena itu, struktur response tidak boleh bergantung langsung pada implementasi internal aplikasi seperti Eloquent Model maupun struktur database.

Seiring bertambahnya kompleksitas sistem, model domain akan memiliki:

* relasi yang semakin banyak,
* atribut internal,
* metadata,
* audit information,
* soft delete,
* permission,
* computed attribute.

Seluruh informasi tersebut tidak selalu layak diekspos kepada client.

Karena itu diperlukan standar arsitektur mengenai bagaimana resource dikembalikan melalui API.

---

# 2. Decision

Seluruh endpoint API wajib mengembalikan representasi resource yang telah dipetakan ke DTO atau resource data object.

Model Eloquent tidak boleh dikembalikan secara langsung sebagai response API.

Presentation Layer hanya mengenal DTO atau objek representasi yang telah ditetapkan sebagai kontrak API.

---

# 3. Principles

## 3.1 API Contract First

API merupakan kontrak publik.

Struktur response harus stabil walaupun implementasi database berubah.

Perubahan struktur tabel tidak boleh memaksa perubahan kontrak API.

---

## 3.2 Domain Model Is Internal

Model Eloquent merupakan implementasi internal.

Model tidak dianggap sebagai kontrak publik.

Model hanya digunakan pada:

* Repository Layer
* Service Layer
* Domain Layer

Model tidak boleh diekspos langsung ke client.

---

## 3.3 DTO as Public Contract

DTO menjadi media pertukaran data antar layer.

DTO mewakili resource yang akan diterima oleh client.

DTO tidak memiliki business logic.

DTO tidak mengetahui database.

DTO tidak mengetahui HTTP.

---

## 3.4 Explicit Field Exposure

Setiap field yang dikembalikan API harus dipilih secara eksplisit.

Contoh yang baik:

```php
AuthenticatedUserData
{
    uuid,
    name,
    email,
}
```

Bukan:

```php
return User::find(...);
```

Dengan demikian tidak ada field yang ikut terekspos secara tidak sengaja.

---

## 3.5 Principle of Least Exposure

API hanya mengembalikan informasi yang benar-benar dibutuhkan.

Contoh:

Endpoint `/auth/me`

Mengembalikan:

* uuid
* name
* email

Tidak mengembalikan:

* password
* remember_token
* internal id
* timestamps
* deleted_at
* permission cache
* audit information

---

## 3.6 Stable Public Identifier

Seluruh resource yang dapat diakses client menggunakan UUID sebagai identifier publik.

Primary key integer tetap dianggap sebagai implementasi internal.

Client tidak boleh bergantung pada integer ID.

Keputusan ini mengikuti ADR-001 — UUID Public Identifier.

---

## 3.7 Consistent Response Format

Seluruh response API mengikuti BaseApiController.

Response sukses:

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Response gagal:

```json
{
    "success": false,
    "message": "...",
    "errors": {}
}
```

Seluruh endpoint wajib mengikuti struktur ini.

---

## 3.8 Layer Responsibility

Controller bertanggung jawab terhadap HTTP.

Service bertanggung jawab terhadap business logic.

Repository bertanggung jawab terhadap akses data.

DTO bertanggung jawab sebagai kontrak data.

Setiap layer memiliki tanggung jawab yang jelas.

---

# 4. Consequences

## Positive

* API contract stabil.
* Tidak terjadi kebocoran implementasi internal.
* Database dapat berevolusi tanpa memengaruhi client.
* DTO dapat digunakan kembali oleh berbagai endpoint.
* Mudah didokumentasikan menggunakan OpenAPI.
* Mudah dilakukan versioning API.
* Mendukung arsitektur enterprise.

## Negative

* Dibutuhkan proses mapping dari Model ke DTO.
* Jumlah class bertambah.
* Dibutuhkan disiplin agar seluruh endpoint mengikuti standar yang sama.

Trade-off ini diterima karena menghasilkan kontrak API yang jauh lebih stabil.

---

# 5. Alternatives Considered

## Alternative A — Return Eloquent Model Directly

Contoh:

```php
return User::find($id);
```

Ditolak.

Alasan:

* API bergantung pada struktur model.
* Berisiko mengekspos field internal.
* Sulit melakukan evolusi model.
* Tidak sesuai dengan arsitektur berlapis.

---

## Alternative B — Menggunakan Laravel API Resources sebagai Kontrak Utama

Pendekatan ini dipertimbangkan karena Laravel menyediakan `JsonResource` sebagai mekanisme transformasi response.

Pendekatan ini tidak dipilih sebagai kontrak utama proyek.

Alasan:

* Proyek telah menetapkan DTO sebagai kontrak antar layer (ADR-010).
* DTO dapat digunakan di luar HTTP layer, seperti CLI, Queue, Event, atau integrasi internal.
* Resource dapat ditambahkan di masa depan apabila diperlukan sebagai adapter presentation, bukan sebagai representasi domain.

---

## Alternative C — Hybrid (DTO + API Resource)

Pendekatan hybrid dipertimbangkan untuk proyek berskala besar.

Saat ini tidak diterapkan karena menambah kompleksitas tanpa memberikan manfaat yang signifikan terhadap kebutuhan sistem saat ini.

Keputusan ini dapat ditinjau kembali apabila proyek berkembang menjadi multi-client dengan kebutuhan representasi resource yang berbeda.

---

# 6. Impact on Future Development

Seluruh endpoint baru wajib mengembalikan DTO atau representasi data yang telah ditetapkan.

Contoh:

* Authentication
* User Profile
* User Management
* Certification Scheme
* Assessor
* Assessee
* CMS
* News
* Gallery
* Audit Log

Seluruh modul mengikuti prinsip yang sama sehingga kontrak API tetap konsisten.

---

# 7. Related ADR

* ADR-000 — Architecture Principles
* ADR-001 — UUID Public Identifier
* ADR-002 — Base Model
* ADR-003 — Base API Controller
* ADR-004 — Repository Pattern
* ADR-005 — Service Layer
* ADR-006 — Exception Handling
* ADR-007 — Logging Foundation
* ADR-008 — Module Folder Structure
* ADR-009 — Authentication Architecture
* ADR-010 — DTO Architecture
