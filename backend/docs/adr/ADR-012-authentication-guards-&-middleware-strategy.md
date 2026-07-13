# ADR-012 — Authentication Guards & Middleware Strategy

* **Status**: Accepted
* **Date**: 2026-07-12
* **Deciders**: Architecture Team
* **Supersedes**: None
* **Superseded By**: None

---

# 1. Context

Sistem LSP Multi Bintang Komunikasi menggunakan Laravel Sanctum sebagai mekanisme autentikasi utama untuk REST API.

Setelah implementasi Login, Logout, dan Current Authenticated User (`/auth/me`), diperlukan keputusan arsitektur mengenai bagaimana autentikasi diterapkan secara konsisten pada seluruh endpoint API.

Tanpa standar yang jelas, proyek berisiko mengalami inkonsistensi seperti:

* penggunaan guard yang berbeda-beda,
* middleware ditempatkan di berbagai lokasi,
* beberapa endpoint menggunakan facade `Auth`,
* endpoint lain menggunakan `Request`,
* sulit mengetahui endpoint mana yang bersifat publik dan mana yang membutuhkan autentikasi.

Karena itu diperlukan strategi autentikasi yang menjadi standar proyek.

---

# 2. Decision

Proyek menetapkan bahwa autentikasi API menggunakan satu guard utama, yaitu **Sanctum**, dengan middleware diterapkan pada level route.

Authenticated user diperoleh melalui objek `Request`, sedangkan Authorization akan dibangun sebagai lapisan terpisah setelah fondasi Authentication selesai.

---

# 3. Principles

## 3.1 Single Authentication Guard

Seluruh endpoint API menggunakan guard:

```text
sanctum
```

Tidak digunakan guard API lain kecuali terdapat kebutuhan arsitektur baru yang telah disetujui melalui ADR.

---

## 3.2 Route-Level Middleware

Middleware autentikasi diterapkan pada route.

Contoh:

```php
Route::middleware('auth:sanctum')
    ->group(function (): void {
        //
    });
```

Middleware tidak ditempatkan pada constructor controller.

Hal ini membuat seluruh aturan akses terlihat secara eksplisit pada definisi route.

---

## 3.3 Public vs Protected Endpoint

Endpoint dibagi menjadi dua kategori.

### Public Endpoint

Tidak membutuhkan autentikasi.

Contoh:

* POST `/auth/login`

---

### Protected Endpoint

Membutuhkan autentikasi melalui Sanctum.

Contoh:

* GET `/auth/me`
* POST `/auth/logout`

Seluruh endpoint protected wajib berada di dalam middleware group `auth:sanctum`.

---

## 3.4 Authenticated User Resolution

Authenticated user diperoleh melalui:

```php
$request->user()
```

Controller tidak menggunakan:

* `Auth::user()`
* `auth()->user()`

Keputusan ini dipilih untuk menjaga konsistensi dengan HTTP Request Lifecycle serta mengurangi ketergantungan pada facade.

---

## 3.5 Service Layer Independence

Service tidak mengetahui mekanisme autentikasi HTTP.

Controller bertugas memperoleh authenticated user dari `Request`, kemudian meneruskannya ke Service.

Contoh:

```php
$user = $request->user();

$this->authenticationService->me($user);
```

Dengan demikian Service tetap dapat digunakan pada konteks lain seperti:

* Console Command
* Queue Job
* Event Listener
* Scheduler
* Testing

---

## 3.6 Authentication Before Authorization

Authentication dan Authorization dipisahkan.

Authentication bertugas menjawab:

> "Siapa pengguna ini?"

Authorization bertugas menjawab:

> "Apa yang boleh dilakukan pengguna ini?"

Authorization tidak boleh dijalankan sebelum Authentication berhasil.

---

## 3.7 Single Source of Authentication Truth

Seluruh endpoint yang membutuhkan autentikasi menggunakan mekanisme yang sama.

Tidak diperbolehkan mencampur:

* Session Authentication
* Basic Authentication
* Custom Token Validation
* Manual Token Parsing

di dalam API tanpa ADR baru.

---

# 4. Consequences

## Positive

* Strategi autentikasi konsisten di seluruh proyek.
* Route menjadi sumber informasi utama mengenai endpoint publik dan protected.
* Controller tetap tipis.
* Service tidak bergantung pada HTTP.
* Mudah diperluas untuk RBAC dan Policy.
* Mengurangi risiko inkonsistensi implementasi.

## Negative

* Seluruh endpoint protected harus secara eksplisit dimasukkan ke middleware group.
* Pengembang harus mengikuti standar pengambilan authenticated user melalui `Request`.

Trade-off ini diterima demi menjaga konsistensi arsitektur.

---

# 5. Alternatives Considered

## Alternative A — Constructor Middleware

Contoh:

```php
public function __construct()
{
    $this->middleware('auth:sanctum');
}
```

Ditolak.

Alasan:

* aturan akses tersembunyi di dalam controller,
* sulit mengaudit endpoint,
* route tidak lagi menjadi sumber informasi utama.

---

## Alternative B — Auth Facade

Contoh:

```php
Auth::user();
```

Didukung oleh Laravel, namun tidak dipilih sebagai standar proyek.

Alasan:

* lebih bergantung pada facade,
* kurang eksplisit dalam konteks HTTP,
* tidak sejelas penggunaan `$request->user()` pada controller.

---

## Alternative C — Multiple Authentication Guards

Pendekatan multi-guard dipertimbangkan untuk kebutuhan masa depan, misalnya apabila terdapat portal administrator dan portal eksternal dengan mekanisme autentikasi berbeda.

Saat ini tidak diterapkan karena seluruh API menggunakan satu model autentikasi yang sama melalui Laravel Sanctum.

Keputusan ini dapat ditinjau kembali apabila muncul kebutuhan arsitektur baru.

---

# 6. Impact on Future Development

Seluruh endpoint baru wajib mengikuti strategi autentikasi ini.

Contoh:

* User Profile
* User Management
* CMS
* Certification
* News
* Gallery
* Audit Log
* Dashboard

Authorization akan dibangun di atas fondasi yang sama sehingga seluruh modul memiliki mekanisme autentikasi yang konsisten.

---

# 7. Related ADR

* ADR-000 — Architecture Principles
* ADR-001 — UUID Public Identifier
* ADR-003 — Base API Controller
* ADR-005 — Service Layer
* ADR-009 — Authentication Architecture
* ADR-010 — DTO Architecture
* ADR-011 — API Resource Exposure
