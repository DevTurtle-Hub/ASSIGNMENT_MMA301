import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '../types/user';

const USERS_COLLECTION = 'users';

/**
 * Creates or updates a user document in Firestore under `users/{uid}`
 * Matches Functional Requirement 1:
 * fields: id, name, email, avatarUrl, createdAt
 */
export const createUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, profile.id);
    await setDoc(userRef, {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl || '',
      createdAt: profile.createdAt,
    });
  } catch (error) {
    console.error('[authService] Error creating user profile:', error);
    throw error;
  }
};

/**
 * Fetches the user profile document from Firestore by user UID
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('[authService] Error getting user profile:', error);
    return null;
  }
};

/**
 * Gets all user profiles (useful for assignee dropdowns)
 */
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map((docSnap) => docSnap.data() as UserProfile);
  } catch (error) {
    console.error('[authService] Error getting all users:', error);
    return [];
  }
};
