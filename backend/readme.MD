# Appsmartt Backend - Prueba Técnica

Backend desarrollado con Node.js, Express, TypeORM y PostgreSQL para la gestión de operaciones financieras.

## 🚀 Características

- **Autenticación JWT** con middleware de seguridad
- **Operaciones financieras** (compra/venta) con transacciones
- **Validación robusta** de datos de entrada
- **Arquitectura limpia** (Controller → Service → Repository)
- **Base de datos PostgreSQL** con TypeORM
- **Manejo de errores** centralizado
- **Variables de entorno** para configuración
- **TypeScript** para mayor seguridad de tipos

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (DB, JWT)
│   ├── controllers/     # Controladores HTTP
│   ├── entities/        # Entidades TypeORM
│   ├── middlewares/     # Middlewares (Auth)
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades (Error handler)
│   └── app.ts           # Configuración Express
├── .env.example         # Ejemplo variables de entorno
├── package.json
├── tsconfig.json
└── server.ts            # Punto de entrada
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repo>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

6. **Compilar para producción**
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Autenticación

#### POST /api/auth/login
Iniciar sesión de usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

#### POST /api/auth/register
Registrar nuevo usuario
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "Password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

#### GET /api/auth/validate
Validar token JWT (requiere Authorization header)

### Operaciones (Requieren Autenticación)

#### POST /api/operations
Crear nueva operación
```json
{
  "type": "buy", // "buy" o "sell"
  "amount": 1500.50,
  "currency": "USD"
}
```

#### GET /api/operations
Obtener operaciones del usuario
- Query params: `?page=1&limit=10`

#### GET /api/operations/:id
Obtener operación específica por ID

## 🔒 Seguridad

- **JWT Authentication**: Tokens seguros con expiración
- **Validación de datos**: express-validator en todas las rutas
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para origins específicos
- **Transacciones**: Integridad de datos en PostgreSQL
- **Hash de contraseñas**: bcryptjs con salt

## 🏗️ Arquitectura

### Patrón utilizado: Controller → Service → Repository

1. **Controllers**: Manejan HTTP requests/responses y validaciones
2. **Services**: Contienen lógica de negocio y coordinan repositorios
3. **Repositories**: Acceso a datos y operaciones de base de datos
4. **Middlewares**: Autenticación y validaciones transversales