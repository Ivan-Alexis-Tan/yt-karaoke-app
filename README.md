# YT Karaoke App

A web-based karaoke application that lets users search for karaoke
songs, build a playback queue, and sing along to videos hosted on
YouTube. Users can search both the application's local video database
and YouTube directly. The application also includes user accounts and an
administrative moderation workflow for managing videos and channels.

-   **Live application:**
    https://yt-karaoke-app-frontend-nine.vercel.app/
-   **GitHub repository:**
    https://github.com/Ivan-Alexis-Tan/yt-karaoke-app

## Features

### Karaoke playback and search

-   Play karaoke videos using YouTube's embedded player.
-   Search for videos already stored in the application's database.
-   Search YouTube for videos that are not yet available locally.
-   Queue songs for playback.
-   Manage the queue within the current browser/device.
-   Search for songs from the player page without navigating away from
    the playback interface.

### Accounts and access

-   Use the karaoke functionality without signing in.
-   Sign in using Google or GitHub.
-   Access a profile page when signed in.
-   Submit video ban requests as an authenticated user.
-   Separate `user` and `admin` roles.

### Moderation

-   Submit requests to ban videos.
-   Review pending ban requests.
-   Approve or reject requests.
-   Manage banned videos and channels.
-   Filter videos from banned channels, as well as individually banned
    videos.

Ban requests are intended for content that is unsuitable for the
application, such as videos containing inappropriate imagery or content
in languages the application does not accept. A language being
unfamiliar is not, by itself, necessarily a reason for a ban; for
example, Japanese songs are not automatically grounds for removal, while
Spanish-language songs may fall outside the application's current
content rules.

## Technology stack

### Frontend

