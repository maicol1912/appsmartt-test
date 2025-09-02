# 📖 Appsmartt – Proyecto Fullstack

Este proyecto contiene un **backend en Node.js + Express + TypeORM** y un **frontend en Vite/React**.  

---

## ⚡ Requisitos previos
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional, para levantar DB y servicios)

---

## ▶️ Cómo correr la aplicación en local

### 1. Levantar el **backend**
```bash
cd backend
./run-server.bat
```
Esto compila y levanta el servidor en `http://localhost:3000`.

---

### 2. Levantar el **frontend**
```bash
cd frontend
npm run dev
```
El frontend estará disponible en `http://localhost:5173`.

---

## 🌐 Endpoints principales del backend
- **Healthcheck** → [http://localhost:3000/api/healthcheck](http://localhost:3000/api/healthcheck)  
- **Auth** → `/api/auth/...`  
- **Operations** → `/api/operations/...`  

---

## 🐳 Correr con Docker (opcional)
Si prefieres usar Docker Compose:
```bash
docker-compose --env-file .env up --build -d
```

Esto levanta:
- **Postgres** en `db:5432`  
- **Backend Node.js** en `http://localhost:3000`  
- **Nginx proxy** en `http://localhost/api/...`  

---

## 📌 Notas
- Si usas el proxy con Nginx, el frontend debe consumir la API desde:  
  ```
  http://localhost/api/...
  ```
  en lugar de `http://localhost:3000/api/...`.
