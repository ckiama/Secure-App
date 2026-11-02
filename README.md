# Secure App

## Run locally

1. Install frontend dependencies with `npm install --prefix client`.
2. Install backend dependencies with `npm install --prefix server`.
3. Configure `server/.env` with your database, JWT, and Google OAuth credentials:
   - `CLIENT_URL=http://localhost:5173`
   - `GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback`
   - `PORT=4000`
4. Start the API with `npm run dev --prefix server`.
5. In another terminal, start the frontend with `npm run dev --prefix client`.

The frontend automatically detects when running on `localhost` and routes API requests to `http://localhost:4000/api`. In production, it routes requests to `https://secure-app-s3de.vercel.app/api` (or `/api` if deployed together). You can override this anytime by setting `VITE_API_URL`.

## Deploy to Vercel

Ensure the **Root Directory** in your Vercel Project Settings is set to `.` (the repository root). The included `vercel.json` installs dependencies, generates the Prisma client, builds `client` as a static site, and routes `/api/*` requests to the serverless Express function.

Add these environment variables in your Vercel Project Settings:

- `CLIENT_URL`: `https://secure-app-iota.vercel.app` (frontend origin, without trailing slash)
- `SERVER_URL`: `https://secure-app-s3de.vercel.app` (API origin)
- `GOOGLE_CALLBACK_URL`: `https://secure-app-s3de.vercel.app/api/auth/google/callback` (must match Google Cloud Console)
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
- `JWT_SECRET`: Secret key for signing JWTs
- `DIRECT_URL`: Postgres direct connection string (Prisma migrations / session pooler)
- `DATABASE_URL`: Postgres pooler connection string

The Google OAuth client's authorized redirect URI in Google Cloud Console must match `GOOGLE_CALLBACK_URL`. For local development, `server/.env` is used (and is ignored by Git).
