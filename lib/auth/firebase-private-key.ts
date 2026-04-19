import { env } from '@/lib/env';
import { serverRouteFetch } from '@/lib/server/api';

type FirebasePrivateKeyResponse = {
  privateKey: string;
};

const globalForFirebasePrivateKey = globalThis as unknown as {
  firebasePrivateKey?: string;
  firebasePrivateKeyPromise?: Promise<string>;
};

async function loadFirebasePrivateKey() {
  const response = await serverRouteFetch<FirebasePrivateKeyResponse>(
    '/api/auth/firebase/private-key',
    {
      method: 'GET',
      headers: {
        'x-api-key': env.FIREBASE_PRIVATE_KEY_API_KEY_HASH,
      },
    },
  );

  if (!response.ok) {
    throw new Error(response.error);
  }

  if (!response.data.privateKey) {
    throw new Error('Firebase private key response was empty');
  }

  return response.data.privateKey.replace(/\r\n/g, '\n').trim();
}

export async function getFirebasePrivateKey() {
  if (globalForFirebasePrivateKey.firebasePrivateKey) {
    return globalForFirebasePrivateKey.firebasePrivateKey;
  }

  if (!globalForFirebasePrivateKey.firebasePrivateKeyPromise) {
    globalForFirebasePrivateKey.firebasePrivateKeyPromise =
      loadFirebasePrivateKey();
  }

  const privateKey =
    await globalForFirebasePrivateKey.firebasePrivateKeyPromise;
  globalForFirebasePrivateKey.firebasePrivateKey = privateKey;

  return privateKey;
}
