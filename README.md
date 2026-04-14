## 1. Project Title and Description

### Household Finance Hub

Household Finance Hub is a [Next.js](https://nextjs.org/) codebase that runs two modules—**Savings Tracker** and **Kids Account**—under one authenticated application shell. The system uses NextAuth credentials flow for access control, routes requests through protected pages/API handlers, and persists module data in MongoDB using separate Mongoose connections for isolation. It is configured for local development and Vercel deployment through environment variables.

## 2. Features

### Savings Tracker (`/savings`)

| Route | What it does |
| --- | --- |
| **Dashboard** (`/savings`) | Server component connects to the savings DB, runs `computeSummary()`, loads `Settings`, `AccountDistribution`, and `LineOfCredit`, then renders derived metrics/charts (`SummaryCards`, running balance, distribution donut, LOC coverage). |
| **Monthly entries** (`/savings/entries`) | Reads query params (`year`, `view`, `page`), loads rows via `loadYearRows`/`loadAllEntriesPage`, and computes totals with `sumContributionsAndDeductions*` for reporting-ready contribution/deduction/GIC net calculations. |
| **Deductions** (`/savings/deductions`) | Loads all `Deduction` documents, sorts by year/month, computes all-time deduction totals, and mounts the client editor that creates/updates/deletes deduction rows through savings API routes. |
| **Accounts** (`/savings/accounts`) | Loads `AccountDistribution` records and provides inline balance editing through the accounts API; `Bank` is also mutated by entries/deductions save handlers to keep aggregate cash state consistent. |
| **Lines of credit** (`/savings/credit`) | Loads `LineOfCredit` plus account totals, then updates LOC balances through API endpoints while keeping a computed “available funding” view (accounts + LOC). |
| **Settings** (`/savings/settings`) | Reads/creates singleton `Settings` (`startingBalance`, partner labels), persists updates through `/api/savings/settings`, and exposes workbook export from `/api/savings/export`. |
| **Users** (`/savings/users`, admins only) | Gatekept with `getServerSession(authOptions)` + role check (`admin`), then mounts user-management client flows backed by `/api/savings/users` endpoints. |

### Kids Account (`/kids`)

| Route | What it does |
| --- | --- |
| **Dashboard** (`/kids`) | Connects to kids DB, runs `computeKidsSummary()`, and renders computed aggregates: running/monthly series, yearly rollups, category distribution, CCB totals, and carry-forward context. |
| **Transactions** (`/kids/transactions`) | Loads and normalizes `Transaction` docs (date/type/tags/carry-forward), derives available years, and delegates filtering/edit/delete interactions to `KidsTransactionsClient` via kids transaction APIs. |
| **Income** (`/kids/income`) | Uses summary output to isolate positive category totals and CCB-by-year aggregates, then renders tabular yearly CCB stats plus category-source charting. |
| **Expenses** (`/kids/expenses`) | Combines summary-level category totals with direct `Transaction` scans to compute RESP/YMCA annual totals and render expense concentration views by category and year. |
| **Monthly summary** (`/kids/summary`) | Builds monthly income/expense/net/running snapshots from summary data and derives surplus-vs-deficit counts for month-level behavior tracking. |
| **Settings** (`/kids/settings`) | Reads/creates singleton `KidsSettings` and persists account labels/currency used across kids forms, dashboards, and table formatting. |

### Cross-cutting

- **Authentication pipeline**: NextAuth credentials provider validates `User.passwordHash` with bcrypt, then middleware validates JWT on every matched request (see [Authentication](#11-authentication)).
- **Dual-database architecture**: Savings models bind to `db-savings`, kids models bind to `db-kids`, each with its own URI and singleton connection lifecycle (see [Database Architecture](#10-database-architecture)).
- **Module switching**: Root route (`/`) is an authenticated selector that loads savings and kids headline stats, while each sidebar can route back to the selector without signing out.
- **Export path**: `/api/savings/export` reads savings collections and serializes a multi-sheet workbook using `exceljs`; Settings page simply triggers that endpoint download.

## 3. Tech Stack

| Layer | Choice |
| --- | --- |
| **Framework** | Next.js `14.2.35` (App Router) |
| **Language** | TypeScript `5.9.3` (lockfile); React `18.3.1` (lockfile) |
| **Styling** | Tailwind CSS `3.4.19` (lockfile), `tailwindcss-animate`, `tw-animate-css`, `tailwind-merge`, `class-variance-authority` |
| **Database** | MongoDB (connection URIs in env; logical DB names e.g. `savings-tracker`, `kids-account` in seed defaults) |
| **ORM / ODM** | Mongoose `^9.4.1` |
| **Auth** | NextAuth.js `^4.24.13` (credentials provider), `bcryptjs` `^3.0.3` |
| **Charts** | Recharts `^3.8.1` |
| **Forms / validation** | `react-hook-form` `^7.72.1`, `@hookform/resolvers` `^5.2.2`, Zod `^4.3.6` |
| **Icons** | `lucide-react` `1.8.0` (resolved in lockfile) |
| **Excel export** | `exceljs` `^4.4.0` |
| **Deployment** | Vercel (typical; see [Deployment](#12-deployment-vercel)) |

## 4. Project Structure

Top levels (excluding `.git`, `node_modules`, and build output such as `.next`):

```text
.
├── app/                    # Next.js App Router: pages, layouts, global styles, fonts
├── components/             # React UI: layouts, feature clients, auth, shadcn-style ui/
├── lib/                    # DB connections, Mongoose models, auth, summaries, schemas, utils
├── scripts/                # CLI: seed, create-user, hash-password (tsx)
├── types/                  # TypeScript augmentations (e.g. next-auth)
├── middleware.ts           # JWT gate and public route exceptions
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

- **`app/`** — Routes: `/` hub, `/login`, `/auth/setup`, `savings/*`, `kids/*`, and `api/*` (NextAuth, savings, kids).
- **`components/`** — Reusable UI and client components per feature (dashboard, entries, kids, layout shells, etc.).
- **`lib/`** — `db-savings` / `db-kids` connections, `models/savings` and `models/kids`, auth config, business logic.
- **`scripts/`** — Database seeding and user utilities run via `npm`/`tsx`.
- **`types/`** — Shared type extensions for the compiler.

## 5. Prerequisites

- **Node.js**: No `engines` field or `.nvmrc` is present in this repo; use **Node.js 18 or newer** (Next.js 14 is compatible with modern LTS releases).
- **MongoDB**: Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (or any reachable MongoDB deployment).
- **Package manager**: **npm** (lockfile: `package-lock.json`). Other package managers can be used if you prefer.

## 6. Environment Variables

Runtime configuration is entirely environment-driven. Local development reads `.env.local`; deployment reads the same keys from Vercel project settings.

Generate a signing secret once (reuse the same value for all app instances in a given environment):

```bash
openssl rand -base64 32
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXTAUTH_SECRET` | **Yes** | Shared JWT signing/verification secret. Read by NextAuth and middleware token checks; mismatch causes login loops or invalid tokens. Generate with `openssl rand -base64 32`. |
| `AUTH_SECRET` | No | Backward-compatible alias consumed by `getAuthSecret()`. If set, keep it identical to `NEXTAUTH_SECRET`. |
| `NEXTAUTH_URL` | **Yes** | Base URL used by NextAuth callback/session URL generation. Use `http://localhost:3000` in local and your public Vercel URL in production. |
| `MONGODB_SAVINGS_URI` | **Yes** (or `MONGODB_URI`) | Savings connection string used by `lib/db-savings.ts` (users + savings module collections). |
| `MONGODB_URI` | Conditional fallback | Used only when `MONGODB_SAVINGS_URI` is unset. Keep this pointed at the savings database if you rely on fallback behavior. |
| `MONGODB_KIDS_URI` | **Yes** for kids module | Kids connection string used by `lib/db-kids.ts`. Required for `/kids` pages and kids API routes. |

## 7. Local Setup

Use this order so auth/database dependencies are ready before the app starts.

1. **Clone and enter the repository**

   ```bash
   git clone https://github.com/kere-sifon/Savings-Tracker.git
   cd Savings-Tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create local environment file**

   ```bash
   cp .env.example .env.local
   ```

   Fill every variable from [Environment Variables](#6-environment-variables) before continuing.

4. **Start MongoDB** (skip if using Atlas)

   ```bash
   mongod --dbpath /path/to/data
   ```

   Ensure URIs in `.env.local` point to reachable databases.

5. **Seed module data**

   ```bash
   npm run seed:savings
   npm run seed:kids
   ```

   - `seed:savings` clears and repopulates savings collections: monthly entries, deductions, account distributions, lines of credit, and settings.
   - `seed:kids` clears and repopulates kids collections: transactions and kids settings.

6. **Run development server**

   ```bash
   npm run dev
   ```

7. **Open the app**

   - [http://localhost:3000](http://localhost:3000)

## 8. First-Time Login / Bootstrap

Bootstrap is mandatory. Until one `User` document exists, you cannot establish a valid session for protected routes.

- **Observed behavior before bootstrap**
  - Page routes matched by middleware redirect to `/login`.
  - Protected API routes return `401`.
  - This repeats indefinitely until a user is created.

- **Path A: Setup page (`/auth/setup`)**
  - `app/auth/setup/page.tsx` first checks that no session exists.
  - It then checks `User.countDocuments()`.
  - If count is `0`, it renders `SetupForm`; if count is `>0`, it blocks setup and points to `/login`.
  - Form submit calls `POST /api/savings/auth/bootstrap`; route creates first user with role `admin` only when user count is still `0`.

- **Path B: CLI script**
  - Command:
    ```bash
    npm run create-user -- <email> <password> [admin|user]
    ```
  - Script: `scripts/create-user.ts`
  - Behavior: connects to savings DB, hashes password with bcrypt cost `12`, inserts user, exits.

## 9. Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Starts Next.js in development mode with hot reload. |
| `build` | `npm run build` | Compiles production assets/server bundles. |
| `start` | `npm run start` | Runs the compiled production build. |
| `lint` | `npm run lint` | Executes Next.js ESLint checks. |
| `seed` | `npm run seed` | Convenience alias for `seed:savings`. |
| `seed:savings` | `npm run seed:savings` | Recreates savings seed state in the savings DB (`scripts/seed-savings.ts`). |
| `seed:kids` | `npm run seed:kids` | Recreates kids seed state in the kids DB (`scripts/seed-kids.ts`). |
| `hash-password` | `npm run hash-password -- <password>` | One-off bcrypt hash generation (cost factor 12). |
| `create-user` | `npm run create-user -- <email> <password> [admin\|user]` | Inserts a user in savings DB for sign-in bootstrap/testing. |

## 10. Database Architecture

### `savings-tracker` (savings connection)

Savings models are declared in `lib/models/savings/` and bound to `getSavingsConnection()`.

- **`users`** — `User` (authentication: email, `passwordHash`, `role`, etc.)
- **`monthlyentries`** — `MonthlyEntry` (monthly partner contributions)
- **`deductions`** — `Deduction`
- **`accountdistributions`** — `AccountDistribution`
- **`lineofcredits`** — `LineOfCredit`
- **`settings`** — `Settings` (starting balance, partner names)

Default local seed target is `mongodb://localhost:27017/savings-tracker` when no env URI is provided.

### `kids-account` (kids connection)

Kids models are declared in `lib/models/kids/` and bound to `getKidsConnection()`.

- **`transactions`** — `Transaction` (income/expense ledger, categories, tags, carry-forward flag)
- **`kidssettings`** — `KidsSettings` (account name, owner/partner, currency)

Default local seed target is `mongodb://localhost:27017/kids-account` when no env URI is provided.

### Why two databases?

Data is split by domain and connection URI so module operations do not share collections by accident. This keeps migrations, backups, and access control boundaries explicit (`MONGODB_SAVINGS_URI` / `MONGODB_URI` vs `MONGODB_KIDS_URI`).

### Connections (`lib/db-savings.ts`, `lib/db-kids.ts`)

Connection flow in both files:

1. Resolve URI from env.
2. Create module-specific `mongoose.createConnection(uri)` once.
3. Cache connection on `globalThis` (`savingsMongooseConn` / `kidsMongooseConn`).
4. Reuse cached connection across route/page execution (including hot reload in dev).
5. `connect*DB()` awaits `.asPromise()` only when `readyState !== 1`.

`lib/db.ts` re-exports `connectSavingsDB` as `connectDB` for legacy imports.

## 11. Authentication

Request/auth lifecycle:

1. **Sign-in submit (`/login`)**
   - NextAuth Credentials provider receives `email` + `password`.
   - `authorize()` normalizes credentials, connects to savings DB, loads `User` with `passwordHash`, and compares via bcrypt.
2. **Session issue**
   - Session strategy is `jwt` (`maxAge` 30 days).
   - JWT callback stores `id`, `email`, `name`, `role`.
   - Session callback exposes those fields to `session.user`.
3. **Per-request guard (`middleware.ts`)**
   - `getToken()` verifies JWT with the same secret resolver (`getAuthSecret()`).
   - Missing token: API requests return `401`; page requests redirect to `/login?callbackUrl=...`.
4. **Public matcher exceptions**
   - Unprotected paths: `login`, `auth/setup`, `api/auth/*`, `api/savings/auth/bootstrap`, Next static/image assets, favicon, and common image extensions.
5. **Password hashing locations**
   - `app/api/savings/auth/bootstrap/route.ts` and `scripts/create-user.ts` hash with bcrypt cost `12`.
   - `scripts/hash-password.ts` is a standalone helper for generating compatible hashes.

## 12. Deployment (Vercel)

Use this deployment sequence:

1. Push branch to GitHub (`kere-sifon/Savings-Tracker` remote).
2. Import repo in [Vercel](https://vercel.com/) and create the project.
3. Add all keys from [Environment Variables](#6-environment-variables) in Vercel project settings.
4. Set `NEXTAUTH_URL` to the production domain for that Vercel environment.
5. Ensure MongoDB URI targets are internet-reachable from Vercel (typically Atlas; local-only URIs fail).
6. Trigger deployment.

Post-deploy verification:

- Confirm `/login` loads.
- Complete bootstrap user creation if production DB is empty.
- Confirm both `/savings` and `/kids` load authenticated data.

