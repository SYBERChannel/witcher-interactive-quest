Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## AI Development Rules for "Witcher: Path of Geralt"

This document defines the rules, constraints, and generation order for the AI model.

The model must strictly follow the architecture defined in architecture.md.

---

# 1. General Principles

1. Do not modify the architecture unless explicitly instructed.
2. Do not introduce new technologies outside the approved stack.
3. Do not generate narrative or artistic filler text.
4. Do not write comments inside the code.
5. Do not weaken security practices.
6. Do not treat the frontend as the source of truth for game state.
7. The backend is the single source of truth.

---

# 2. Technology Stack

Frontend:
- React (Vite)
- React Router
- Zustand
- Axios
- Framer Motion (for animations)
- CSS Modules or plain CSS

Backend:
- Node.js
- Express
- PostgreSQL
- JWT (access + refresh tokens)
- bcrypt
- dotenv

Infrastructure:
- Docker
- docker-compose
- .env configuration

---

# 3. Generation Rules

## 3.1 Step-by-Step Generation

The model must generate the project in stages:

1. Architecture (no code)
2. Project structure
3. SQL schema
4. Backend
5. Frontend

Everything must not be generated in a single response.

---

## 3.2 Constraints

- Do not shorten files.
- Do not use pseudocode.
- Do not write "...and so on".
- Output every file completely.
- Do not write comments inside code.
- Do not add unnecessary dependencies.

---

# 4. Backend Rules

1. Use an MVC-like structure.
2. Game logic must be inside services:
   - SceneEngine
   - BattleEngine
   - RandomEventEngine
   - InventoryService
3. Controllers must remain thin.
4. Required middleware:
   - authGuard
   - errorHandler
   - rateLimiter
5. JWT configuration:
   - access token: 15 minutes
   - refresh token: 7 days
   - refresh tokens must be stored hashed in the database

---

# 5. Frontend Rules

1. SPA only (no SSR).
2. Zustand is the client-side state manager.
3. The client must not modify hp, xp, or inventory directly.
4. All changes must go through the API.
5. Music must be handled through a singleton AudioManager.
6. Battle animations must use Framer Motion.
7. Access token stored in memory; refresh token via httpOnly cookie.

---

# 6. Game Logic Rules

1. Scene transitions are controlled by the Scene Engine.
2. All scenes must come from the server.
3. Story branches:
   - good
   - bad
   - neutral
4. Random events:
   - 20–30% probability
   - must prevent repetition
5. Battle system must be server-side.
6. Inventory must be stored in the inventories table.

---

# 7. Leaderboard Rules

1. Public GET endpoint.
2. Sorted by xp.
3. Automatically written when the game is completed.
4. Must not be stored or calculated on the client.

---

# 8. Security Rules

1. All `/api/game` and `/api/battle` routes must be protected by authGuard.
2. Always validate ownership of game_save.
3. Validate all incoming data.
4. Never trust client-side input.

---

# 9. Performance Rules

1. Use PostgreSQL indexes where appropriate.
2. Minimize unnecessary queries.
3. Do not perform heavy calculations on the client.
4. Avoid redundant data duplication.

---

# 10. Forbidden Practices

- Storing hp in localStorage as the source of truth.
- Calculating battle damage on the client.
- Generating excessive narrative text for scenes.
- Using unstable or unapproved libraries.
- Ignoring architecture.md.

---

# 11. Model Output Format

When generating code, the model must:

1. Output project structure first.
2. Then output files one by one.
3. Never combine backend and frontend in a single block.
4. Avoid unnecessary explanations.
5. Output only code and minimal file headers.

---

This file is mandatory for all future project generation.
