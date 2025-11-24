import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "users";

/**
 * Get user data by UID
 */
export async function getUserData(uid) {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { uid: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

/**
 * Create or update user data
 */
export async function setUserData(uid, userData) {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { uid, ...userData };
  } catch (error) {
    console.error("Error setting user data:", error);
    throw error;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(uid, role) {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

