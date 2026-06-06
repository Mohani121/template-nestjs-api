# template-nestjs-api

A production-ready NestJS API template with authentication, database, and developer tooling pre-configured. Clone it and start writing business logic immediately.

## What's included

- **NestJS** — Node.js framework
- **Prisma 7** — Type-safe ORM
- **PostgreSQL** — Database (runs via Docker)
- **JWT Auth** — Access + refresh tokens, bcrypt password hashing
- **RBAC** — Role-based access control with `@Roles()` decorator
- **Global response shape** — Every response is `{ success, data }` or `{ success, error }`
- **Swagger** — Auto-generated API docs at `/api/docs`
- **Validation** — Auto-validates all request bodies via class-validator
- **Helmet + CORS** — Security headers out of the box
- **ESLint + Prettier** — Code style enforced
- **Husky + lint-staged** — Linting runs on every commit
- **Docker** — Postgres + pgAdmin with one command
- **GitHub Actions CI** — Lint + build on every push

## Requirements

- Node.js >= 20
- pnpm >= 8
- Docker

## Getting started

### 1. Clone the template

```bash
gh repo create my-project --template your-username/template-nestjs-api
cd my-project
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run the command twice — once for `JWT_ACCESS_SECRET`, once for `JWT_REFRESH_SECRET`.

### 4. Start the database

```bash
docker compose up -d
```

### 5. Run migrations

```bash
pnpm db:migrate
```

### 6. Start the server

```bash
pnpm start:dev
```

Server runs at `http://localhost:3000`
API docs at `http://localhost:3000/api/docs`
pgAdmin at `http://localhost:5050` (admin@admin.com / admin)

## Auth endpoints

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Login | No |
| POST | /auth/refresh | Get new access token | Refresh token |
| POST | /auth/logout | Logout | Access token |
| GET | /auth/me | Get current user | Access token |

## Adding a new module

```bash
nest g module modules/your-module
nest g controller modules/your-module --no-spec
nest g service modules/your-module --no-spec
```

Then add your module to `app.module.ts`.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| DATABASE_URL | PostgreSQL connection string | — |
| JWT_ACCESS_SECRET | JWT access token secret | — |
| JWT_ACCESS_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_SECRET | JWT refresh token secret | — |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm start:dev` | Start in development mode |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed the database |