import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration read from Expo Public Environment Variables or defaults
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.apiKey.includes('YourApiKeyHere') &&
    !firebaseConfig.projectId.includes('your-project-id')
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log('[Firebase] Connected to Cloud Firestore successfully.');
  } else {
    console.info(
      '[Firebase] No active Firebase credentials found in environment. Using demo in-memory storage mode.'
    );
  }
} catch (error) {
  console.warn('[Firebase] Initialization warning:', error);
}

export { app, db, firebaseConfig };
