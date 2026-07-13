# ADR-010 — DTO Architecture

| Status | Accepted |
|----------|----------|
| ADR | 010 |
| Title | DTO Architecture |
| Date | 2026-07-12 |
| Author | Project Architecture Team |

---

# 1. Context

LSP Multi Bintang Komunikasi menerapkan arsitektur modular dengan pemisahan tanggung jawab yang ketat antara:

- HTTP Layer
- Application Layer
- Domain Layer
- Infrastructure Layer

Pada implementasi awal ditemukan bahwa data sering berpindah antar layer menggunakan:

- Request
- Array
- Eloquent Model

Pendekatan tersebut memiliki beberapa kelemahan:

- coupling yang tinggi terhadap Laravel
- sulit dilakukan refactoring
- tidak memiliki kontrak yang jelas
- sulit dianalisis menggunakan static analysis
- rawan penggunaan array yang tidak konsisten

Karena itu diperlukan standar resmi mengenai penggunaan Data Transfer Object (DTO).

---

# 2. Decision

Seluruh perpindahan data antar layer menggunakan DTO.

DTO menjadi satu-satunya objek yang digunakan untuk membawa data dari satu layer ke layer lain.

DTO bukan Entity.

DTO bukan Model.

DTO bukan Service.

DTO hanya membawa data.

---

# 3. Objectives

Standar DTO dibuat untuk mencapai tujuan berikut.

- Strong typing
- Immutability
- Readability
- Maintainability
- Testability
- Static Analysis Friendly
- IDE Friendly
- Layer Decoupling

---

# 4. DTO Categories

Project membedakan DTO menjadi dua kategori.

## 4.1 Request DTO

Digunakan untuk membawa data dari HTTP menuju Application Layer.

Contoh:

- LoginData
- RegisterData
- CreateNewsData
- UpdateProfileData

Request DTO dapat memiliki factory method seperti:

```php
public static function fromRequest(Request $request): self
```
