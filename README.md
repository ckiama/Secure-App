# Secure App

## Run locally

1. Install frontend dependencies with `npm ci --prefix client`.
2. Install backend dependencies with `npm ci --prefix server`.
3. Configure `server/.env` with the database, JWT, and Google OAuth credentials.
   Use `http://localhost:5173` for `CLIENT_URL` and
   `http://localhost:4000/api/auth/google/callback` for
   `GOOGLE_CALLBACK_URL`.
4. Start the API with `npm run dev --prefix server`.
5. In another terminal, start the frontend with `npm run dev --prefix client`.

The local frontend uses `http://localhost:4000/api` by default. In production
it uses `https://secure-app-s3de.vercel.app/api` by default. Set
`VITE_API_URL` at build time to override the production API URL.

## Deploy to Vercel

Set the Vercel project root to this repository's root folder. The included
`vercel.json` builds `client` as a static site and routes `/api/*` requests to
the serverless Express function.

Add these environment variables in the Vercel project's settings for each
environment you deploy:

- `CLIENT_URL`: `https://secure-app-iota.vercel.app` (without a trailing slash).
- `GOOGLE_CALLBACK_URL`: `https://secure-app-iota.vercel.app/api/auth/google/callback`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`
- `DIRECT_URL`
- `DATABASE_URL` (if used by your database setup)

The Google OAuth client's authorized redirect URI must exactly match
`GOOGLE_CALLBACK_URL`. Redeploy after changing Vercel environment variables.
For local development, keep local values in `server/.env`; that file is ignored
by Git.
