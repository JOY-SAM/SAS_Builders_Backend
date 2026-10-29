<div align="center">

# SAS Builders Backend

**REST API for the SAS Builders fleet and expense management platform.**

Vehicles, drivers, expenses and engine-hour-based oil change tracking, served by NestJS on Fastify with Prisma and PostgreSQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](Dockerfile)

</div>

---

## Table of contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Authentication](#authentication)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Oil change logic](#oil-change-logic)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Deployment](#deployment)
- [Related repositories](#related-repositories)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Features

- **Vehicles:** create, list, view and update vehicles and machinery, including engine hours and oil change intervals
- **Drivers:** manage drivers, who are stored as users with `isDriver = true`
- **Expenses:** full CRUD for vehicle expenses (fuel, maintenance, tolls, repairs and more)
- **Oil change tracking:** live hours-left status for every vehicle, plus a notification feed for vehicles that are due soon or overdue
- **JWT authentication:** every route is protected by a global JWT guard unless it is marked `@Public()`
- **Swagger docs:** interactive OpenAPI documentation at `/docs`
- **Health check:** database and uptime checks via `@nestjs/terminus`
- **Docker:** multi-stage `Dockerfile` with dev and prod Compose files
- **CI/CD:** a GitHub Actions workflow builds the app and deploys to AWS EC2 on every push to `prod`

## Screenshots

> These screenshots use fictional demo data.

**Swagger API documentation** (`/docs`)

![Swagger UI listing all API endpoints](docs/screenshots/swagger.png)

**Consumed by the [SAS Builders](https://github.com/JOY-SAM/SAS_Builders) frontend**

### Expense dashboard

![Expense dashboard](docs/screenshots/expenses.png)

<br />

### Oil change alerts

![Oil change dashboard with the alerts popover open](docs/screenshots/oil-change-alerts.png)

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [NestJS 10](https://nestjs.com/) on [Fastify](https://fastify.dev/) |
| Language | TypeScript (Node.js 20) |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| Auth | Passport JWT, bcrypt |
| Validation | [Joi](https://joi.dev/) |
| Docs | `@nestjs/swagger` (OpenAPI 3) |
| Logging | Winston |
| Testing | Jest, Supertest |
| Ops | Docker, Docker Compose, GitHub Actions, AWS EC2 |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (see `.nvmrc`) and npm
- PostgreSQL, either installed locally or through the provided Docker Compose file
- [Docker](https://www.docker.com/) (optional)

### Option A: Run locally

```bash
# 1. Clone and install
git clone https://github.com/JOY-SAM/SAS_Builders_Backend.git
cd SAS_Builders_Backend
npm install

# 2. Configure the environment
cp .env.example .env
# then edit DATABASE_URL, JWT_SECRET, HEALTH_TOKEN, and so on

# 3. Create the database schema
npx prisma migrate dev

# 4. (Optional) Create an admin user interactively
npm run create-admin

# 5. Start the dev server with hot reload
npm run dev
```

The API is served at `http://localhost:<API_PORT>/api/v1`, and Swagger docs are at `http://localhost:<API_PORT>/docs`.

> **Tip:** The Next.js frontend also uses port `3000` by default. Set `API_PORT=3001` when you run both on one machine.

### Option B: Run with Docker

```bash
cp .env.example .env     # set API_PORT=3001 to match the Compose port mapping
npm run docker:dev
```

This starts:

| Service | Port | Purpose |
| --- | --- | --- |
| `postgresql` | `5432` | PostgreSQL database |
| `nestjs` | `3001`, `9229` | API with hot reload and the Node debugger |
| `studio` | `5555` | Prisma Studio |
| `migrate` | n/a | Runs `prisma db push` once on startup |

## Environment variables

See [`.env.example`](.env.example) for the full list.

| Variable | Example | Description |
| --- | --- | --- |
| `API_PORT` | `3000` | Port the API listens on |
| `API_PREFIX` | `/api/v1` | Global route prefix |
| `SWAGGER_ENABLE` | `1` | Set to `1` to serve Swagger UI at `/docs` |
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/db?schema=public` | Prisma connection string |
| `JWT_SECRET` | `ThisMustBeChanged` | Secret used to sign and verify JWTs |
| `JWT_ISSUER` | `IssuerApplication` | JWT issuer claim |
| `HEALTH_TOKEN` | `ThisMustBeChanged` | Bearer token required by `/health` |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA` | | Used by Docker Compose to set up PostgreSQL |

> Change every `ThisMustBeChanged` value before you deploy to production.

## Authentication

Every endpoint requires a `Bearer` JWT except `POST /auth/login` and `GET /health`, which uses `HEALTH_TOKEN` instead.

```bash
# 1. Log in to get a token (valid for 30 days)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"your-password"}'
# => { "access_token": "eyJhbGciOi..." }

# 2. Call a protected route
curl http://localhost:3000/api/v1/vehicles \
  -H 'Authorization: Bearer <access_token>'
```

To create the first user, run `npm run create-admin`.

## API reference

All routes are prefixed with `API_PREFIX` (default `/api/v1`). The full schema is in Swagger at `/docs`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Database and uptime health check (needs `HEALTH_TOKEN`) |
| `POST` | `/auth/login` | Exchange email and password for a JWT |
| `GET` | `/vehicles` | List vehicles |
| `POST` | `/vehicles` | Create a vehicle |
| `GET` | `/vehicles/:id` | Get a vehicle |
| `PATCH` | `/vehicles/:id` | Update a vehicle |
| `GET` | `/drivers` | List drivers |
| `POST` | `/drivers` | Create a driver |
| `GET` | `/drivers/:id` | Get a driver |
| `PATCH` | `/drivers/:id` | Update a driver |
| `GET` | `/expenses` | List expenses |
| `POST` | `/expenses` | Create an expense |
| `GET` | `/expenses/:id` | Get an expense |
| `PATCH` | `/expenses/:id` | Update an expense |
| `DELETE` | `/expenses/:id` | Delete an expense |
| `GET` | `/oil-expense` | Oil change status for every vehicle |
| `POST` | `/oil-expense` | Log hours run and/or an oil change expense (resets the cycle) |
| `GET` | `/oil-expense/oil_change/notification` | Vehicles with fewer than 100 hours left, or overdue |
| `PATCH` | `/oil-expense/:vehicleId` | Update a vehicle's oil change interval |

<details>
<summary>Example: <code>GET /oil-expense/oil_change/notification</code></summary>

```json
[
  {
    "vehicleNo": "TN 74 CK 4410",
    "status": "Maintenance Due",
    "hoursLeft": -60,
    "lastChangedOn": 2800,
    "currentHours": 3360,
    "oilChangeInterval": 500,
    "vehicleId": 2
  }
]
```

</details>

## Data model

```mermaid
erDiagram
    User ||--o{ Expense : "logs"
    Vehicle ||--o{ Expense : "incurs"

    User {
        int id PK
        string email UK
        string name
        string password
        string phoneNumber
        boolean isAdmin
        boolean isDriver
    }
    Vehicle {
        int id PK
        string number
        string name
        string category
        int oilLastChangedHour
        int oilChangeIntervalHours
        int totalHoursRan
        string description
    }
    Expense {
        int id PK
        int userId FK
        int vehicleId FK
        string category
        decimal amount
        string description
        datetime expenseTime
    }
```

The schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma).

## Oil change logic

For each vehicle:

```text
hoursLeft = oilChangeIntervalHours - (totalHoursRan - oilLastChangedHour)
```

- `hoursLeft <= 0` sets the status to **Maintenance Due**
- `hoursLeft < 100` puts the vehicle in the notification feed
- `POST /oil-expense` with `hours` adds to `totalHoursRan`. With an `amount`, it also records an **Oil Change** expense and sets `oilLastChangedHour` to the current total, which starts a new cycle. The whole operation runs in a single database transaction.

## Project structure

```text
.
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # SQL migrations
│   └── seed.ts                # Sample seed data
├── scripts/
│   └── create-admin.ts        # Interactive admin user creation
├── src/
│   ├── server.ts              # Bootstrap: Fastify, CORS, Swagger, global prefix
│   ├── common/decorators/     # @Public() decorator
│   └── modules/
│       ├── app.module.ts      # Root module and global JWT guard
│       ├── auth/              # Login, JWT strategy and guard
│       ├── users/             # User service
│       ├── vehicles/          # Vehicle CRUD
│       ├── drivers/           # Driver CRUD
│       ├── expenses/          # Expense CRUD
│       ├── oil-expense/       # Oil change status, notifications and logging
│       └── common/            # Config, Prisma, logger, health check, security guards
├── docs/                      # Deployment and CI/CD guides, screenshots
├── .github/workflows/         # GitHub Actions deploy pipeline
├── Dockerfile                 # Multi-stage build (development and production)
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start with nodemon and ts-node, loading `.env` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the compiled app (`dist/server.js`) |
| `npm run test` | Run Jest tests |
| `npm run lint` | Lint `src/**/*.ts` with ESLint |
| `npm run create-admin` | Create an admin user interactively |
| `npm run docker:dev` | Start the dev Docker stack |
| `npm run docker:prod` | Start the production Docker stack |
| `npx prisma migrate dev` | Apply migrations in development |
| `npx prisma studio` | Open the Prisma database GUI |

## Deployment

Each push to the **`prod`** branch triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow builds the app, connects to the EC2 host over SSH, pulls the latest code, writes `.env` from repository secrets, and restarts the stack with `docker-compose.prod.yml`.

Step-by-step guides:

- [Production setup guide (AWS EC2, Amazon Linux 2023)](docs/PRODUCTION_GUIDE.md)
- [CI/CD pipeline setup](docs/CICD_SETUP.md)

## Related repositories

- **Frontend:** [JOY-SAM/SAS_Builders](https://github.com/JOY-SAM/SAS_Builders), a Next.js 15 and shadcn/ui dashboard

## Acknowledgements

Bootstrapped from [saluki/nestjs-template](https://github.com/saluki/nestjs-template).

## License

Released under the [MIT License](LICENSE).
