import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "drafts";

/**
 * Create a new draft in Firestore
 */
export async function createDraft(draftData) {
  try {
    // Extract id if present (Firestore will generate its own)
    const { id, ...draftWithoutId } = draftData;
    
    // Prepare the draft data for Firestore
    // Keep createdAt if provided, otherwise use serverTimestamp
    const firestoreData = {
      ...draftWithoutId,
      createdAt: draftData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const draftRef = await addDoc(collection(db, COLLECTION_NAME), firestoreData);
    return { id: draftRef.id, ...draftData };
  } catch (error) {
    console.error("Error creating draft:", error);
    throw error;
  }
}

/**
 * Get all drafts from Firestore
 */
export async function getAllDrafts() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const drafts = [];
    querySnapshot.forEach((doc) => {
      drafts.push({ id: doc.id, ...doc.data() });
    });
    return drafts;
  } catch (error) {
    console.error("Error getting drafts:", error);
    throw error;
  }
}

/**
 * Get a single draft by ID
 */
export async function getDraftById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting draft:", error);
    throw error;
  }
}

/**
 * Update a draft in Firestore
 */
export async function updateDraft(id, updates) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id, ...updates };
  } catch (error) {
    console.error("Error updating draft:", error);
    throw error;
  }
}

/**
 * Delete a draft from Firestore
 */
export async function deleteDraft(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting draft:", error);
    throw error;
  }
}

/**
 * Helper function to convert Firestore timestamps to ISO strings
 */
function convertTimestamp(timestamp) {
  if (!timestamp) return timestamp;
  // If it's a Firestore Timestamp, convert it
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  // If it's already a string, return as-is
  return timestamp;
}

/**
 * Subscribe to real-time updates of all drafts
 */
export function subscribeToDrafts(callback) {
  // Try to order by createdAt, but handle errors gracefully
  let q;
  try {
    q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  } catch (error) {
    // If orderBy fails (e.g., mixed types), just get all documents
    console.warn("Could not order by createdAt, fetching all:", error);
    q = query(collection(db, COLLECTION_NAME));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const drafts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drafts.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore timestamps to ISO strings for compatibility
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        approvedAt: convertTimestamp(data.approvedAt),
        // Convert version timestamps
        versions: data.versions?.map(v => ({
          ...v,
          createdAt: convertTimestamp(v.createdAt)
        })) || []
      });
    });
    
    // Sort by createdAt descending (newest first) as fallback
    drafts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    callback(drafts);
  }, (error) => {
    console.error("Error in drafts subscription:", error);
    callback([]);
  });
}

