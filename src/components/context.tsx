import { onIdTokenChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { setCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!auth) {
      console.error("Auth is not initialized");
      return;
    }
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!user) {
        deleteCookie("idToken");
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(user);
      setLoading(false);
      user.getIdToken().then((token) => {
        setCookie("idToken", token);
      });
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
  );
};

