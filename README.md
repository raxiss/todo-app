# Todo App - React + TS + Node + Express + Drizzle

Structure:
- `client/` - React + TypeScript + Vite
- `server/` - Node + Express + TypeScript + Drizzle (Neon Postgres)

Setup:
```
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Drizzle:
```
npm run db:generate --workspace=server
npm run db:push --workspace=server
```
