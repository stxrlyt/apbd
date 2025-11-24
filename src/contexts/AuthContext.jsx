import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserData, setUserData } from "../firebase/usersService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserDataState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user data including role
        try {
          const data = await getUserData(firebaseUser.uid);
          if (data) {
            setUserDataState(data);
          } else {
            // Create user data if it doesn't exist
            const newUserData = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              role: "other", // Default role
              createdAt: new Date().toISOString()
            };
            await setUserData(firebaseUser.uid, newUserData);
            setUserDataState({ uid: firebaseUser.uid, ...newUserData });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserDataState(null);
        }
      } else {
        setUser(null);
        setUserDataState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user data with default role
      const newUserData = {
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.email?.split("@")[0] || "User",
        role: "other", // Default role
        createdAt: new Date().toISOString()
      };
      await setUserData(userCredential.user.uid, newUserData);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    role: userData?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

