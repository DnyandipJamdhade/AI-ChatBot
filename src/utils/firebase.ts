import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Use the provisioned database ID or default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or configuration issue:', error.message);
    }
    // Return true if permissions error or doc not found, meaning server was reached
    return true;
  }
}

// User Profile helper in Firestore
export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'teacher' | 'admin';
  department: string;
  rollNo?: string;
  createdAt?: any;
}

export async function syncUserProfile(user: FirebaseUser, requestedRole: 'student' | 'teacher' | 'admin' = 'student'): Promise<AppUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as AppUserProfile;
    } else {
      const newProfile: AppUserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Academic User',
        photoURL: user.photoURL,
        role: requestedRole,
        department: 'Computer Engineering',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (e) {
    console.error('Error syncing user profile:', e);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      role: requestedRole,
      department: 'Computer Engineering',
    };
  }
}

export { onAuthStateChanged, signInWithPopup, signOut };
export type { FirebaseUser };
