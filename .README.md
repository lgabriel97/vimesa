# Vimesa — Sistema de Gestión de Informes Técnicos 📋

Aplicación fullstack para la gestión del ciclo completo de informes de verificación técnica: creación por técnicos, revisión por administradores, y generación automática de PDFs. Construida como monorepo con React 19 + Express 5 + PostgreSQL, completamente dockerizada.

---

## Screenshots

| Login | Nuevo Informe | Inbox Admin |
| --- | --- | --- |
| ![Login](./docs/login-page.png) | ![Nuevo Informe](./docs/form-page.png) | ![Inbox](./docs/inbox-page.png) |

| Detalle Informe | PDF Generado | Gestión Usuarios |
| --- | --- | --- |
| ![Detalle](./docs/details-page.png) | ![PDF](./docs/pdf-gen.png) | ![Usuarios](./docs/users-page.png) |


---

## Features

- **Autenticación JWT** con cookies, bcrypt para hashing de contraseñas, y middleware de protección de rutas
- **3 roles de usuario** con permisos diferenciados:
  - **Técnico** — crea y edita informes de verificación
  - **Admin** — revisa informes (aprobar / rechazar / devolver) y genera PDFs
  - **GOD** — gestión completa de usuarios (CRUD + cambio de contraseñas)
- **3 tipos de formularios técnicos**: Verificación FM, Verificación FM DDS, y Verificación UCA — cada uno con su propio schema de validación (Zod) y plantilla HTML para PDF
- **Workflow de revisión**: Pendiente → Aprobado / Rechazado / Devuelto, con comentarios del revisor
- **Generación de PDFs** con Puppeteer (renderizado HTML → PDF), con soporte para borradores y versiones definitivas
- **Validación compartida** entre frontend (react-hook-form + Zod) y backend (Zod)
- **Arquitectura extensible** con registry pattern para añadir nuevos tipos de informe sin modificar código existente
- **100% Dockerizado** con multi-stage builds, nginx como reverse proxy, y PostgreSQL con migraciones automáticas y seed

---

## Tech Stack

### Backend

