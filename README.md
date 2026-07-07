# 🚀 LSP Multi Bintang Komunikasi

Sistem informasi berbasis web yang dikembangkan sebagai proyek LSP menggunakan arsitektur **Monorepo**, terdiri dari:

- **Backend** : Laravel (REST API)
- **Frontend** : React + Vite
- **Database** : MySQL

---

# 📁 Project Structure

```
lsp-multi-bintang-komunikasi
│
├── backend/              # Laravel REST API
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   └── ...
│
├── frontend/             # React + Vite
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── README.md
```

---

# 🛠 Tech Stack

## Backend

- Laravel 12
- PHP 8.x
- MySQL
- REST API

## Frontend

- React
- Vite
- Axios
- Tailwind CSS

## Version Control

- Git
- GitHub

---

# 👥 Development Team

| Role | Branch |
|-------|--------|
| Project Leader | `main` |
| Frontend Developer | `frontend-faiq` |
| Frontend Developer | `frontend-azmi` |
| Backend Developer | `backend-hafizh` |
| Backend Developer | `backend-mahesa` |

---

# 🌳 Git Branch Strategy

```
main
│
├── frontend-faiq
├── frontend-azmi
├── backend-hafizh
└── backend-mahesa
```

### Branch Rules

- `main` digunakan sebagai branch produksi (stable).
- Setiap developer hanya bekerja pada branch masing-masing.
- Dilarang melakukan push langsung ke `main`.
- Seluruh perubahan dilakukan melalui Pull Request.
- Merge ke `main` dilakukan oleh Project Leader.

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/solveit-id/lsp-multi-bintang-komunikasi.git
```

Masuk ke folder project

```bash
cd lsp-multi-bintang-komunikasi
```

---

## 2. Backend Setup (Laravel)

Masuk ke folder backend

```bash
cd backend
```

Install dependency

```bash
composer install
```

Copy file environment

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Konfigurasi database pada file `.env`

Jalankan migration

```bash
php artisan migrate
```

Jalankan backend

```bash
php artisan serve
```

Backend berjalan pada

```
http://localhost:8000
```

---

## 3. Frontend Setup (React)

Masuk ke folder frontend

```bash
cd frontend
```

Install dependency

```bash
npm install
```

Jalankan React

```bash
npm run dev
```

Frontend berjalan pada

```
http://localhost:5173
```

---

# 🔗 API Integration

Frontend akan mengakses backend melalui REST API.

Contoh endpoint:

```
GET     /api/users
POST    /api/login
POST    /api/logout
GET     /api/profile
```

Base URL

```
http://localhost:8000/api
```

---

# 📌 Development Workflow

1. Checkout ke branch masing-masing.

```bash
git checkout frontend-faiq
```

atau

```bash
git checkout backend-hafizh
```

2. Lakukan pengembangan.

3. Commit perubahan.

```bash
git add .
git commit -m "Create Login Feature"
```

4. Push ke branch masing-masing.

```bash
git push origin frontend-faiq
```

5. Buat Pull Request menuju `main`.

6. Review oleh Project Leader.

7. Merge ke `main`.

---

# 📋 Coding Convention

## Commit Message

Gunakan format berikut:

```
feat: add login page
fix: validation login
style: improve navbar
refactor: clean authentication logic
docs: update README
```

---

# 📂 Folder Responsibility

## Backend

- API
- Authentication
- Database
- Validation
- Business Logic

## Frontend

- UI
- Components
- Routing
- API Integration
- State Management

---

# 🚀 Deployment

Backend

```
Laravel
```

Frontend

```
React + Vite Build
```

---

# 📄 License

This project is developed for educational purposes as part of the LSP Multi Bintang Komunikasi project.
