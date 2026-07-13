# ADR-013 — Token Lifecycle

* **Status**: Accepted
* **Date**: 2026-07-12
* **Deciders**: Architecture Team
* **Supersedes**: None
* **Superseded By**: None

---

# 1. Context

Sistem menggunakan Laravel Sanctum sebagai mekanisme autentikasi berbasis Personal Access Token.

Pada Phase 3 telah diimplementasikan:

* Login
* Logout
* Current Authenticated User (`/auth/me`)

Namun, belum terdapat keputusan arsitektur mengenai bagaimana token dikelola selama masa hidupnya.

Tanpa strategi yang jelas, aplikasi berpotensi mengalami inkonsistensi dalam pengelolaan token, seperti:

* token tidak pernah kedaluwarsa,
* tidak ada mekanisme pencabutan seluruh token,
* token dari perangkat lama tetap aktif,
* tidak ada identitas token,
* sulit melakukan audit akses.

Karena itu diperlukan standar mengenai lifecycle token.

---

# 2. Decision

Proyek menggunakan Laravel Sanctum Personal Access Token sebagai satu-satunya mekanisme autentikasi API.

Token diperlakukan sebagai resource keamanan yang memiliki siklus hidup jelas, mulai dari pembuatan, penggunaan, pencabutan, hingga kedaluwarsa apabila kebijakan bisnis mengharuskannya.

---

# 3. Principles

## 3.1 Personal Access Token

Seluruh autentikasi API menggunakan Personal Access Token dari Laravel Sanctum.

Session authentication hanya digunakan apabila aplikasi memiliki kebutuhan SPA berbasis cookie.

---

## 3.2 One Token Per Login Session

Setiap proses login menghasilkan token baru.

Token lama tidak ditimpa secara otomatis.

Pendekatan ini memungkinkan penggunaan beberapa perangkat secara bersamaan apabila kebijakan bisnis mengizinkannya.

---

## 3.3 Token Naming

Setiap token wajib memiliki nama yang menggambarkan tujuan penggunaannya.

Contoh:

* `web`
* `mobile`
* `postman`
* `integration-test`

Nama token digunakan untuk meningkatkan keterbacaan dan audit.

---

## 3.4 Current Token Revocation

Logout hanya menghapus token yang digunakan pada request saat ini.

Contoh:

```php
$request->user()
    ->currentAccessToken()
    ?->delete();
```

Token pada perangkat lain tetap aktif.

---

## 3.5 Global Token Revocation

Apabila diperlukan, sistem dapat menyediakan mekanisme untuk mencabut seluruh token milik pengguna.

Contoh implementasi:

```php
$user->tokens()->delete();
```

Fitur ini digunakan untuk:

* Logout All Devices
* Akun dikompromikan
* Reset keamanan akun
* Kebijakan administrator

---

## 3.6 Token Expiration

Secara default, token tidak memiliki masa berlaku.

```php
config('sanctum.expiration') === null
```

Apabila kebijakan keamanan berubah, masa berlaku token dapat ditentukan melalui:

* konfigurasi Sanctum,
* atau parameter `expiresAt` saat membuat token.

Perubahan ini tidak mengubah kontrak autentikasi API.

---

## 3.7 Token Abilities

Saat ini seluruh token memiliki kemampuan penuh.

```php
['*']
```

Penggunaan ability yang lebih spesifik dapat dipertimbangkan apabila aplikasi membutuhkan pembatasan akses berdasarkan jenis token.

---

## 3.8 Authentication Token Type

Seluruh nama token menggunakan enum proyek.

Contoh:

```php
AuthenticationToken::WEB
```

Controller dan Service tidak menggunakan literal string seperti:

```php
'web'
```

Pendekatan ini meningkatkan type safety dan mengurangi kesalahan penulisan.

---

## 3.9 Token Exposure

Plain text token hanya dikembalikan sekali, yaitu pada saat login berhasil.

Endpoint lain tidak boleh mengembalikan token kembali.

---

## 3.10 Token Storage

Sistem tidak pernah menyimpan plain text token.

Database hanya menyimpan nilai hash yang dikelola oleh Laravel Sanctum.

---

# 4. Consequences

## Positive

* Siklus hidup token terdokumentasi dengan jelas.
* Mendukung penggunaan multi-device.
* Mendukung logout dari perangkat saat ini maupun seluruh perangkat.
* Siap untuk penambahan masa berlaku token tanpa perubahan besar.
* Konsisten dengan mekanisme bawaan Laravel Sanctum.

## Negative

* Diperlukan pengelolaan token yang lebih disiplin apabila jumlah token pengguna meningkat.
* Pengembang harus menggunakan enum token dan tidak membuat nama token secara acak.

Trade-off ini diterima demi menjaga konsistensi dan keamanan.

---

# 5. Alternatives Considered

## Alternative A — Single Token Per User

Token lama selalu dihapus ketika login.

Ditolak.

Alasan:

* memaksa logout dari perangkat lain,
* kurang fleksibel untuk penggunaan multi-device,
* tidak sesuai dengan kebutuhan aplikasi modern.

---

## Alternative B — JWT

JSON Web Token dipertimbangkan sebagai alternatif.

Ditolak.

Alasan:

* Laravel Sanctum telah memenuhi kebutuhan proyek,
* revocation lebih sederhana,
* integrasi lebih baik dengan ekosistem Laravel,
* kompleksitas lebih rendah.

---

## Alternative C — Token Expiration Mandatory

Seluruh token wajib memiliki masa berlaku.

Belum diterapkan.

Alasan:

* kebutuhan bisnis saat ini belum mengharuskan masa berlaku tertentu,
* Laravel Sanctum telah menyediakan mekanisme apabila diperlukan di masa depan.

---

# 6. Impact on Future Development

ADR ini menjadi dasar implementasi:

* Logout All Devices
* Token Management
* Device Management
* Session Monitoring
* Security Audit
* Forced Logout oleh Administrator
* Kebijakan masa berlaku token
* Pembatasan kemampuan token (abilities)

Seluruh fitur tersebut harus mengikuti prinsip yang ditetapkan dalam dokumen ini.

---

# 7. Related ADR

* ADR-001 — UUID Public Identifier
* ADR-003 — Base API Controller
* ADR-005 — Service Layer
* ADR-006 — Exception Handling
* ADR-009 — Authentication Architecture
* ADR-010 — DTO Architecture
* ADR-011 — API Resource Exposure
* ADR-012 — Authentication Guards & Middleware Strategy
