import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase project configuration.
 * Get these values from Firebase Console > Project Settings > General.
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY ?? 'AIzaSyBp6RK0wk-viOtIPhm3_W3aTqUNEJ213Qg',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'e-commerce-mobile-app-6cc72.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'e-commerce-mobile-app-6cc72',
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ?? 'e-commerce-mobile-app-6cc72.firebasestorage.app',
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ?? '665506306548',
  appId: process.env.FIREBASE_APP_ID ?? '1:665506306548:web:c9a1cba96d685a083701a1',
};

