'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { apiClient } from '@/lib/client/api';
import type { AuthUser } from '@/lib/types/auth-user';

type FirebaseGoogleLoginResponse = {
  message: string;
  redirectTo: string;
  user: AuthUser;
};

function getClientFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const requiredKeys: Array<keyof typeof config> = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missing = requiredKeys.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase client config values: ${missing.join(', ')}`,
    );
  }

  return config;
}

function getFirebaseClientApp() {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  return initializeApp(getClientFirebaseConfig());
}

export async function signInWithGoogleUsingFirebase() {
  const auth = getAuth(getFirebaseClientApp());
  const provider = new GoogleAuthProvider();

  const credential = await signInWithPopup(auth, provider);
  const idToken = await credential.user.getIdToken();

  return apiClient<FirebaseGoogleLoginResponse>('/api/auth/firebase/google', {
    method: 'POST',
    body: { idToken },
    skipAuthRefresh: true,
  });
}
