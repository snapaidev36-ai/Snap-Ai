# Snap AI

Next.js 16 app with Prisma + MongoDB auth foundation.

## Setup

1. Install dependencies.

   npm install

2. Create your environment file.

   cp .env.example .env

3. Fill in all values in .env.

4. Generate Prisma client.

   npm run prisma:generate

5. Push schema to MongoDB.

   npm run prisma:push

6. Start development server.

   npm run dev

## Environment Variables

The app validates env variables at startup in lib/env.ts.

- DATABASE_URL: MongoDB connection string.
- JWT_ACCESS_SECRET: Secret for access token signing, minimum 32 chars.
- JWT_REFRESH_SECRET: Secret for refresh token signing, minimum 32 chars.
- ACCESS_TOKEN_EXPIRES_IN: Access token lifetime, default 1h.
- REFRESH_TOKEN_EXPIRES_IN: Refresh token lifetime, default 7d.
- BCRYPT_SALT_ROUNDS: Password hash cost, default 12.
- NEXT_PUBLIC_FIREBASE_API_KEY: Firebase web API key.
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: Firebase auth domain.
- NEXT_PUBLIC_FIREBASE_PROJECT_ID: Firebase web project ID.
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Firebase storage bucket.
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: Firebase sender id.
- NEXT_PUBLIC_FIREBASE_APP_ID: Firebase web app id.
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: Firebase analytics measurement id.
- FIREBASE_PROJECT_ID: Firebase Admin project id.
- FIREBASE_CLIENT_EMAIL: Firebase Admin service account client email.
- FIREBASE_PRIVATE_KEY: Firebase Admin service account private key.

## Prisma + MongoDB

- Prisma provider is mongodb in prisma/schema.prisma.
- User model includes:
  - firstName
  - lastName
  - email (unique)
  - password (hashed)
  - credits
- Indexes:
  - unique email index
  - credits index
  - compound lastName + firstName index

## Auth API

### POST /api/auth/register

Body:

{
"firstName": "Jane",
"lastName": "Doe",
"email": "jane@example.com",
"password": "StrongPass123"
}

Behavior:

- Validates and sanitizes body with Zod.
- Creates user with hashed password.
- Returns 201 with safe user payload.
- Does not issue tokens on register.

### POST /api/auth/login

Body:

{
"email": "jane@example.com",
"password": "StrongPass123"
}

Behavior:

- Validates and sanitizes body with Zod.
- Verifies credentials.
- Sets accessToken (1h) as HttpOnly cookie.
- Sets refreshToken (7d) as HttpOnly cookie.

### POST /api/auth/refresh

Behavior:

- Validates refreshToken cookie.
- Issues a fresh accessToken cookie when refreshToken is valid.
- Clears auth cookies and returns 401 if refresh token is invalid or expired.

### POST /api/auth/logout

Behavior:

- Clears accessToken and refreshToken cookies.
- Returns success response.

### POST /api/auth/firebase/google

Body:

{
"idToken": "<firebase-id-token>"
}

Behavior:

- Verifies Firebase ID token with firebase-admin.
- Auto-links with existing user by email if found.
- Creates user if not found.
- Keeps email/password flow active.
- Issues accessToken and refreshToken as HttpOnly cookies.
- Returns redirectTo as /dashboard.

## Middleware Auth Protection

- Protected paths:
  - /dashboard/:path\*
  - /profile/:path\*
  - /gallery/:path\*
- middleware.ts applies route protection.
- Middleware checks accessToken first.
- If accessToken is expired, middleware issues a new accessToken from refreshToken.
- If refreshToken is missing, invalid, or expired, middleware clears auth cookies and redirects to /login.

## Server Actions First

- Server actions are implemented in app/actions/auth.ts.
- Actions call auth route handlers for register, login, refresh, and logout.
- Server components can call route handlers with lib/server/api.ts.
- For client components, use the lightweight fetch wrapper in lib/client/api.ts.
- For Google client auth handoff, use lib/client/firebase.ts helper.

## Firebase And GCP Checklist

- Create Firebase project in Google Cloud.
- Enable Firebase Authentication and turn on Google provider.
- Add localhost and production domains under Firebase authorized domains.
- Configure OAuth consent screen in Google Cloud.
- Create Firebase web app and copy NEXT_PUBLIC Firebase values.
- Generate Firebase Admin service account credentials.
- Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.
- Ensure FIREBASE_PRIVATE_KEY uses escaped newlines when stored in env (\\n).

## Useful Commands

- npm run prisma:validate
- npm run prisma:generate
- npm run prisma:push
- npm run prisma:studio
- npm run lint
- npm run build
