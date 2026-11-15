# DevTrack Frontend

Web client for **DevTrack**, a job application tracker: manage companies, vacancies and interviews, and see your job search progress on a dashboard.

- **Live app:** https://devtrack-frontend-e0ru.onrender.com/
- **Backend repository:** https://github.com/Kirilko-frontend/devtrack-backend

> The backend runs on Render's free plan and sleeps after 15 minutes of inactivity. The first request after a pause can take 30-60 seconds.

**Demo account:** `test@gmail.com` / `test123`

## Screenshots

<img width="1906" height="901" alt="image" src="https://github.com/user-attachments/assets/4de921b7-1d7e-487c-9545-57963ef42360" />
<img width="1913" height="904" alt="image" src="https://github.com/user-attachments/assets/d1d45d06-b1cd-4909-b33e-0f76edb41a72" />
<img width="1913" height="905" alt="image" src="https://github.com/user-attachments/assets/370dac2d-c85f-4fdf-a15a-cc4c13207489" />
<img width="1912" height="906" alt="image" src="https://github.com/user-attachments/assets/abc73048-c4f9-4114-b071-a6f0f775ead9" />
<img width="1912" height="906" alt="image" src="https://github.com/user-attachments/assets/9715ee69-e101-4c08-8efc-65933e14b5b8" />

## Features

- Registration and login (cookie-based session)
- **Dashboard** with charts of applications over time and statuses
- **Vacancies:** create and edit, link to an existing company or create a new one, track status
- **Companies:** grid of companies, create and edit
- **Interviews:** schedule and edit interviews linked to vacancies
- File downloads handled through a dedicated API helper

## Tech stack

- **React** + **TypeScript**
- **Vite**
- **Recharts** for dashboard charts
- Typed API client built on `fetch` with `credentials: 'include'`
- Feature-oriented structure with path aliases (`@app`, `@features`, `@pages`, `@shared`, `@widgets`)
- **Docker** and **Docker Compose** (multi-stage build, nginx for static files)
- Deployed on **Render** (Static Site)

## Getting started

There are two ways to run the project: with Docker (recommended) or locally with Node.js.

### Option 1: Docker (recommended)

Runs the whole stack (PostgreSQL, backend, frontend) with one command. No Node.js or PostgreSQL installation needed.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running).

The Compose files live in a separate repository that ties the frontend and backend together:

```bash
git clone <devtrack-compose-repo-url> devtrack
cd devtrack
git clone https://github.com/Kirilko-frontend/devtrack-backend
git clone https://github.com/Kirilko-frontend/devtrack-frontend

cp .env.example .env     # then set DB_PASSWORD and JWT_SECRET
docker compose up --build
```

- App: http://localhost:5173
- API: http://localhost:3000 (health check: `/health`)

Useful commands:

```bash
docker compose down        # stop containers, keep database data
docker compose down -v     # stop containers and delete database data
docker compose logs -f backend
```

**Development mode with hot reload** (code is mounted into the containers):

```bash
docker compose -f docker-compose.dev.yml up
```

What happens on start:

1. PostgreSQL starts and passes its health check.
2. A one-off `migrate` service applies Prisma migrations.
3. The backend starts (as a non-root user) and the frontend is served by nginx.

Database data and uploaded files are stored in Docker volumes, so they survive container restarts.

### Option 2: Local (without Docker)

**Prerequisites:**

- Node.js 20+
- A running DevTrack backend: either run it locally (see the backend repository) or use the live API

```bash
git clone https://github.com/Kirilko-frontend/devtrack-frontend
cd devtrack-frontend
npm install
```

Create `.env.local` in the project root (optional, since the app falls back to `http://localhost:3000`):

```env
VITE_API_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API. On production it is `/api` (proxied to the backend). |

```bash
# development
npm run dev

# type-check and production build
npm run build
```

The dev server runs at http://localhost:5173.

> `VITE_API_URL` is baked into the bundle at build time, so changing it requires a rebuild.

## Docker files in this repository

| File | Purpose |
|---|---|
| `Dockerfile` | Production image: builds the app with Node, serves static files with nginx |
| `Dockerfile.dev` | Development image: Vite dev server with `--host` |
| `nginx.conf` | Serves `index.html` for client-side routes (React Router) |
| `.dockerignore` | Keeps `node_modules`, `dist` and `.env` out of the image |

The production image takes the API address as a build argument:

```bash
docker build -t devtrack-web --build-arg VITE_API_URL=http://localhost:3000 .
```

## Deployment (Render Static Site)

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **Environment variable:** `VITE_API_URL=/api`
- **Redirects/Rewrites** (order matters):

| Source | Destination | Action |
|---|---|---|
| `/api/*` | `https://devtrack-backend-sxcc.onrender.com` | Rewrite |
| `/*` | `/index.html` | Rewrite |

The first rule proxies API calls through the frontend domain, so the auth cookie is first-party and is not blocked by browsers. The second rule makes client-side routing work on page refresh.

## Project status

Actively developed. Planned: notification manager, more dashboard analytics.

## Author

**Kyrylo Kakulia**, Frontend / Fullstack Developer
https://github.com/Kirilko-frontend
https://www.linkedin.com/in/kyrylo-kakulia-3557b9371/
kkir614@gmail.com
