# GitCRM

GitCRM — це full-stack вебзастосунок для управління клієнтами (CRM) з використанням **MongoDB**, **Node.js (NestJS/Express)** та **React**.  
Проєкт розгортається через **Docker Compose** і включає веб-інтерфейс, REST API та веб-адмінку для бази даних.

---

## 📌 Стек технологій
- **Frontend:** React (Create React App / Vite), REST API клієнт
- **Backend:** Node.js (NestJS або Express), REST API, JWT авторизація
- **Database:** MongoDB
- **Admin DB:** mongo-express
- **Containerization:** Docker & Docker Compose

---

## 🚀 Швидкий старт

### 1. Клонування репозиторію
```bash
git clone https://github.com/yourusername/gitcrm.git
cd gitcrm
```

### 2. Налаштування змінних середовища
Скопіюйте файли `.env.example` у `.env`:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp .env.example .env
```
Потім відредагуйте `.env` файли, вказавши:
- URI підключення до MongoDB
- JWT секрет
- Порти сервісів
- Назву бази даних

### 3. Встановлення Docker та Docker Compose
Перед запуском переконайтеся, що встановлені:
- https://docs.docker.com/get-docker/
- https://docs.docker.com/compose/install/

### 4. Запуск проєкту через Docker
У кореневій директорії виконайте:
```bash
docker-compose up --build
```
Дочекайтеся завершення збірки та запуску контейнерів (**backend**, **frontend**, **mongo-express**).

### 5. Доступ до сервісів
Після запуску:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Mongo Express:** http://localhost:8081

### 6. Зупинка контейнерів
Щоб зупинити сервіси:
```bash
docker-compose down
```
Щоб зупинити та видалити всі дані (включно з БД):
```bash
docker-compose down -v
```

---

## 📂 Структура проєкту
```
gitcrm/
 ├─ backend/         # Серверна частина (NestJS / Express)
 ├─ frontend/        # Клієнтська частина (React)
 ├─ docker-compose.yml
 ├─ .env.example
 ├─ README.md
```
