# Character Bot for Telegram

Character Bot is a platform for creating AI-powered Telegram character experiences. A user registers from a web interface, describes the character they want, and the system generates a concise presentation and an extended behavioral description. The Telegram bot then lets the user select their saved character and chat with it in character.

## What it does

- Registers and identifies users by name and phone number.
- Lets each user create one or more character profiles.
- Uses AI to refine each profile into:
  - a short presentation (up to 100 characters) for the Telegram selection list;
  - a detailed role-playing description (up to 700 characters).
- Provides the configured Telegram bot URL after a character is saved.
- Lists the characters associated with the phone number entered in Telegram.
- Keeps the conversation in the selected character's voice.
- Uses a local model as a fallback when Gemini is unavailable.

## Architecture

```text
React web app
    | POST /api/login, /api/registrer, /api/characters
    v
FastAPI configuration service ----> PostgreSQL
    |                                  |
    | generates profile text            | stores users and characters
    v                                  v
Gemini 2.5 Flash <---- fallback ---- Ollama (Gemma)

Telegram user <---- polling ---- Python Telegram bot ----> PostgreSQL
                                      |
                                      v
                            Gemini 2.5 Flash / Ollama fallback
```

The repository has three applications:

| Component | Folder | Responsibility |
| --- | --- | --- |
| Web UI | `character_bot_personalization_web/character_bot_web` | Sign-in/registration and character creation interface. |
| API | `character_bot_personalization_web/character_bot_bk` | FastAPI API, profile generation, and PostgreSQL writes. |
| Telegram runtime | `telegram_bot_configuration` | Telegram polling, character selection, and AI responses. |

## Technologies

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Oxlint.
- **API:** Python 3.12, FastAPI, Uvicorn, Pydantic, SQLModel and SQLAlchemy.
- **Telegram bot:** Python, `python-telegram-bot`, long polling, Peewee.
- **Database:** PostgreSQL; the application uses the `telegram_bot_characters` schema.
- **AI:** Google Gemini (`gemini-2.5-flash`) as the primary provider; Ollama running `gemma4:e4b` as the local fallback.
- **Deployment:** Docker and Docker Compose.
- **Development assistance:** OpenAI Codex and Cursor were used to support programming and development tasks.

## AI flow

When a character is created, the API sends its name and initial description to the AI layer. It produces a brief presentation and a role-playing prompt that tells the chat model to stay in character. The API first uses Gemini for the long description; if that request fails, it generates both text fields with Ollama.

For chat messages, the Telegram service first calls Gemini. If it raises an error, it calls the local Ollama endpoint at `http://host.docker.internal:11434/api/generate`. Ollama must therefore be running and have the `gemma4:e4b` model available.

## Data model

PostgreSQL contains these main tables in the `telegram_bot_characters` schema:

| Table | Important fields | Purpose |
| --- | --- | --- |
| `phoneusers` | `id`, `name`, `phone` | Stores the person who owns characters. The Telegram data-access model enforces a unique phone number. |
| `characters` | `id`, `character`, `presentation`, `description`, `user_id` | Stores the generated character profile and its owner. |

The configuration service creates its SQLModel tables at startup. The database, schema, and credentials themselves must already be available.

## API

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/registrer` | Creates a user. (`registrer` is the route name used by the current application.) |
| `POST` | `/api/login` | Finds a user by name and phone number. |
| `POST` | `/api/characters` | Generates profile text, saves a character, and returns its bot URL. |

The frontend proxies `/api` requests to `http://localhost:8000` during development.

## Prerequisites

- Python 3.12+
- Node.js 20+ and npm or pnpm
- PostgreSQL
- A Telegram bot token from BotFather
- A Google Gemini API key (recommended)
- Ollama, including the `gemma4:e4b` model, if you want local fallback
- Docker and Docker Compose (optional, for containerized backend and bot)

## Environment variables

Create a `.env` file in both Python service folders, with the variables each service needs. Never commit these secrets.

