import { deleteCookie, setCookie } from "cookies-next";
import { onIdTokenChanged, User } from "firebase/auth";
import { createUser, getProfileStatus } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";

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
      const token = await user.getIdToken();
      setCookie("idToken", token);
      try {
        await createUser();
        setLoading(false);
      } catch {
        deleteCookie("idToken");
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Redirect decision (wrapper-based)
  useEffect(() => {
    if (!loading && user && (router.pathname === "/" || router.pathname.startsWith("/auth/"))) {
      getProfileStatus().then(({ onboardingCompleted }) => {
        router.push(onboardingCompleted ? "/dashboard" : "/onboarding");
      });
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
