import 'server-only';

import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';

import { env } from '@/lib/env';

const globalForFirebaseAdmin = globalThis as unknown as {
  firebaseAdminApp?: App;
};

function getFirebasePrivateKey() {
  return env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
}

function getFirebaseAdminApp() {
  if (globalForFirebaseAdmin.firebaseAdminApp) {
    return globalForFirebaseAdmin.firebaseAdminApp;
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    globalForFirebaseAdmin.firebaseAdminApp = existingApp;
    return existingApp;
  }

  const app = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: getFirebasePrivateKey(),
    }),
  });

  globalForFirebaseAdmin.firebaseAdminApp = app;
  return app;
}

export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<DecodedIdToken> {
  const auth = getAuth(getFirebaseAdminApp());
  return auth.verifyIdToken(idToken);
}
