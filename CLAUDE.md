# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
bun run dev          # Start both server and client concurrently (from root)
bun run format       # Run Prettier across all files
```

### Server (packages/server)
```bash
bun run dev          # Start server with file watching on port 3000
bun run start        # Start server without watching
```

### Client (packages/client)
```bash
bun run dev          # Vite dev server (proxies /api/* to localhost:3000)
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint
```

### Database (run from packages/server)
```bash
bunx prisma migrate dev     # Run pending migrations
bunx prisma generate        # Regenerate Prisma client after schema changes
bunx prisma studio          # Open Prisma Studio GUI
```

No test framework is configured in this project.

## Architecture

This is a Bun monorepo (`packages/*`) containing two services deployed as separate Docker containers on Render.com.

### Server (`packages/server`) — Express 5 API on port 3000

Request flow:
```
routes.ts → chat.controller.ts → chat.service.ts → OpenAI API
```

- **Chat service** reads system prompt from `prompts/chatbot.txt` and product context from `prompts/Filmhub.md`, then calls OpenAI `gpt-4o-mini` via the responses API (`client.responses.create`).
- **Conversation continuity** is maintained in memory via `repositories/conversation.repository.ts`, which maps a UUID `conversationId` to the last OpenAI `response_id`. This allows multi-turn conversations using OpenAI's `previous_response_id`.
- **Prisma** (`generated/prisma/` output) manages a MySQL schema with `Product`, `Review`, and `Summary` models. The schema exists but the chat flow does not currently read from the database.
- `DATABASE_URL` and `OPENAI_API_KEY` must be set in `packages/server/.env`.

### Client (`packages/client`) — React 19 SPA via Vite 8

- Single feature: `src/components/chat/ChatBot.tsx` orchestrates conversation state, generates a UUID `conversationId` on mount, and posts to `/api/chat` via axios.
- Vite proxies `/api/*` to `http://localhost:3000` in dev. In production, Nginx proxies to the deployed API URL.
- UI built with Shadcn (radix-nova style) on top of Radix UI + Tailwind CSS 4.
- Path alias `@` → `./src`.

### Deployment

- `Dockerfile` — builds and runs the server with `oven/bun:1.3.11`
- `Dockerfile.client` — builds the SPA and serves via Nginx; the Nginx config proxies `/api/*` to `https://filmhub-help-chatbot-api.onrender.com`
- `render.yaml` — defines both services; server requires `OPENAI_API_KEY` and `PORT=10000`

## Code Style

Prettier config (`.prettierrc`): single quotes, semicolons, trailing commas (ES5), 80-char print width, 3-space tab width. Husky + lint-staged run Prettier on staged files before every commit.