```env
# Shared PostgreSQL connection values
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Used by the FastAPI service (SQLModel connection string)
URL_CONNECTION=postgresql+psycopg2://postgres:change-me@localhost:5432/postgres

# Used by both AI integrations
GEMINI_TOKEN=your_gemini_api_key

# Used by the Telegram runtime
TELEGRAM_TOKEN=your_telegram_bot_token

# URL returned to the web UI after character creation
TELEGRAM_BOT=https://t.me/your_bot_username
```

The frontend was deployed through ngrok, while the backend services run in Docker. Therefore, the containers reach Ollama on the host machine through `host.docker.internal:11434`, as used in the source code. If you run the backend without Docker, replace `host.docker.internal` with `localhost` in the Ollama endpoint URLs.

## Run locally

### 1. Prepare PostgreSQL

Create the `telegram_bot_characters` schema in the target database. Configure the connection variables above. The FastAPI service will create its tables when it starts.

### 2. Start the API

```powershell
cd character_bot_personalization_web/character_bot_bk
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 3. Start the web app

In a separate terminal:

```powershell
cd character_bot_personalization_web/character_bot_web
npm install
npm run dev
```

Open the local Vite address (normally `http://localhost:5173`).

### 4. Start the Telegram bot

In another terminal:

```powershell
cd telegram_bot_configuration
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python telegram_bot.py
```

In Telegram, send `/start`, choose the phone-number button, send `phone:<number>`, select one of the displayed characters, and begin chatting.

## Docker

The root Compose file builds and starts the FastAPI configuration service on port `8000` and the Telegram polling service:

```powershell
docker compose up --build
```

PostgreSQL and Ollama are external dependencies in the current Compose configuration; start and configure them separately. The Dockerfiles copy a local `.env` file into each image, so keep `.env` private and prefer a secrets mechanism for production deployments.

## Build and checks

Build the frontend production bundle:

```powershell
cd character_bot_personalization_web/character_bot_web
npm run build
```

Run its linter:

```powershell
npm run lint
```

The API and Telegram components are Python applications and do not have a separate compilation step; dependency installation plus process startup is their build/run path. Docker images use `python:3.12-slim` and install their respective `requirements.txt` files.

## Performance and reliability

No benchmark suite or recorded latency measurements is included, so this project does not make numerical performance claims. Its observed performance profile is:

- The web app is a static Vite bundle; its interactive speed mainly depends on browser/device performance and API latency.
- Character creation performs two sequential AI-generation calls in the current implementation, which makes that endpoint AI-latency-bound.
- Every Telegram message waits for an AI response. Gemini is the primary path; local Ollama preserves availability if Gemini fails, but can be slower depending on the host hardware and model load.
- Telegram polling is configured with a 1-second poll interval, a 180-second polling timeout, 60-second read timeout, and 30-second connection timeout.
- PostgreSQL queries retrieve characters by the user's phone number. Index the phone field (and enforce the same uniqueness in the schema) for predictable lookups at scale.

For production, add structured error handling, request validation feedback, retries with backoff, connection pooling, health checks that verify dependencies, metrics, and load tests before selecting capacity targets.

## Current limitations and security notes

- The service has no authentication tokens or session protection; user data is stored in browser `localStorage`.
- Phone numbers are personally identifiable information. Use HTTPS, restrict database access, and add a privacy/retention policy before production use.
- The current CORS configuration permits all origins. Restrict it to trusted frontend domains in production.
- The Telegram bot holds conversation state in module-level variables. That state is shared across users and resets on restart; use per-user/per-chat persistent state before serving concurrent users.
- There is no database service in `docker-compose.yaml`; it must be provisioned externally.
- Character creation returns the configured `TELEGRAM_BOT` URL; it does not create a separate Telegram bot through the Telegram Bot API.

## Suggested project structure

```text
telegram_bot/
├── docker-compose.yaml
├── telegram_bot_configuration/              # Telegram polling service
└── character_bot_personalization_web/
    ├── character_bot_bk/                    # FastAPI service
    └── character_bot_web/                   # React/Vite interface
```
