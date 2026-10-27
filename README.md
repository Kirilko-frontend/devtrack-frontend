# DevTrack Frontend

Web client for **DevTrack**, a job application tracker: manage companies, vacancies and interviews, and see your job search progress on a dashboard.

- **Live app:** https://devtrack-frontend-e0ru.onrender.com/
- **Backend repository:** https://github.com/Kirilko-frontend/devtrack-backend

> The backend runs on Render's free plan and sleeps after 15 minutes of inactivity. The first request after a pause can take 30-60 seconds.

**Demo account:** `<email>` / `<password>`

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
- Deployed on **Render** (Static Site)

## Getting started

### Prerequisites

- Node.js 20+
- Running https://devtrack-backend-314v.onrender.com

### Installation

```bash
git clone <repo-url>
cd devtrack-frontend
npm install
```

### Environment variables

Create `.env.local` in the project root (optional locally, since the app falls back to `http://localhost:3000`):

```env
VITE_API_URL=http://localhost:3000
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API. On production it is `/api` (proxied to the backend). |

### Run

```bash
# development
npm run dev

# type-check and production build
npm run build
```

## Deployment (Render Static Site)

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Environment variable:** `VITE_API_URL=/api`
- **Redirects/Rewrites** (order matters):

| Source | Destination | Action |
|---|---|---|
| `/api/*` | `https://<your-backend>.onrender.com/*` | Rewrite |
| `/*` | `/index.html` | Rewrite |

The first rule proxies API calls through the frontend domain, so the auth cookie is first-party and is not blocked by browsers. The second rule makes client-side routing work on page refresh.

`VITE_API_URL` is baked into the bundle at build time, so changing it requires a redeploy.

## Project status

Actively developed. Planned: notification manager, more dashboard analytics.

## Author

**Kyrylo Kakulia**, Frontend / Fullstack Developer
https://github.com/Kirilko-frontend
https://www.linkedin.com/in/kyrylo-kakulia-3557b9371/
kkir614@gmail.com
