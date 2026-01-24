import { deleteCookie, setCookie } from "cookies-next";
import { onIdTokenChanged, User } from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { getProfileStatus } from "fitness/utils/spec";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Firebase auth state
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        deleteCookie("idToken");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);
      setLoading(false);

      const token = await user.getIdToken();
      setCookie("idToken", token);
    });

    return unsubscribe;
  }, []);

  // Redirect decision (wrapper-based)
  useEffect(() => {
    if (!loading && user) {
      getProfileStatus().then(({ hasProfile }) => {
        if (hasProfile) {
          router.push("/dashboard");
        } else {
          router.push("/profile");
        }
      });
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
