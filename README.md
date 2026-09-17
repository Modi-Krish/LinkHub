# LinkHub — Branded Short-Link & Bio-Link Hub

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

> **Assessment Project 04** — Full-Stack MERN Application

LinkHub is a web application that combines a **high-performance URL-shortening engine** with a **customizable Link-in-Bio platform**. It allows authenticated users to create short URLs, track click analytics, and customize their public bio pages.

---

## ✨ Features

| Category | Features |
|----------|----------|
| **URL Shortening** | Auto-generated 6-char codes, custom vanity slugs, collision detection, valid URL enforcement |
| **Redirect Engine** | `GET /r/:shortCode` → 302 redirect, async click telemetry, indexed lookups |
| **Analytics** | Total clicks, clicks over time (7d/30d/90d), top referrers, device distribution charts |
| **Link Library** | Search, pagination, one-click copy, QR code generation + download, delete with confirmation |
| **Bio Pages** | Avatar, display name, bio, social link manager, 3 themes (Minimal Light, Dark Slate, Gradient) |
| **Authentication** | Pair-token JWT (15m access + 7d refresh), HTTP-only cookies, token rotation, forgot/reset password |
| **Security** | `express-rate-limit`, `helmet`, CORS, IP hashing (HMAC-SHA256), Zod validation, ownership checks |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Coss UI (shadcn ecosystem) |
| **State** | Zustand, TanStack Query v5 |
| **Charts** | Recharts |
| **QR** | qrcode.react |
| **Forms** | React Hook Form + Zod |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB + Mongoose |
| **Auth** | jsonwebtoken, bcryptjs, cookie-parser |
| **Security** | helmet, express-rate-limit, cors |
| **Testing** | Vitest, Supertest |

---

## 📂 Project Structure

```
Com.bot/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/ui/      # Coss UI primitives (Button, Card, Dialog, etc.)
│   │   ├── components/links/   # CreateLinkDialog, QRCodeModal
│   │   ├── components/bio/     # SocialLinkCard
│   │   ├── layout/             # DashboardLayout
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Links, LinkAnalytics, BioStudio, PublicBio
│   │   ├── services/           # Axios API wrappers
│   │   ├── stores/             # Zustand auth store
│   │   └── lib/                # cn() utility
│   └── package.json
├── server/                     # Express + TypeScript backend
│   ├── src/
│   │   ├── config/             # db.ts, env.ts (Zod-validated), cors.ts
│   │   ├── controllers/        # auth, link, analytics, bio controllers
│   │   ├── middleware/          # auth, error, rateLimit, validate
│   │   ├── models/              # User, Link, ClickEvent, BioProfile, SocialLink, RefreshToken, PasswordResetToken
│   │   ├── routes/              # auth, link, analytics, bio, redirect, public
│   │   ├── services/            # auth, link, analytics, bio services
│   │   ├── utils/               # shortCode, ipHash, AppError
│   │   ├── seed/                # seed.ts (demo data)
│   │   ├── app.ts              # Express middleware stack
│   │   └── server.ts           # Entry point
│   ├── tests/
│   │   └── unit/               # shortCode, ipHash, AppError tests
│   └── package.json
├── docs/
│   └── API.md                  # Complete API documentation
├── .env.example                # Environment variable template (no secrets)
├── .gitignore
└── README.md
```

---

## 🚀 Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** ≥ 9

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd Com.bot
```

### 2. Setup environment variables

```bash
cp .env.example server/.env
```

Edit `server/.env` and replace placeholder values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_ACCESS_SECRET` | A random secret for signing access JWTs |
| `JWT_REFRESH_SECRET` | A random secret for signing refresh JWTs |
| `IP_HASH_SECRET` | A random secret for HMAC IP hashing |

### 3. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 4. Seed the database (optional)

```bash
cd server
npm run seed
```

This creates demo users, links with click events, and a bio profile.

**Public tester account:**
- Email: `tester@example.com`
- Password: `123456`

Use the public tester account to sign in and preview the website without creating a personal account.

### 5. Start the development servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

```bash
# Run backend unit tests
cd server && npm test
```

**Test suites:**
- `shortCode.test.ts` — 6-char generation, charset validation, uniqueness, reserved slug checks
- `ipHash.test.ts` — Deterministic hashing, different IPs → different hashes, privacy verification
- `appError.test.ts` — Custom error class properties, inheritance, stack traces

---

## 📖 API Documentation

See [docs/API.md](docs/API.md) for the complete API reference including:
- All endpoints with method, path, and auth requirements
- Request body / query parameter schemas
- Success and error response examples
- Error code reference table
- Rate limit configuration

---

## 🔒 Security

- **No secrets in repo**: `.env` is gitignored. Only `.env.example` with placeholder values is committed.
- **Pair-token JWT**: Short-lived 15m access tokens + 7d refresh tokens in HTTP-only cookies with rotation.
- **IP privacy**: Raw IPs are never stored — only HMAC-SHA256 hashes.
- **Rate limiting**: Configurable limits on link creation (100/15m), redirects (300/1m), and auth (20/15m).
- **Ownership checks**: Every data query is scoped by `userId` to prevent IDOR attacks.

---

## 📋 Assessment Deliverables Checklist

- [x] Pair token JWT auth + route protection
- [x] Indexed slug lookups (`shortCode` unique index)
- [x] Click telemetry schema (timestamp, referrer, device, IP hash)
- [x] Analytics aggregation pipelines (clicks over time, top referrers, device distribution)
- [x] Coss UI components (shadcn-based primitives)
- [x] QR code generator with download
- [x] Theme switcher (3 themes: Minimal Light, Dark Slate, Gradient)
- [x] Mobile-responsive bio page (`/bio/:username`)
- [x] Clean GitHub repo structure
- [x] `.env.example` with no secrets
- [x] API documentation (`docs/API.md`)
- [x] README with setup instructions
- [x] Validation + error handling (Zod + global error middleware)

---

## ⚠️ Assumptions & Limitations

- Email verification is **simulated** (token logged to console, user auto-verified on registration).
- Password reset tokens are logged to the console rather than sent via email.
- The application is designed for local development — production deployment configuration (HTTPS, proper CORS origins, etc.) would require additional setup.
- QR code generation happens client-side using `qrcode.react`.

---

## 📄 License

This project is an assessment submission and is not licensed for commercial use.
