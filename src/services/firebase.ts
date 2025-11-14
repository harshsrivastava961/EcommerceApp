import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from '../config/firebaseConfig';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// getAuth automatically handles React Native persistence with AsyncStorage
export const auth = getAuth(app);
export const firestore = getFirestore(app);

