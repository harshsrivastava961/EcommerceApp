import type { FirebaseOptions } from 'firebase/app';

/**
 * Replace the placeholder values with your Firebase project's configuration.
 * You can find these in the Firebase console under Project Settings > General.
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY ?? 'YOUR_FIREBASE_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ?? 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ??
    'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID ?? 'YOUR_FIREBASE_APP_ID',
};