| Layer | Technology |
| --- | --- |
| Runtime | [Node.js 22](https://nodejs.org/) |
| Framework | [Express 5](https://expressjs.com/) |
| Language | [TypeScript 6](https://www.typescriptlang.org/) |
| ORM | [Prisma 7](https://www.prisma.io/) (adapter-pg) |
| Database | [PostgreSQL 16](https://www.postgresql.org/) |
| Auth | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| Validation | [Zod 4](https://zod.dev/) |
| PDF Generation | [Puppeteer](https://pptr.dev/) (HTML → PDF) |
| Dev runner | [tsx](https://github.com/privatenumber/tsx) |

### Frontend

| Layer | Technology |
| --- | --- |
| Framework | [React 19](https://react.dev/) with [React Compiler](https://react.dev/learn/react-compiler) |
| Language | [TypeScript 6](https://www.typescriptlang.org/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (resolvers) |
| Routing | [React Router 7](https://reactrouter.com/) |
| Notifications | [Sonner](https://sonner.emilkowal.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) (dark/light mode) |
| Testing | [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) |

### Infrastructure

| Layer | Technology |
| --- | --- |
| Containers | [Docker](https://www.docker.com/) (multi-stage builds) |
| Orchestration | [Docker Compose](https://docs.docker.com/compose/) |
| Reverse Proxy | [Nginx](https://nginx.org/) (SPA fallback + API proxy + asset caching) |
| Database | PostgreSQL 16 (containerized, with volume persistence) |

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Docker Compose                         │
│                                                            │
│  ┌──────────────────┐    proxy /api/    ┌───────────────┐  │
│  │                  │ ────────────────► │               │  │
│  │  Nginx (:80)     │                   │  Express API  │  │
│  │  React SPA       │ ◄──────────────── │  (:3000)      │  │
│  │  (static files)  │      JSON         │               │  │
│  └──────────────────┘                   └──────┬────────┘  │
│                                                │           │
│                                                │ Prisma    │
│                                                ▼           │
│                                        ┌──────────────┐   │
│                                        │ PostgreSQL   │   │
│                                        │ 16 (:5432)   │   │
│                                        └──────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- Node.js >= 22 y npm (solo para desarrollo local sin Docker)

### Levantar con Docker (producción)

```bash
# Clonar el repo
git clone https://github.com/lgabriel97/vimesa.git
cd vimesa

# Crear archivo de environment
cp .env.prod.example .env

# Editar .env con tus valores (o dejar los de ejemplo para probar)
# Levantar los 3 servicios
docker compose -f docker-compose.prod.yml up --build
```

La app estará disponible en `http://localhost`. Al arrancar, el seed crea los usuarios de prueba automáticamente:

| Email | Contraseña | Rol |
| --- | --- | --- |
| `god@vimesa.com` | `admin123` | Super Admin (GOD) |
| `admin@vimesa.com` | `admin123` | Administrador |
| `tecnico@vimesa.com` | `admin123` | Técnico |

### Desarrollo local (sin Docker)

**1. Levantar la base de datos:**

```bash
cd backend
docker compose up -d   # Solo PostgreSQL
```

**2. Configurar y arrancar el backend:**

```bash
# En /backend
cp .env.example .env   # Si existe, o crear manualmente:
# DATABASE_URL=postgresql://user:password@localhost:5432/verificaciones
# JWT_SECRET=tu-secreto-de-desarrollo
# PORT=3000

npm install
npx prisma migrate dev     # Ejecutar migraciones
npx tsx prisma/seed.ts      # Crear usuarios de prueba
npm run dev                 # Arranca en localhost:3000
```

**3. Arrancar el frontend:**

```bash
# En /vimesa
npm install
# Crear .env con:
# VITE_API_URL=http://localhost:3000
npm run dev                 # Arranca en localhost:5173
```

---

## API Endpoints

Todos los endpoints bajo `/api`. Autenticación requerida via JWT en cookie (excepto login).

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | ❌ | Login (devuelve JWT en cookie) |

### Informes

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/informes` | TECNICO | Crear informe |
| `GET` | `/api/informes` | Any | Listar informes |
| `GET` | `/api/informes/:id` | Any | Detalle de informe |
| `PUT` | `/api/informes/:id` | Any | Editar informe |
| `PATCH` | `/api/informes/:id/revisar` | ADMIN | Revisar informe (aprobar/rechazar/devolver) |
| `POST` | `/api/informes/:id/pdf` | ADMIN | Generar PDF del informe |
| `GET` | `/api/informes/:id/pdfs` | Any | Listar PDFs de un informe |

### PDFs

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `GET` | `/api/pdfs` | Any | Listar todos los PDFs |
| `GET` | `/api/pdfs/:id/download` | Any | Descargar PDF |

### Usuarios

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `GET` | `/api/usuarios` | GOD | Listar usuarios |
| `GET` | `/api/usuarios/:id` | GOD | Detalle de usuario |
| `POST` | `/api/usuarios` | GOD | Crear usuario |
| `PATCH` | `/api/usuarios/:id` | GOD | Editar usuario |
| `PATCH` | `/api/usuarios/:id/password` | GOD | Cambiar contraseña |
| `DELETE` | `/api/usuarios/:id` | GOD | Eliminar usuario |

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Estado del servidor |

---

## Project Structure

```
vimesa/
├── docker-compose.prod.yml          # Orquestación producción (3 servicios)
├── .env.prod.example                # Variables de entorno de ejemplo
│
├── backend/
│   ├── Dockerfile                   # Multi-stage build (builder + runtime)
│   ├── docker-compose.yaml          # Solo PostgreSQL para desarrollo
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma            # Modelos: Usuario, Informe, Pdf
│   │   ├── seed.ts                  # Seed de usuarios de prueba
│   │   └── migrations/              # 9 migraciones incrementales
│   └── src/
│       ├── index.ts                 # Entry point
│       ├── app.ts                   # Express app (CORS, routes, error handler)
│       ├── routes/                  # auth, informes, pdfs, usuarios
│       ├── controllers/             # Lógica de cada endpoint
│       ├── middleware/
│       │   ├── auth.ts              # requireAuth + requireRole
│       │   └── errorHandler.ts      # Error handler global
│       ├── informes/
│       │   ├── registry.ts          # Registry pattern (tipo → schema + PDF)
│       │   ├── verificacion-fm/     # Schema Zod + plantilla HTML
│       │   ├── verificacion-fm-dds/ # Schema Zod + plantilla HTML
│       │   └── verificacion-uca/    # Schema Zod + plantilla HTML
│       ├── pdf/
│       │   └── generador.ts         # Puppeteer HTML → PDF
│       └── lib/
│           ├── prisma.ts            # Prisma client singleton
│           └── env.ts               # Validación de env vars
│
└── vimesa/                          # Frontend
    ├── Dockerfile                   # Multi-stage build (builder + nginx)
    ├── nginx.conf                   # Reverse proxy + SPA fallback + cache
    ├── package.json
    └── src/
        ├── App.tsx                  # Routes + providers
        ├── main.tsx                 # Entry point
        ├── auth/
        │   ├── AuthContext.tsx       # JWT auth context + provider
        │   └── ProtectedRoute.tsx   # Role-based route guard
        ├── layouts/
        │   └── AppLayout.tsx        # Header + navigation + outlet
        ├── login/pages/             # Página de login
        ├── pages/
        │   ├── MisInformes.tsx      # Lista de informes del técnico
        │   └── PdfsAdmin.tsx        # Gestión de PDFs (admin)
        ├── admin/pages/
        │   ├── Inbox.tsx            # Cola de revisión (admin)
        │   ├── InformeDetalle.tsx   # Detalle + acciones de revisión
        │   └── GestionUsuarios.tsx  # CRUD de usuarios (GOD)
        ├── informes/
        │   ├── NuevoInforme.tsx     # Formulario de creación
        │   ├── EditarInforme.tsx    # Formulario de edición
        │   ├── registry.ts         # Registry de tipos (frontend)
        │   └── tipos/
        │       ├── verificacion-fm/       # Componentes + tipos + constantes
        │       ├── verificacion-fm-dds/   # Componentes + tipos + constantes
        │       └── verificacion-uca/      # Componentes + tipos + constantes
        ├── components/
        │   ├── ui/                  # shadcn/ui components
        │   ├── common/              # Componentes compartidos
        │   └── PdfsSection.tsx      # Sección de PDFs reutilizable
        ├── lib/
        │   ├── api.ts               # Axios instance
        │   └── utils.ts             # Utilidades (cn, etc.)
        └── types/
            └── informe.ts           # TypeScript types
```

---

## Database Schema

```
┌─────────────┐       1:N        ┌─────────────┐       1:N       ┌──────────┐
│   Usuario   │ ───────────────► │   Informe   │ ──────────────► │   Pdf    │
│             │  tecnico/revisor │             │                  │          │
│ id          │                  │ id          │                  │ id       │
│ email       │                  │ tipo        │                  │ contenido│
│ passwordHash│                  │ datos (JSON)│                  │ borrador │
│ nombre      │                  │ estado      │                  │ createdAt│
│ rol         │                  │ firma       │                  └──────────┘
│ createdAt   │                  │ comentarios │
└─────────────┘                  │ createdAt   │
                                 │ updatedAt   │
  Roles: TECNICO,               └─────────────┘
         ADMIN, GOD
                               Estados: PENDIENTE,
                               APROBADO, RECHAZADO,
                               DEVUELTO

                               Tipos: VERIFICACION_FM,
                               VERIFICACION_FM_DDS,
                               VERIFICACION_UCA
```

---

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DB_USER` | PostgreSQL user | `vimesa` |
| `DB_PASSWORD` | PostgreSQL password | `(generar con pwgen 32 1)` |
| `DB_NAME` | Database name | `verificaciones` |
| `JWT_SECRET` | JWT signing secret | `(generar con openssl rand -base64 48)` |
| `BACKEND_PORT` | Backend port (optional) | `3000` |
| `FRONTEND_PORT` | Frontend port (optional) | `80` |

---

## License

This project is unlicensed — feel free to use it as reference.