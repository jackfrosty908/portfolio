# portfolio

This is a repo where I can try out new technologies, and eventually write blog posts.

---

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

---

## Supabase Setup (first‑time run)

> **Skip VS Code dev‑containers?** No problem—these steps spin up Supabase locally with nothing more than Docker and the Supabase CLI.

### 1 · Prerequisites

| Requirement                               | Why                                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Docker Desktop (‑‑ or any Docker runtime) | Supabase uses a small Docker compose stack                                                                |
| Supabase CLI ≥ 1.179                      | Local development & toolbelt [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli) |

Install the CLI with Homebrew:

```bash
brew install supabase/tap/supabase
```

### 2 · Initialise and start the stack

```bash
# from apps/server/supabase
supabase start  # ‑w to follow logs
```

The CLI spins up:

| Service        | Port      | Notes                                            |
| -------------- | --------- | ------------------------------------------------ |
| Postgres       | **54322** | direct DB connection                             |
| REST / GraphQL | **54321** | PostgREST endpoint, GoTrue Auth & GraphQL        |
| Studio (UI)    | **54323** | [http://localhost:54323](http://localhost:54323) |

The terminal output also prints **anon** and **service‑role** keys for this local project.

### 3 · Environment variables

Create or update these files so both backend and frontend know how to reach Supabase:

| Path                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `apps/server/.env.local`| Used by server-side code and migrations (Hono)  |
| `apps/web/.env.local`   | Exposed to the Next.js browser bundle (Next.js) |

<details>
<summary>apps/server/.env.local</summary>

```dotenv
DATABASE_URL=postgres://postgres:postgres@localhost:54322/postgres
DIRECT_URL=postgres://postgres:postgres@localhost:54322/postgres
# Allow browser origin for Supabase REST and your API server
CORS_ORIGIN=http://localhost:3001
```

</details>

<details>
<summary>apps/web/.env.local (frontend)</summary>

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# paste the ANON_KEY shown by `supabase status -o env`
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
SENTRY_ENV=local
```

</details>

> **Where to find the keys?** Run `supabase status -o env` and copy the values for `API_URL` and `ANON_KEY`.
> If you change `supabase/config.toml` (e.g. Auth `site_url` / `additional_redirect_urls`), run `supabase stop && supabase start` to apply.

### 4 · Create database schema

```bash
pnpm db:push   # runs Drizzle migrations against the local Supabase DB
```

*(Need the visual UI? `pnpm db:studio` opens Supabase Studio on [http://localhost:54323](http://localhost:54323).)*

### 5 · Tear down

```bash
supabase stop   # shut down Docker containers
```

You now have Supabase + Postgres running locally and seeded with the project schema—time to boot the apps.

---

## Running the apps

```bash
pnpm dev   # runs web @ :3001 and API @ :3000 concurrently
```

* Web: [http://localhost:3001](http://localhost:3001)
* API: [http://localhost:3000](http://localhost:3000)

---

## Database Setup (alt. remote Postgres)

If you prefer a standalone Postgres instance instead of Supabase, follow these steps instead:

1. Provision a PostgreSQL database.
2. Update `apps/server/.env` with the connection string.
3. Run `pnpm db:push`.

## Payload CMS migrations (web)

### Prerequisites
Create `apps/web/.env.local`:
```dotenv
PAYLOAD_SECRET=secret
POSTGRES_DATABASE_URI=postgres://postgres:postgres@localhost:54322/postgres
```

### Common commands (run from `apps/web`)
- Create a migration
  ```bash
  pnpm payload migrate:create your-migration-name 
  ```
- Create a new empty migration
  ```bash
  pnpm payload migrate:create your-migration-name --skip-empty --force-accept-warning
  ```
- See pending/applied migrations
  ```bash
  pnpm payload migrate:status
  ```
- Apply all pending migrations (runs seed migrations too)
  ```bash
  pnpm payload migrate
  ```
- Re-run from scratch
  ```bash
  pnpm payload migrate:fresh
  # or:
  pnpm payload migrate:reset && pnpm payload migrate
  ```

### New environment tasks

Enable the hook in Supabase
 - Cloud: Authentication → Hooks → Custom access token → set to `pg-functions://postgres/public/custom_access_token_hook`
 - Local: `supabase/config.toml` (already enabled)


### Monorepo usage (run from repo root)
- Create
  ```bash
  pnpm --filter web payload migrate:create your-migration-name --skip-empty --force-accept-warning
  ```
- Status
  ```bash
  pnpm --filter web payload migrate:status
  ```
- Migrate
  ```bash
  pnpm --filter web payload migrate
  ```

### Notes
- Stop any running dev server before migrating.
- Don’t mix “push mode” and migrations at the same time.

---

## Project Structure

```text
portfolio/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Hono, TRPC)
└── supabase/        # Supabase config & migrations (generated by CLI)
```

---

## Available Scripts

| Script             | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `pnpm dev`         | Start all applications (web + server) in dev mode  |
| `pnpm build`       | Build all applications                             |
| `pnpm dev:web`     | Start only the web application                     |
| `pnpm dev:server`  | Start only the server                              |
| `pnpm check-types` | Type‑check across all apps                         |
| `pnpm db:push`     | Push Drizzle migrations to the configured database |
| `pnpm db:studio`   | Open Supabase Studio UI                            |
| `pnpm check`       | Run Biome formatting & linting                     |

---

Happy hacking! 🚀
