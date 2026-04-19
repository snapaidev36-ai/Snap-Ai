import 'server-only';

import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';

import { env } from '@/lib/env';
import { getFirebasePrivateKey } from './firebase-private-key';

const globalForFirebaseAdmin = globalThis as unknown as {
  firebaseAdminApp?: App;
  firebaseAdminAppPromise?: Promise<App>;
};

async function getFirebaseAdminApp() {
  if (globalForFirebaseAdmin.firebaseAdminApp) {
    return globalForFirebaseAdmin.firebaseAdminApp;
  }

  if (globalForFirebaseAdmin.firebaseAdminAppPromise) {
    return globalForFirebaseAdmin.firebaseAdminAppPromise;
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    globalForFirebaseAdmin.firebaseAdminApp = existingApp;
    return existingApp;
  }

  globalForFirebaseAdmin.firebaseAdminAppPromise = (async () => {
    const privateKey = await getFirebasePrivateKey();

    const app = initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

    globalForFirebaseAdmin.firebaseAdminApp = app;
    return app;
  })();

  return globalForFirebaseAdmin.firebaseAdminAppPromise;
}

export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<DecodedIdToken> {
  const auth = getAuth(await getFirebaseAdminApp());
  return auth.verifyIdToken(idToken);
}
