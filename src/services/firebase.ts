import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration read from Expo Public Environment Variables or defaults
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCcAvBbzM7acMETRErP37ss8sf0F187o3I',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mma301-49273.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'mma301-49273',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mma301-49273.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '900323399660',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:900323399660:web:0e41565a2b66e945a112c9',
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
