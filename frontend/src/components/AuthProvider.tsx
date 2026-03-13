"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch role from Firestore if available
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            // Wait for the login page to set it if it's a new sign in
            setRole(localStorage.getItem("pending_role") || "Worker"); // fallback
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("Worker");
        }
      } else {
        setRole(null);
        if (pathname !== "/login") {
            router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