-   [Next.js](https://nextjs.org/) 16
-   [React](https://react.dev/) 19
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/) 4
-   [Zustand](https://zustand.docs.pmnd.rs/) for client-side state
    management
-   [Auth.js](https://authjs.dev/) for authentication
-   [JOSE](https://github.com/panva/jose) for JWT operations

### Backend

-   [Python](https://www.python.org/) 3.12+
-   [FastAPI](https://fastapi.tiangolo.com/)
-   [SQLAlchemy](https://www.sqlalchemy.org/)
-   [Alembic](https://alembic.sqlalchemy.org/) for database migrations
-   [HTTPX](https://www.python-httpx.org/) for HTTP requests
-   [PyJWT](https://pyjwt.readthedocs.io/) for JWT operations
-   [psycopg2](https://www.psycopg.org/) PostgreSQL driver
-   [uv](https://docs.astral.sh/uv/) for Python project and dependency
    management

### Database and external services

-   [PostgreSQL](https://www.postgresql.org/)
-   [YouTube Data API](https://developers.google.com/youtube/v3)
-   [Vercel](https://vercel.com/) for frontend and backend deployment
-   [Neon](https://neon.tech/) for hosted PostgreSQL

## Architecture

The application is split into a Next.js frontend and a FastAPI backend.
PostgreSQL stores application data, while the YouTube Data API provides
online video search and metadata.

``` mermaid
flowchart TD
    U[User / Browser] --> FE[Next.js Frontend]
    FE -->|Authentication| O[Auth.js: Google / GitHub]
    FE -->|Authenticated API requests| BE[FastAPI Backend]
    BE --> DB[(PostgreSQL)]
    BE -->|Online video search| YT[YouTube Data API]
    BE -->|Embedded playback| YTP[YouTube Player]
```

### Authentication and authorization

Auth.js handles frontend sign-in through Google and GitHub. The frontend
uses JOSE to create a signed JWT for communication with the backend.
FastAPI verifies the token and performs the primary authorization checks
for API access.

The frontend also applies page-level and interface-level access
restrictions. The application supports anonymous visitors, authenticated
users, and administrators.

### Video search and persistence

The application supports two search paths:

-   **Local search:** searches video information already stored in
    PostgreSQL.
-   **Online search:** queries the YouTube Data API for additional
    videos.

For online searches, the backend returns search results without waiting
for database persistence to finish. A background task saves the
retrieved video information so it can be found through local search
later.

Search caching is also used for online search requests. Local search can
reduce repeated YouTube API requests for videos that have already been
saved.

### Playback and queue

Videos are played through YouTube's embedded player. The player and
search interface are available on the same page, allowing users to find
another song without leaving the playback page. The queue is maintained
per browser/device rather than being a globally shared queue.

## Repository structure

The repository contains separate frontend and backend applications. The
following is a high-level overview; it omits individual files and
generated directories.

``` text
yt-karaoke-app/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── cache/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── type/
│   │   └── utils/
│   ├── migrations/
│   ├── pyproject.toml
│   └── uv.lock
│
└── frontend/
    ├── app/
    │   ├── admin/
    │   ├── api/
    │   ├── login/
    │   ├── play/
    │   ├── profile/
    │   └── search/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── core/
    │   ├── svgs/
    │   ├── types/
    │   └── utils/
    ├── auth.ts
    └── package.json
```

## Prerequisites

To run the project locally, prepare:

-   Python 3.12 or later
-   [uv](https://docs.astral.sh/uv/getting-started/installation/)
-   Node.js and npm
-   PostgreSQL
-   A YouTube Data API key
-   Google and/or GitHub OAuth application credentials if you want to
    test sign-in

## Local setup

### 1. Clone the repository

``` bash
git clone https://github.com/Ivan-Alexis-Tan/yt-karaoke-app.git
cd yt-karaoke-app
```

### 2. Create a PostgreSQL database

Start PostgreSQL and create an empty database using pgAdmin or another
PostgreSQL client.

For example, the database can be named `karaoke_db`. The database itself
must exist before applying the Alembic migrations. You do not need to
manually create the application's tables: the migrations handle the
schema.

### 3. Configure the backend

Open the backend directory:

``` bash
cd backend
```

Install the dependencies:

``` bash
uv sync
```

Create a `.env` file in the backend directory and configure the
variables described in [Environment variables](#environment-variables).

Make sure the database connection URL points to the PostgreSQL database
created in the previous step.

### 4. Apply database migrations

From the backend directory, run:

``` bash
uv run alembic upgrade head
```

This applies the available migrations to the configured database.

### 5. Start the backend

From the backend directory:

``` bash
uv run uvicorn app.main:app --reload
```

The backend development server starts with automatic reloading enabled.

### 6. Configure and start the frontend

Open a second terminal and navigate to the frontend directory:

``` bash
cd frontend
```

Install the dependencies:

``` bash
npm install
```

Create a `.env` file in the frontend directory and configure the
variables described in [Environment variables](#environment-variables).

Start the Next.js development server:

``` bash
npm run dev
```

The frontend development server is normally available at:

``` text
http://localhost:3000
```

## Environment variables

Create separate `.env` files in the `frontend/` and `backend/`
directories. Do not commit real credentials or secret values.

### Frontend
  | Variable                          | Description                      |
  |-----------------------------------| -------------------------------- |
  | `APP_ENVIRONMENT`                 | Selects the frontend application environment.|
  | `RECORD_TO_HISTORY`               | Controls the song-history recording setting. |
  | `PRODUCTION_BACKEND_URL`          | URL of the deployed backend. |
  | `LOCAL_BACKEND_URL`               | URL of the local backend. |
  | `AUTH_SECRET`                     | Secret used by Auth.js. |
  | `BACKEND_AUTH_SECRET`             | Shared secret used for frontend/backend JWT signing and verification.|
  | `AUTH_GOOGLE_ID`                  | Google OAuth client ID. | 
  | `AUTH_GOOGLE_SECRET`              | Google OAuth client secret. | 
  | `AUTH_GITHUB_ID`                  | GitHub OAuth client ID. | 
  | `AUTH_GITHUB_SECRET`              | GitHub OAuth client secret. | 

### Backend
  | Variable                          | Description                      |
  |-----------------------------------| -------------------------------- |
  | `APP_ENVIRONMENT`                 | Selects the backend application environment.|
  | `LOCAL_DATABASE_URL`              | Connection URL for the local PostgreSQL database. | 
  | `YOUTUBE_API_KEY`                 | YouTube Data API key. | 
  | `SECRET_KEY`                      | Application secret. | 
  | `DATABASE_URL`                    | PostgreSQL connection URL used by the backend configuration. | 
  | `DATABASE_URL_UNPOOLED`           | Optional direct, non-pooled database connection URL. | 

The backend configuration may also support provider-specific PostgreSQL
connection variables, depending on the deployment environment:

``` dotenv
PGHOST=
PGHOST_UNPOOLED=
PGUSER=
PGDATABASE=
PGPASSWORD=

POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_URL_NO_SSL=
POSTGRES_PRISMA_URL=
```

Only configure the connection variables required by the selected
environment and by the backend configuration. Do not fill in every
alternative connection variable by default.

Example PostgreSQL connection URL:

``` text
postgresql+psycopg2://postgres:your_password@localhost:5432/karaoke_db
```

The variable names above reflect the configuration names supplied for
the project. Check the backend configuration module for the exact
precedence and which variables are required in a particular environment.

## Database migrations

Alembic manages database schema changes. After configuring the database
connection, apply migrations from the backend directory:

``` bash
uv run alembic upgrade head
```

To generate a migration after changing SQLAlchemy models:

``` bash
uv run alembic revision --autogenerate -m "describe the schema change"
```

Review the generated migration before applying it. Autogenerated
migrations should be checked for correctness rather than treated as an
unquestionable representation of the intended schema.

## Running the applications

Run the backend and frontend in separate terminals.

**Backend** (from `backend/`):

``` bash
uv run uvicorn app.main:app --reload
```

**Frontend** (from `frontend/`):

``` bash
npm run dev
```

## Current scope

The application is under active development. Planned features may
include favorites, a history of songs users have sung, and other
user-oriented functionality. These are not presented as currently
available features.

## License

No license has been specified yet.
